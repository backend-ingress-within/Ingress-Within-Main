/**
 * Authoritative Therapy Pricing, Tax Classification, and Platform Fee Configuration
 * 
 * Legal Entity: RUMINARI (OPC) PVT LTD, Ahmedabad, Gujarat, India.
 * 
 * Tax Classification Invariants:
 * 1. Therapy Session Healthcare Service (SAC 999312):
 *    - Mental healthcare and clinical therapy services provided by clinical psychologists
 *      or authorized healthcare professionals are exempt from GST under Notification
 *      No. 12/2017-Central Tax (Rate), Heading 9993.
 *    - Default tax treatment: Exempt (0% GST).
 *    - Configurable if non-exempt counseling/coaching services are designated.
 * 
 * 2. Platform Administration Service (SAC 998599):
 *    - Covers platform infrastructure, client & therapist dashboard management,
 *      booking coordination, technical infrastructure, and operational support.
 *    - Charged separately from the therapist's session fee.
 *    - Standard platform fee: ₹99 (9,900 paise) inclusive of 18% GST.
 *    - Base value before tax: ₹83.90 (8,390 paise).
 *    - GST included (18%): ₹15.10 (1,510 paise).
 *      - Intra-state (Gujarat): CGST 9% (₹7.55) + SGST 9% (₹7.55) = ₹15.10
 *      - Inter-state: IGST 18% = ₹15.10
 * 
 * 3. Therapist Earnings Boundary:
 *    - The ₹99 platform fee belongs 100% to the platform (RUMINARI (OPC) PVT LTD).
 *    - It is NEVER added to therapist gross earnings or withdrawable balances.
 *    - Therapist commission and payouts are calculated exclusively from the therapy session fee.
 */

export interface TherapyPricingTaxBreakdown {
  sacCode: string;
  taxableValuePaise: number;
  taxableValueInr: number;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalGstPaise: number;
  totalGstInr: number;
}

export interface AuthoritativeTherapyPricing {
  // 1. Therapy Session Component
  therapyFeeInr: number;
  therapyFeePaise: number;
  therapyGstRate: number;
  therapyGstPaise: number;
  therapyGstInr: number;
  isTherapyGstExempt: boolean;
  therapySacCode: string;

  // 2. Platform Fee Component (Inclusive of GST)
  platformFeeInr: number;
  platformFeePaise: number;
  platformFeeGstRate: number;
  platformFeeNetPaise: number;
  platformFeeNetInr: number;
  platformFeeGstPaise: number;
  platformFeeGstInr: number;
  platformFeeDescription: string;
  platformSacCode: string;
  platformTaxBreakdown: TherapyPricingTaxBreakdown;

  // 3. Overall Totals
  totalPaise: number;
  totalInr: number;
  currency: string;

  // 4. Backward Compatibility Aliases
  subtotalInr: number; // Therapy session fee
  subtotalPaise: number;
  gstPaise: number; // Total GST across all components (therapy + platform)
  gstInr: number;
}

export class TherapyPricingConfig {
  /**
   * Standard ₹99 platform fee (in integer paise: 9,900 paise)
   */
  static readonly PLATFORM_FEE_PAISE = 9900;
  static readonly PLATFORM_FEE_INR = 99;

  /**
   * Platform fee GST rate (18% for online platform management & support services)
   */
  static readonly PLATFORM_FEE_GST_RATE = 0.18;

  /**
   * Platform fee public description
   */
  static readonly PLATFORM_FEE_DESCRIPTION =
    'Platform fee for administrative operations, booking management, and access to the Ingress Within platform.';

  /**
   * Default fallback therapy fee if therapist fee is unset
   */
  static readonly DEFAULT_THERAPY_FEE_INR = 1500;

  /**
   * Whether clinical healthcare therapy is exempt from GST under Notification 12/2017-Central Tax (Rate)
   */
  static readonly THERAPY_SERVICE_TAX_EXEMPT = true;

  /**
   * GST rate on therapy service if non-exempt (default: 0.0)
   */
  static readonly THERAPY_SERVICE_GST_RATE = 0.0;

  /**
   * SAC Codes
   */
  static readonly SAC_CODE_HEALTHCARE = '999312'; // Clinical psychology / healthcare service (Exempt)
  static readonly SAC_CODE_PLATFORM = '998599';   // Other support / platform administration services (Taxable @ 18%)

  /**
   * Corporate & Tax Invariants
   */
  static readonly LEGAL_ENTITY_NAME = 'RUMINARI (OPC) PVT LTD';
  static readonly OPERATIONAL_LOCATION = 'Ahmedabad, Gujarat, India';
  static readonly STATE_CODE_GUJARAT = '24';

  /**
   * Refund Policy Configuration:
   * - Full refund window: 48+ hours prior to consultation
   * - Platform fee refundability:
   *   - Client-initiated cancellation: True (if client receives therapy refund, full amount including ₹99 platform fee is refunded)
   *   - Therapist / Admin cancellation: True (100% full refund including platform fee)
   */
  static readonly FULL_REFUND_WINDOW_HOURS = 48;
  static readonly PLATFORM_FEE_REFUNDABLE_ON_CLIENT_CANCEL = true;
  static readonly PLATFORM_FEE_REFUNDABLE_ON_THERAPIST_CANCEL = true;

  /**
   * Calculates comprehensive authoritative pricing for a therapy session.
   * Uses precise integer paise calculations and exact reverse-GST extraction.
   * 
   * @param baseFeeInr Therapist session fee in Rupees (e.g. 1500)
   * @param options Optional custom tax treatment overrides
   */
  static calculatePricing(
    baseFeeInr: number,
    options?: {
      isTherapyExempt?: boolean;
      therapyGstRate?: number;
      isInterState?: boolean;
    }
  ): AuthoritativeTherapyPricing {
    const therapyInr = Math.max(0, Number(baseFeeInr) || this.DEFAULT_THERAPY_FEE_INR);
    const therapyFeePaise = Math.round(therapyInr * 100);

    const isTherapyExempt =
      options?.isTherapyExempt !== undefined
        ? options.isTherapyExempt
        : this.THERAPY_SERVICE_TAX_EXEMPT;

    const therapyGstRate = isTherapyExempt
      ? 0.0
      : (options?.therapyGstRate !== undefined ? options.therapyGstRate : this.THERAPY_SERVICE_GST_RATE);

    const therapyGstPaise = isTherapyExempt ? 0 : Math.round(therapyFeePaise * therapyGstRate);
    const therapyGstInr = therapyGstPaise / 100;

    // Platform Fee: ₹99 (9,900 paise) inclusive of 18% GST
    // Pre-tax taxable value = Round(9900 / (1 + 0.18)) = 8390 paise (₹83.90)
    // GST = 9900 - 8390 = 1510 paise (₹15.10)
    const platformFeePaise = this.PLATFORM_FEE_PAISE;
    const platformGstRate = this.PLATFORM_FEE_GST_RATE;
    const platformFeeNetPaise = Math.round(platformFeePaise / (1 + platformGstRate)); // 8390
    const platformFeeGstPaise = platformFeePaise - platformFeeNetPaise; // 1510
    const platformFeeNetInr = platformFeeNetPaise / 100; // 83.90
    const platformFeeGstInr = platformFeeGstPaise / 100; // 15.10

    // Intra-state vs Inter-state GST breakdown on platform fee
    const isInterState = Boolean(options?.isInterState);
    const cgstPaise = isInterState ? 0 : Math.round(platformFeeGstPaise / 2); // 755
    const sgstPaise = isInterState ? 0 : platformFeeGstPaise - cgstPaise;    // 755
    const igstPaise = isInterState ? platformFeeGstPaise : 0;                 // 1510 if inter-state

    const platformTaxBreakdown: TherapyPricingTaxBreakdown = {
      sacCode: this.SAC_CODE_PLATFORM,
      taxableValuePaise: platformFeeNetPaise,
      taxableValueInr: platformFeeNetInr,
      gstRate: platformGstRate,
      cgstRate: isInterState ? 0 : platformGstRate / 2,
      sgstRate: isInterState ? 0 : platformGstRate / 2,
      cgstPaise,
      sgstPaise,
      igstPaise,
      totalGstPaise: platformFeeGstPaise,
      totalGstInr: platformFeeGstInr,
    };

    // Overall Total: Therapy Fee + Therapy GST + Platform Fee (Inclusive)
    const totalPaise = therapyFeePaise + therapyGstPaise + platformFeePaise;
    const totalInr = totalPaise / 100;

    // Total GST across both components
    const totalGstPaise = therapyGstPaise + platformFeeGstPaise;
    const totalGstInr = totalGstPaise / 100;

    return {
      therapyFeeInr: therapyInr,
      therapyFeePaise,
      therapyGstRate,
      therapyGstPaise,
      therapyGstInr,
      isTherapyGstExempt: isTherapyExempt,
      therapySacCode: this.SAC_CODE_HEALTHCARE,

      platformFeeInr: this.PLATFORM_FEE_INR,
      platformFeePaise,
      platformFeeGstRate: platformGstRate,
      platformFeeNetPaise,
      platformFeeNetInr,
      platformFeeGstPaise,
      platformFeeGstInr,
      platformFeeDescription: this.PLATFORM_FEE_DESCRIPTION,
      platformSacCode: this.SAC_CODE_PLATFORM,
      platformTaxBreakdown,

      totalPaise,
      totalInr,
      currency: 'INR',

      // Backward compatibility aliases
      subtotalInr: therapyInr,
      subtotalPaise: therapyFeePaise,
      gstPaise: totalGstPaise,
      gstInr: totalGstInr,
    };
  }
}
