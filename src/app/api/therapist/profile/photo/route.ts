import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { requireTherapistProfile } from '../../../../../lib/therapist/therapistAuthHelper';
import { TherapistPlatformService } from '../../../../../lib/therapist/therapistPlatformService';
import {
  VERIFICATION_BUCKET,
  resolveTherapistPhotoUrl,
} from '../../../../../lib/therapist/photoUrlResolver';
import { supabase } from '../../../../../lib/db';

export const runtime = 'nodejs';

const BUCKET = VERIFICATION_BUCKET;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-160);
}

/**
 * Uploads and sets therapist profile picture.
 */
export async function POST(request: NextRequest) {
  try {
    const { account } = await requireTherapistProfile(request);

    const contentType = request.headers.get('content-type') || '';

    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');

      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: { code: 'FILE_REQUIRED', message: 'A photo file is required.' } },
          { status: 400 }
        );
      }

      if (file.size <= 0 || file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: { code: 'FILE_TOO_LARGE', message: 'Photo must be under 5 MB.' } },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: { code: 'UNSUPPORTED_FILE_TYPE', message: 'Only JPEG, PNG and WebP images are allowed.' } },
          { status: 400 }
        );
      }

      const safeFile = sanitizeFilename(file.name);
      const storagePath = `${account.id}/profile_photo/${randomUUID()}-${safeFile}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      try {
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, buffer, { contentType: file.type, upsert: true });

        if (uploadError) {
          console.warn('[ProfilePhotoRoute] Storage upload notice:', uploadError.message);
          // Fallback to safe base64 data uri if bucket upload fails in dev
          imageUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
        } else {
          // Persist canonical storage path in DB so future reads always generate fresh signed URLs
          imageUrl = storagePath;
        }
      } catch (err: any) {
        console.warn('[ProfilePhotoRoute] Upload exception, fallback to data URI:', err.message);
        imageUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
      }
    } else {
      // JSON body with direct URL
      const body = await request.json().catch(() => ({}));
      if (!body.profile_image_url || typeof body.profile_image_url !== 'string') {
        return NextResponse.json(
          { error: { code: 'INVALID_INPUT', message: 'profile_image_url is required.' } },
          { status: 400 }
        );
      }
      imageUrl = body.profile_image_url.trim();
    }

    const updatedProfile = await TherapistPlatformService.updateProfile(account.id, {
      profile_image_url: imageUrl,
    });

    const displayUrl = await resolveTherapistPhotoUrl(imageUrl);

    return NextResponse.json({
      success: true,
      profile_image_url: displayUrl || imageUrl,
      profile: {
        ...updatedProfile,
        profile_image_url: displayUrl || updatedProfile.profile_image_url,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'PHOTO_UPLOAD_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

/**
 * Removes the therapist profile photo.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { account } = await requireTherapistProfile(request);

    const updatedProfile = await TherapistPlatformService.updateProfile(account.id, {
      profile_image_url: null,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile photo removed successfully.',
      profile: updatedProfile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'PHOTO_DELETE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
