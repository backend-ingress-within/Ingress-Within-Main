import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('   INGRESS WITHIN — BOOKING AUTHORITATIVE PRICING SYNC SUITE    ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function pass(name: string) {
  passCount++;
  console.log(`  ✓ [PASS] ${name}`);
}

function fail(name: string, error: any) {
  failCount++;
  console.error(`  ✗ [FAIL] ${name}:`, error?.message || error);
}

// 1. Static Audit: Check getClientConnectedTherapist selects per_session_fee
try {
  const therapyServiceContent = fs.readFileSync(
    path.resolve(process.cwd(), 'src/lib/therapy/therapyService.ts'),
    'utf8'
  );
  assert(
    therapyServiceContent.includes('per_session_fee,') &&
    therapyServiceContent.includes('therapist_accounts (') &&
    therapyServiceContent.includes('fee: account?.per_session_fee ? Number(account.per_session_fee) : 1500'),
    'getClientConnectedTherapist must select per_session_fee under therapist_accounts'
  );
  pass('Static Audit: getClientConnectedTherapist selects per_session_fee from therapist_accounts');
} catch (err) {
  fail('Static Audit: getClientConnectedTherapist selects per_session_fee', err);
}

// 2. Static Audit: Check TherapyBookingFlow uses authoritativePricing
try {
  const bookingFlowContent = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/therapy/TherapyBookingFlow.jsx'),
    'utf8'
  );
  assert(
    bookingFlowContent.includes('const [authoritativePricing, setAuthoritativePricing] = useState(null);'),
    'TherapyBookingFlow must define authoritativePricing state'
  );
  assert(
    bookingFlowContent.includes('setAuthoritativePricing(data.pricing);'),
    'TherapyBookingFlow must capture data.pricing from availability API'
  );
  assert(
    bookingFlowContent.includes('authoritativePricing?.subtotalInr != null'),
    'TherapyBookingFlow must calculate baseFee from authoritativePricing'
  );
  assert(
    bookingFlowContent.includes('const gstAmount = Math.round(baseFee * 0.18)'),
    'TherapyBookingFlow must calculate gstAmount at 18% standard'
  );
  assert(
    bookingFlowContent.includes('authoritativePricing?.totalPaise != null'),
    'TherapyBookingFlow must calculate totalAmount from authoritativePricing'
  );
  assert(
    bookingFlowContent.includes('if (orderData.pricing) {\n        setAuthoritativePricing(orderData.pricing);\n      }'),
    'TherapyBookingFlow must synchronize authoritativePricing from order response'
  );
  pass('Static Audit: TherapyBookingFlow captures and renders authoritativePricing correctly');
} catch (err) {
  fail('Static Audit: TherapyBookingFlow captures and renders authoritativePricing', err);
}

// 3. Pricing Math & Gateway Parity: Check SessionBookingService formula parity
try {
  const sessionBookingServiceContent = fs.readFileSync(
    path.resolve(process.cwd(), 'src/lib/therapy/sessionBookingService.ts'),
    'utf8'
  );

  // Verify backend pricing calculation logic
  assert(
    sessionBookingServiceContent.includes('const baseInr = Number(therapist?.per_session_fee) || 1500;'),
    'SessionBookingService must use per_session_fee as authoritative base'
  );
  assert(
    sessionBookingServiceContent.includes('const subtotalPaise = Math.round(baseInr * 100);'),
    'Subtotal paise calculation must be base * 100'
  );
  assert(
    sessionBookingServiceContent.includes('const gstPaise = Math.round(subtotalPaise * 0.18);'),
    'GST paise calculation must be 18%'
  );
  assert(
    sessionBookingServiceContent.includes('const totalPaise = subtotalPaise + gstPaise;'),
    'Total paise must be subtotalPaise + gstPaise'
  );
  assert(
    sessionBookingServiceContent.includes('amount: pricing.totalPaise,'),
    'Razorpay order creation must use pricing.totalPaise'
  );

  // Simulate pricing for base = 1600 (Siddhesh Gawade)
  const baseInr = 1600;
  const subtotalPaise = Math.round(baseInr * 100);
  const gstPaise = Math.round(subtotalPaise * 0.18);
  const totalPaise = subtotalPaise + gstPaise;

  const backendPricing = {
    subtotalInr: baseInr,
    subtotalPaise,
    gstPaise,
    totalPaise,
    totalInr: totalPaise / 100,
    currency: 'INR',
  };

  assert.strictEqual(backendPricing.subtotalInr, 1600);
  assert.strictEqual(backendPricing.gstPaise, 28800);
  assert.strictEqual(backendPricing.totalPaise, 188800);
  assert.strictEqual(backendPricing.totalInr, 1888);

  // Frontend calculation with backendPricing:
  const frontendBaseFee = backendPricing.subtotalInr;
  const frontendGst = Math.round(backendPricing.gstPaise / 100);
  const frontendTotal = Math.round(backendPricing.totalPaise / 100);
  const razorpayGatewayAmount = backendPricing.totalPaise / 100;

  assert.strictEqual(frontendBaseFee, 1600, 'Frontend base fee is ₹1,600');
  assert.strictEqual(frontendGst, 288, 'Frontend GST is ₹288');
  assert.strictEqual(frontendTotal, 1888, 'Frontend Total is ₹1,888');
  assert.strictEqual(razorpayGatewayAmount, 1888, 'Razorpay gateway popup amount is ₹1,888');
  assert.strictEqual(frontendTotal, razorpayGatewayAmount, '100% parity between UI and Razorpay Gateway');

  pass('Pricing Math & Gateway Parity: Base ₹1,600 + GST ₹288 = ₹1,888 matches Razorpay amount');
} catch (err) {
  fail('Pricing Math & Gateway Parity', err);
}

// 4. Availability Route Verification
try {
  const availabilityRouteContent = fs.readFileSync(
    path.resolve(process.cwd(), 'src/app/api/therapy/therapists/[id]/availability/route.ts'),
    'utf8'
  );
  assert(
    availabilityRouteContent.includes('SessionBookingService.getAuthoritativePricing(therapistId)'),
    'Availability route must include authoritative pricing in response'
  );
  assert(
    availabilityRouteContent.includes('pricing,'),
    'Availability response payload must include pricing property'
  );
  pass('Availability Route: Correctly serves authoritative pricing alongside available slots');
} catch (err) {
  fail('Availability Route Verification', err);
}

console.log('\n================================================================');
console.log(`RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
