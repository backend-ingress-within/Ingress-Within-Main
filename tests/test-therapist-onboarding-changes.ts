import fs from 'fs';
import path from 'path';

// Load .env before importing application modules
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const value = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch (e) {}

import assert from 'assert';
import { AdminPlatformService } from '../src/lib/admin/adminPlatformService';
import { TherapistPlatformService } from '../src/lib/therapist/therapistPlatformService';

async function runTestSuite() {
  console.log('================================================================');
  console.log('   THERAPIST ONBOARDING & DASHBOARD UPDATES TEST SUITE          ');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    total++;
    try {
      const res = fn();
      if (res && typeof (res as any).then === 'function') {
        return (res as any).then(() => {
          console.log(`  ✓ [PASS] ${name}`);
          passed++;
        }).catch((err: any) => {
          console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
          throw err;
        });
      } else {
        console.log(`  ✓ [PASS] ${name}`);
        passed++;
      }
    } catch (err: any) {
      console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
      throw err;
    }
  }

  // --- SECTION 1: Step 3 Validation (Online Only / Session Formats Removed) ---
  console.log('--- SECTION 1: Step 3 Online Only Validation ---');

  // Simulator helper mirroring TherapistOnboardingView validateCurrent
  function validateStep(step: number, answers: any) {
    if (step === 3 && (!answers.bio?.trim() || (answers.specialties || []).length < 1 || (answers.specialties || []).length > 5 || !(answers.languages || []).length || answers.feePerSession === '')) {
      return 'Please complete your bio, at least one specialty, language and fee.';
    }
    if (step === 7 && (!answers.capacitySource || answers.currentCapacity === '' || answers.maxCapacity === '' || !answers.gender || !(answers.ageGroups || []).length)) {
      return 'Please complete availability, capacity, gender and age groups.';
    }
    if (step === 8) {
      if (!answers.licenseNumber?.trim() || !answers.issuingBody?.trim() || !answers.degreeCertificate || !answers.backgroundCheckConsent) {
        return 'Please provide registration details, upload the degree certificate and consent to the background check.';
      }
      if (answers.primaryModalities && answers.primaryModalities.some((m: string) => !answers.primaryCertificates?.[m])) {
        return 'Please upload verification proof for each primary approach.';
      }
      if (Number(answers.yearsOfExperience || 0) < 3) {
        const sName = (answers.supervision?.supervisorName || '').trim();
        const sPhone = (answers.supervision?.supervisorPhone || '').trim();
        const sEmail = (answers.supervision?.supervisorEmail || '').trim();
        if (!sName) return 'Please provide your supervisor\'s name (required for therapists with less than 3 years of practical experience).';
        if (!sPhone && !sEmail) return 'Please provide at least one contact method for your supervisor (phone or email).';
        if (sEmail) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(sEmail)) return 'Please provide a valid supervisor email address.';
        }
      }
    }
    if (step === 9) {
      if (!answers.higherAcuityInterest) {
        return 'Please select whether you want to be considered for higher-acuity referrals.';
      }
      if (answers.higherAcuityInterest === 'Yes' && !(answers.higherAcuityExperience || '').trim()) {
        return 'Please provide details of your relevant experience with high-acuity cases (mandatory for higher-acuity referrals).';
      }
    }
    return '';
  }

  test('Step 3 succeeds without manual sessionFormats selection (online only)', () => {
    const validStep3Answers = {
      bio: 'Experienced clinical psychologist focusing on CBT and trauma.',
      specialties: ['Anxiety', 'Burnout'],
      languages: ['English', 'Hindi'],
      feePerSession: 1500,
      // Note: sessionFormats is omitted
    };
    const err = validateStep(3, validStep3Answers);
    assert.strictEqual(err, '', 'Step 3 should pass without sessionFormats');
  });

  // --- SECTION 2: Step 7 State Removal ---
  console.log('\n--- SECTION 2: Step 7 State Removal ---');

  test('Step 7 succeeds without state (state field removed from mandatory requirements)', () => {
    const validStep7Answers = {
      capacitySource: 'manual',
      currentCapacity: 10,
      maxCapacity: 20,
      soonestOpeningDays: 3,
      gender: 'Female',
      ageGroups: ['Adults'],
      state: '', // Empty state
    };
    const err = validateStep(7, validStep7Answers);
    assert.strictEqual(err, '', 'Step 7 should pass without state');
  });

  // --- SECTION 3: Step 8 Supervision Requirements (< 3 years experience) ---
  console.log('\n--- SECTION 3: Step 8 Supervision Requirements ---');

  test('Step 8 fails if yearsOfExperience < 3 and supervisorName is missing', () => {
    const answers = {
      yearsOfExperience: 2,
      licenseNumber: 'RCI-12345',
      issuingBody: 'RCI',
      degreeCertificate: { path: 'cert.pdf' },
      backgroundCheckConsent: true,
      supervision: {
        supervisorName: '',
        supervisorPhone: '+919876543210',
        supervisorEmail: 'sup@example.com',
      },
    };
    const err = validateStep(8, answers);
    assert(err.includes('Please provide your supervisor\'s name'));
  });

  test('Step 8 fails if yearsOfExperience < 3 and both phone and email are missing', () => {
    const answers = {
      yearsOfExperience: 1,
      licenseNumber: 'RCI-12345',
      issuingBody: 'RCI',
      degreeCertificate: { path: 'cert.pdf' },
      backgroundCheckConsent: true,
      supervision: {
        supervisorName: 'Dr. Supervisor',
        supervisorPhone: '',
        supervisorEmail: '',
      },
    };
    const err = validateStep(8, answers);
    assert(err.includes('Please provide at least one contact method for your supervisor'));
  });

  test('Step 8 fails if yearsOfExperience < 3 and supervisor email is invalid', () => {
    const answers = {
      yearsOfExperience: 2,
      licenseNumber: 'RCI-12345',
      issuingBody: 'RCI',
      degreeCertificate: { path: 'cert.pdf' },
      backgroundCheckConsent: true,
      supervision: {
        supervisorName: 'Dr. Supervisor',
        supervisorPhone: '',
        supervisorEmail: 'notanemail',
      },
    };
    const err = validateStep(8, answers);
    assert(err.includes('Please provide a valid supervisor email address'));
  });

  test('Step 8 succeeds if yearsOfExperience < 3 and supervisorName + phone are provided', () => {
    const answers = {
      yearsOfExperience: 2,
      licenseNumber: 'RCI-12345',
      issuingBody: 'RCI',
      degreeCertificate: { path: 'cert.pdf' },
      backgroundCheckConsent: true,
      supervision: {
        supervisorName: 'Dr. Supervisor',
        supervisorPhone: '+91 98765 43210',
        supervisorEmail: '',
      },
    };
    const err = validateStep(8, answers);
    assert.strictEqual(err, '');
  });

  test('Step 8 succeeds if yearsOfExperience < 3 and supervisorName + email are provided', () => {
    const answers = {
      yearsOfExperience: 2,
      licenseNumber: 'RCI-12345',
      issuingBody: 'RCI',
      degreeCertificate: { path: 'cert.pdf' },
      backgroundCheckConsent: true,
      supervision: {
        supervisorName: 'Dr. Supervisor',
        supervisorPhone: '',
        supervisorEmail: 'supervisor@example.com',
      },
    };
    const err = validateStep(8, answers);
    assert.strictEqual(err, '');
  });

  test('Step 8 succeeds if yearsOfExperience >= 3 without supervisor details (optional)', () => {
    const answers = {
      yearsOfExperience: 5,
      licenseNumber: 'RCI-12345',
      issuingBody: 'RCI',
      degreeCertificate: { path: 'cert.pdf' },
      backgroundCheckConsent: true,
      supervision: {
        status: 'not_required',
      },
    };
    const err = validateStep(8, answers);
    assert.strictEqual(err, '');
  });

  // --- SECTION 4: Step 9 Higher Acuity Mandatory Experience ---
  console.log('\n--- SECTION 4: Step 9 Higher-Acuity Experience ---');

  test('Step 9 fails if higherAcuityInterest is Yes but experience is empty', () => {
    const answers = {
      higherAcuityInterest: 'Yes',
      higherAcuityExperience: '',
    };
    const err = validateStep(9, answers);
    assert(err.includes('Please provide details of your relevant experience with high-acuity cases'));
  });

  test('Step 9 fails if higherAcuityInterest is Yes but experience is whitespace only', () => {
    const answers = {
      higherAcuityInterest: 'Yes',
      higherAcuityExperience: '   ',
    };
    const err = validateStep(9, answers);
    assert(err.includes('Please provide details of your relevant experience with high-acuity cases'));
  });

  test('Step 9 succeeds if higherAcuityInterest is Yes and experience details are provided', () => {
    const answers = {
      higherAcuityInterest: 'Yes',
      higherAcuityExperience: '5 years treating borderline personality disorder and acute PTSD at hospital inpatient unit.',
    };
    const err = validateStep(9, answers);
    assert.strictEqual(err, '');
  });

  test('Step 9 succeeds if higherAcuityInterest is No without experience', () => {
    const answers = {
      higherAcuityInterest: 'No',
      higherAcuityExperience: '',
    };
    const err = validateStep(9, answers);
    assert.strictEqual(err, '');
  });

  console.log('\n================================================================');
  console.log(`   ALL TESTS COMPLETED: ${passed}/${total} PASSED`);
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
