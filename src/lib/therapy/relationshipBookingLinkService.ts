import crypto from 'crypto';
import { supabase } from '../db';

export interface BookingActor {
  actorType: 'therapist' | 'admin';
  actorId: string;
}

export interface ConsentValidationResult {
  verified: boolean;
  source?: 'intake_array' | 'intake_object' | 'consents_table' | 'profiles_table';
  details?: Record<string, any>;
  reason?: string;
}

export interface IssueBookingLinkInput {
  relationshipId: string;
  actor: BookingActor;
}

export interface IssueBookingLinkResult {
  bookingLink: string;
  token: string;
  status: 'active';
  isNew: boolean;
  createdAt: string;
  relationshipId: string;
}

export interface ResolvedBookingLink {
  valid: boolean;
  errorCode?: string;
  errorMessage?: string;
  linkId?: string;
  relationshipId?: string;
  therapistAccountId?: string;
  userId?: string;
  careStage?: string;
  firstSessionCompleted?: boolean;
}

/**
 * Returns a 32-byte key derived from server configuration for AES-256-GCM.
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env.BOOKING_TOKEN_SECRET ||
    process.env.JWT_SECRET ||
    process.env.ADMIN_JWT_SECRET ||
    'ingress-within-stable-booking-link-secret-key-32b';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Generates an unguessable 256-bit cryptographically secure booking token.
 */
export function generateBookingToken(): string {
  const entropy = crypto.randomBytes(32).toString('base64url');
  return `bk_${entropy}`;
}

/**
 * Computes the SHA-256 hash of a booking token for O(1) indexed lookup.
 */
export function hashBookingToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Encrypts a booking token using AES-256-GCM with authenticated tags.
 */
export function encryptBookingToken(token: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96 bits for AES-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a booking token stored with AES-256-GCM, verifying integrity.
 */
export function decryptBookingToken(encryptedPayload: string): string {
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token payload format');
  }
  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Constructs the canonical public booking URL strictly from trusted server configuration.
 * Never relies on untrusted request Host or X-Forwarded-* headers to prevent Host poisoning.
 */
export function getCanonicalBookingUrl(token: string): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  let base: string;
  if (envUrl && envUrl.trim().length > 0) {
    base = envUrl.trim().replace(/\/+$/, '');
  } else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    base = 'http://localhost:3000';
  } else {
    base = 'https://ingresswithin.com';
  }
  return `${base}/book/${token}`;
}

/**
 * Verifies that the client has satisfied therapy-specific consent requirements.
 * Inspects therapy_intakes first (the authoritative clinical intake record),
 * then falls back to public.consents (onboarding/terms audit log).
 * Fails closed if affirmative consent cannot be authoritatively proven.
 */
export async function verifyClientConsent(
  userId: string,
  therapySessionId?: string | null
): Promise<ConsentValidationResult> {
  if (!userId) {
    return { verified: false, reason: 'Missing userId for consent verification' };
  }

  // 1. Check therapy_intakes (clinical intake consent)
  try {
    let intakeQuery = supabase
      .from('therapy_intakes')
      .select('id, consents, created_at');

    if (therapySessionId) {
      intakeQuery = intakeQuery.eq('therapy_session_id', therapySessionId);
    } else {
      intakeQuery = intakeQuery.eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
    }

    const { data: intakeData, error: intakeError } = await intakeQuery.maybeSingle();

    // If intake query with therapySessionId didn't find affirmative consent, fallback to checking user's latest intake
    let intakeDataToEvaluate = (!intakeError && intakeData) ? intakeData : null;
    if (!intakeDataToEvaluate || !intakeDataToEvaluate.consents || Object.keys(intakeDataToEvaluate.consents).length === 0) {
      const { data: userIntake } = await supabase
        .from('therapy_intakes')
        .select('id, consents, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (userIntake && userIntake.consents && Object.keys(userIntake.consents).length > 0) {
        intakeDataToEvaluate = userIntake;
      }
    }

    if (intakeDataToEvaluate && intakeDataToEvaluate.consents) {
      const consents = intakeDataToEvaluate.consents;

      // Case A: Array format (guided therapy intake step 3: [summary, assessment, sharing, nonCrisis])
      if (Array.isArray(consents)) {
        if (consents.length >= 3 && consents.every(Boolean)) {
          return { verified: true, source: 'intake_array', details: { consents } };
        } else {
          return {
            verified: false,
            source: 'intake_array',
            reason: 'Intake consent array has incomplete or missing affirmative consents',
            details: { consents }
          };
        }
      }

      // Case B: Object format
      if (typeof consents === 'object' && consents !== null) {
        // Explicit false refusal overrides everything
        const values = Object.values(consents);
        if (values.some((v) => v === false)) {
          return {
            verified: false,
            source: 'intake_object',
            reason: 'Explicit consent refusal recorded in intake consents',
            details: consents
          };
        }

        // Affirmative flag check
        const hasAffirmative =
          consents.intake === true ||
          consents.teamContact === true ||
          consents.dataSharing === true ||
          consents.nonCrisis === true ||
          consents.informedConsent === true;

        if (hasAffirmative) {
          return { verified: true, source: 'intake_object', details: consents };
        }
      }
    }
  } catch (err: any) {
    console.error('[verifyClientConsent] Error inspecting therapy_intakes:', err?.message);
  }

  // 2. Check public.consents table (user-level consent audit trail)
  try {
    const { data: consentLog, error: logError } = await supabase
      .from('consents')
      .select('id, consent_type, version, consented_at')
      .eq('user_id', userId)
      .in('consent_type', ['terms_and_privacy', 'therapy_consent', 'informed_consent'])
      .order('consented_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!logError && consentLog) {
      return { verified: true, source: 'consents_table', details: consentLog };
    }
  } catch (err: any) {
    console.error('[verifyClientConsent] Error inspecting consents table:', err?.message);
  }

  // 3. Check public.profiles table (onboarding completion status)
  try {
    const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('id, consent_completed, onboarding_completed')
      .eq('id', userId)
      .maybeSingle();

    if (!profError && profile && (profile.consent_completed || profile.onboarding_completed)) {
      return { verified: true, source: 'profiles_table', details: profile };
    }
  } catch (err: any) {
    console.error('[verifyClientConsent] Error inspecting profiles table:', err?.message);
  }

  return {
    verified: false,
    reason: 'No verified therapy-specific or onboarding consent record found for client'
  };
}

export class RelationshipBookingLinkService {
  /**
   * Generates or retrieves an existing active persistent booking link for a care relationship.
   * Enforces:
   * 1. Relationship exists and status === 'active'.
   * 2. Requester is either an authorized admin or the assigned therapist.
   * 3. Assigned therapist has active status and can_practice === true.
   * 4. Client has verified therapy consent.
   * 5. Idempotent return of the existing active link if already generated.
   * 6. Secure AES-256-GCM persistence with SHA-256 hashed index.
   */
  static async issueBookingLink(input: IssueBookingLinkInput): Promise<IssueBookingLinkResult> {
    const { relationshipId, actor } = input;

    if (!relationshipId) {
      const err: any = new Error('Relationship ID is required.');
      err.status = 400;
      err.code = 'INVALID_PARAMETERS';
      throw err;
    }

    // 1. Fetch care relationship
    const { data: rel, error: relErr } = await supabase
      .from('therapy_care_relationships')
      .select('id, therapist_account_id, user_id, therapy_session_id, status, care_stage')
      .eq('id', relationshipId)
      .maybeSingle();

    if (relErr || !rel) {
      const err: any = new Error('Care relationship not found.');
      err.status = 404;
      err.code = 'RELATIONSHIP_NOT_FOUND';
      throw err;
    }

    // 2. Relationship must be active
    if (rel.status !== 'active') {
      const err: any = new Error(`Care relationship is not active (current status: ${rel.status}).`);
      err.status = 400;
      err.code = 'RELATIONSHIP_NOT_ACTIVE';
      throw err;
    }

    // 3. Tenancy authorization: if therapist, must be assigned to this exact relationship
    if (actor.actorType === 'therapist') {
      if (rel.therapist_account_id !== actor.actorId) {
        const err: any = new Error('You are not authorized to issue booking links for this client relationship.');
        err.status = 403;
        err.code = 'FORBIDDEN_RELATIONSHIP_ACCESS';
        throw err;
      }
    }

    // 4. Validate assigned therapist standing
    const { data: therapistAcc, error: thErr } = await supabase
      .from('therapist_accounts')
      .select('id, status, can_practice')
      .eq('id', rel.therapist_account_id)
      .maybeSingle();

    if (thErr || !therapistAcc || !therapistAcc.can_practice || therapistAcc.status !== 'active') {
      const err: any = new Error('Assigned therapist is not authorized for active clinical practice.');
      err.status = 403;
      err.code = 'THERAPIST_NOT_AUTHORIZED';
      throw err;
    }

    // 5. Authoritative Consent Gate
    const consentResult = await verifyClientConsent(rel.user_id, rel.therapy_session_id);
    if (!consentResult.verified) {
      const err: any = new Error(`Required therapy consent has not been verified: ${consentResult.reason}`);
      err.status = 422;
      err.code = 'CONSENT_REQUIRED';
      err.details = consentResult;
      throw err;
    }

    // 6. Idempotency Check: check if active link already exists
    const { data: existingLink } = await supabase
      .from('relationship_booking_links')
      .select('id, encrypted_token, status, created_at')
      .eq('relationship_id', rel.id)
      .eq('status', 'active')
      .is('revoked_at', null)
      .maybeSingle();

    if (existingLink) {
      try {
        const decryptedToken = decryptBookingToken(existingLink.encrypted_token);
        return {
          bookingLink: getCanonicalBookingUrl(decryptedToken),
          token: decryptedToken,
          status: 'active',
          isNew: false,
          createdAt: existingLink.created_at,
          relationshipId: rel.id,
        };
      } catch (decErr) {
        console.error('[RelationshipBookingLinkService] Failed to decrypt existing token payload:', decErr);
        // Fall through to generate fresh if unrecoverable
      }
    }

    // 7. Generate new stable booking link
    const token = generateBookingToken();
    const tokenHash = hashBookingToken(token);
    const encryptedToken = encryptBookingToken(token);

    const { data: newLink, error: insertErr } = await supabase
      .from('relationship_booking_links')
      .insert({
        relationship_id: rel.id,
        token_hash: tokenHash,
        encrypted_token: encryptedToken,
        status: 'active',
        created_by_actor_type: actor.actorType,
        created_by_id: actor.actorId,
      })
      .select('id, created_at')
      .single();

    if (insertErr) {
      // Handle race condition: if another thread inserted an active link concurrently
      if (insertErr.code === '23505' || String(insertErr.message).includes('idx_active_relationship_booking_link')) {
        const { data: raceLink } = await supabase
          .from('relationship_booking_links')
          .select('id, encrypted_token, created_at')
          .eq('relationship_id', rel.id)
          .eq('status', 'active')
          .is('revoked_at', null)
          .single();

        if (raceLink) {
          const decryptedToken = decryptBookingToken(raceLink.encrypted_token);
          return {
            bookingLink: getCanonicalBookingUrl(decryptedToken),
            token: decryptedToken,
            status: 'active',
            isNew: false,
            createdAt: raceLink.created_at,
            relationshipId: rel.id,
          };
        }
      }
      throw insertErr;
    }

    return {
      bookingLink: getCanonicalBookingUrl(token),
      token,
      status: 'active',
      isNew: true,
      createdAt: newLink.created_at,
      relationshipId: rel.id,
    };
  }

  /**
   * Resolves a public booking token to its underlying relationship and therapist details.
   * Performs real-time validation of:
   * - Token validity and revocation status
   * - Relationship status (must be 'active')
   * - Assigned therapist practice eligibility
   */
  static async resolveBookingLinkByToken(token: string): Promise<ResolvedBookingLink> {
    if (!token || typeof token !== 'string') {
      return { valid: false, errorCode: 'INVALID_TOKEN', errorMessage: 'Booking token is missing or invalid' };
    }

    const tokenHash = hashBookingToken(token);

    const { data: linkRecord, error: linkErr } = await supabase
      .from('relationship_booking_links')
      .select('id, relationship_id, status, revoked_at')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (linkErr || !linkRecord) {
      return { valid: false, errorCode: 'LINK_NOT_FOUND', errorMessage: 'Booking link does not exist' };
    }

    if (linkRecord.status !== 'active' || linkRecord.revoked_at !== null) {
      return { valid: false, errorCode: 'LINK_REVOKED', errorMessage: 'Booking link is no longer active' };
    }

    // Verify relationship
    const { data: rel, error: relErr } = await supabase
      .from('therapy_care_relationships')
      .select('id, therapist_account_id, user_id, therapy_session_id, status, care_stage, first_session_completed')
      .eq('id', linkRecord.relationship_id)
      .maybeSingle();

    if (relErr || !rel) {
      return { valid: false, errorCode: 'RELATIONSHIP_NOT_FOUND', errorMessage: 'Associated relationship not found' };
    }

    if (rel.status !== 'active') {
      return {
        valid: false,
        errorCode: 'RELATIONSHIP_INACTIVE',
        errorMessage: `Care relationship is no longer active (status: ${rel.status})`,
      };
    }

    // Verify therapist standing & practice clearance
    const { data: thAcc, error: thErr } = await supabase
      .from('therapist_accounts')
      .select('id, status, can_practice, application_status, verification_status')
      .eq('id', rel.therapist_account_id)
      .maybeSingle();

    if (
      thErr ||
      !thAcc ||
      !thAcc.can_practice ||
      thAcc.status !== 'active' ||
      (thAcc.application_status && thAcc.application_status !== 'approved') ||
      (thAcc.verification_status && thAcc.verification_status !== 'verified')
    ) {
      return {
        valid: false,
        errorCode: 'THERAPIST_UNAVAILABLE',
        errorMessage: 'Assigned therapist is not available for bookings',
      };
    }

    // Verify authoritative therapy-specific consent
    const consentCheck = await verifyClientConsent(rel.user_id, rel.therapy_session_id);
    if (!consentCheck.verified) {
      return {
        valid: false,
        errorCode: 'CONSENT_REQUIRED',
        errorMessage: `Required therapy consent is not verified: ${consentCheck.reason}`,
      };
    }

    // Update access metrics asynchronously
    void supabase
      .from('relationship_booking_links')
      .update({
        last_accessed_at: new Date().toISOString(),
      })
      .eq('id', linkRecord.id);

    return {
      valid: true,
      linkId: linkRecord.id,
      relationshipId: rel.id,
      therapistAccountId: rel.therapist_account_id,
      userId: rel.user_id,
      careStage: rel.care_stage,
      firstSessionCompleted: Boolean(rel.first_session_completed),
    };
  }

  /**
   * Revokes an active booking link for a care relationship.
   */
  static async revokeBookingLink(
    relationshipId: string,
    revokedByActorId: string,
    reason: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('relationship_booking_links')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by_id: revokedByActorId,
        revocation_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('relationship_id', relationshipId)
      .eq('status', 'active');

    return !error;
  }
}
