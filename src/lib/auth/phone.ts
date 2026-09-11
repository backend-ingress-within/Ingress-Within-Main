/**
 * Phone normalization and validation utility for Ingress Within.
 * 
 * Rules:
 * - India-only (+91 fixed)
 * - 10-digit mobile number starting with 6, 7, 8, or 9
 * - Canonical storage format: '+91XXXXXXXXXX' (E.164 without spaces)
 * - Server-side validation is authoritative
 */

export interface PhoneValidationResult {
  isValid: boolean;
  canonicalPhone?: string;
  formattedDisplay?: string;
  error?: string;
}

/**
 * Normalizes any Indian phone input into canonical E.164 format: '+91XXXXXXXXXX'.
 * Returns null if input cannot be normalized to a valid 10-digit Indian number.
 */
export function normalizePhoneNumber(rawInput: string): string | null {
  if (!rawInput || typeof rawInput !== 'string') return null;

  // Strip all non-digit characters
  const digitsOnly = rawInput.replace(/\D/g, '');

  let mobileDigits = '';

  if (digitsOnly.length === 10) {
    mobileDigits = digitsOnly;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    mobileDigits = digitsOnly.substring(1);
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    mobileDigits = digitsOnly.substring(2);
  } else if (digitsOnly.length === 13 && digitsOnly.startsWith('091')) {
    mobileDigits = digitsOnly.substring(3);
  } else if (digitsOnly.length === 14 && digitsOnly.startsWith('0091')) {
    mobileDigits = digitsOnly.substring(4);
  } else {
    return null;
  }

  // Validate Indian mobile operator prefix (6-9)
  if (!/^[6-9]\d{9}$/.test(mobileDigits)) {
    return null;
  }

  return `+91${mobileDigits}`;
}

/**
 * Validates an Indian phone number and returns the canonical format or standardized error.
 */
export function validateIndianPhone(rawInput: string): PhoneValidationResult {
  const canonical = normalizePhoneNumber(rawInput);

  if (!canonical) {
    return {
      isValid: false,
      error: "That doesn't look like a valid number."
    };
  }

  const mobile10 = canonical.substring(3);
  const formattedDisplay = `+91 ${mobile10.substring(0, 5)} ${mobile10.substring(5)}`;

  return {
    isValid: true,
    canonicalPhone: canonical,
    formattedDisplay
  };
}

/**
 * Formats a phone number for UI display (e.g. "+91 98765 43210").
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  const canonical = normalizePhoneNumber(phoneNumber);
  if (!canonical) return phoneNumber || '';
  const mobile10 = canonical.substring(3);
  return `+91 ${mobile10.substring(0, 5)} ${mobile10.substring(5)}`;
}

/**
 * Masks phone number for secure display / logs (e.g. "+91 98*** **210").
 */
export function maskPhoneNumber(phoneNumber: string): string {
  const canonical = normalizePhoneNumber(phoneNumber);
  if (!canonical) return '***';
  const mobile10 = canonical.substring(3);
  const first2 = mobile10.substring(0, 2);
  const last3 = mobile10.substring(7);
  return `+91 ${first2}*** **${last3}`;
}
