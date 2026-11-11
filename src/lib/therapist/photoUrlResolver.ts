'use strict';
/**
 * Therapist Photo URL Resolver
 * ============================
 * Normalizes and signs therapist profile photos stored in the private
 * `therapist-verification` Supabase Storage bucket (including legacy relative
 * paths, expired signed URLs, or mistakenly saved `/object/public/` URLs).
 */

import { supabase } from '../db';

export const VERIFICATION_BUCKET = 'therapist-verification';
const SIGNED_URL_TTL_SECONDS = 3600; // 1 hour

const BUCKET_URL_REGEX = /\/storage\/v1\/object\/(?:public|sign|authenticated)\/therapist-verification\/([^?#]+)/i;

/**
 * Picks the best raw photo string from profile + optional application answers.
 */
export function pickRawTherapistPhoto(
  profileImageUrl?: string | null,
  appAnswers?: Record<string, any> | null
): string | null {
  const candidates = [
    profileImageUrl,
    appAnswers?.photo?.path,
    typeof appAnswers?.photo === 'string' ? appAnswers.photo : null,
    appAnswers?.profileImageUrl,
    appAnswers?.photoUrl,
  ];

  for (const cand of candidates) {
    if (typeof cand === 'string' && cand.trim()) {
      return cand.trim();
    }
  }
  return null;
}

/**
 * Extracts the Supabase storage object path when a value refers to `therapist-verification`.
 * Returns `null` for data URIs or non-Supabase external HTTPS URLs.
 */
export function extractVerificationStoragePath(raw?: string | null): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('data:')) {
    return null;
  }

  const bucketMatch = trimmed.match(BUCKET_URL_REGEX);
  if (bucketMatch && bucketMatch[1]) {
    try {
      return decodeURIComponent(bucketMatch[1]).replace(/^\/+/, '');
    } catch {
      return bucketMatch[1].replace(/^\/+/, '');
    }
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return null;
  }

  return trimmed.replace(/^\/+/, '');
}

/**
 * Resolves a single therapist photo reference into a browser-loadable URL
 * (generating a fresh signed URL for private storage paths).
 */
export async function resolveTherapistPhotoUrl(
  profileImageUrl?: string | null,
  appAnswers?: Record<string, any> | null
): Promise<string | null> {
  const raw = pickRawTherapistPhoto(profileImageUrl, appAnswers);
  if (!raw) return null;

  const storagePath = extractVerificationStoragePath(raw);
  if (!storagePath) {
    return raw;
  }

  try {
    const { data, error } = await supabase.storage
      .from(VERIFICATION_BUCKET)
      .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  } catch (err) {
    console.warn('[PhotoUrlResolver] createSignedUrl notice:', err);
  }

  return null;
}

/**
 * Batch-resolves an array of raw photo references in a single Storage API call.
 * Returns a Map from original raw string to resolved URL.
 */
export async function resolveTherapistPhotoUrlsBatch(
  rawValues: Array<string | null | undefined>
): Promise<Map<string, string | null>> {
  const result = new Map<string, string | null>();
  const pathToRawKeys = new Map<string, string[]>();

  for (const val of rawValues) {
    if (typeof val !== 'string' || !val.trim()) continue;
    const trimmed = val.trim();
    const storagePath = extractVerificationStoragePath(trimmed);

    if (!storagePath) {
      result.set(trimmed, trimmed);
      continue;
    }

    const list = pathToRawKeys.get(storagePath) || [];
    list.push(trimmed);
    pathToRawKeys.set(storagePath, list);
  }

  const uniquePaths = Array.from(pathToRawKeys.keys());
  if (uniquePaths.length === 0) {
    return result;
  }

  try {
    const { data: signedList, error } = await supabase.storage
      .from(VERIFICATION_BUCKET)
      .createSignedUrls(uniquePaths, SIGNED_URL_TTL_SECONDS);

    if (!error && Array.isArray(signedList)) {
      for (const item of signedList) {
        if (item?.path && item?.signedUrl && !item.error) {
          const raws = pathToRawKeys.get(item.path) || [];
          for (const rawKey of raws) {
            result.set(rawKey, item.signedUrl);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[PhotoUrlResolver] Batch createSignedUrls notice:', err);
  }

  for (const [path, raws] of pathToRawKeys.entries()) {
    for (const rawKey of raws) {
      if (!result.has(rawKey)) {
        result.set(rawKey, null);
      }
    }
    void path;
  }

  return result;
}
