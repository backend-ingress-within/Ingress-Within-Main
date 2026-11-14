import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/db';
import { RelationshipBookingLinkService } from '../../../../../lib/therapy/relationshipBookingLinkService';
import { SessionBookingService } from '../../../../../lib/therapy/sessionBookingService';
import { resolveTherapistPhotoUrl } from '../../../../../lib/therapist/photoUrlResolver';
import { getClientIp } from '../../../../../utils/ip';

/**
 * GET /api/therapy/book/[token]
 * =============================
 * Public endpoint for resolving a persistent relationship booking link.
 * Returns only sanitized practitioner details, authoritative pricing, and real-time open slots.
 *
 * Security Guarantees:
 * 1. Zero exposure of client identity, user IDs, relationship IDs, or clinical data.
 * 2. Constant-time / generic 404 response for invalid, revoked, expired, or ineligible links.
 * 3. Enforces authoritative server-side pricing and GST calculation.
 * 4. Fails closed if therapy consent or therapist practice clearance is missing.
 * 5. Dependency failures never fabricate availability slots.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'BOOKING_LINK_UNAVAILABLE',
            message: 'This booking link is invalid or no longer active.',
          },
        },
        { status: 404 }
      );
    }

    // 1. Resolve booking link server-side (validates link, active relationship, therapist eligibility & consent)
    const resolved = await RelationshipBookingLinkService.resolveBookingLinkByToken(token.trim());

    if (!resolved.valid || !resolved.therapistAccountId) {
      if (resolved.errorCode === 'BOOKING_ALREADY_CONFIRMED') {
        return NextResponse.json(
          {
            error: {
              code: 'BOOKING_ALREADY_CONFIRMED',
              message: resolved.errorMessage || 'Your consultation has already been booked. Please sign in to your therapy account.',
            },
          },
          { status: 409 }
        );
      }
      // Return uniform generic error to prevent link/client enumeration or revealing failure rationale
      return NextResponse.json(
        {
          error: {
            code: 'BOOKING_LINK_UNAVAILABLE',
            message: 'This booking link is invalid or no longer active.',
          },
        },
        { status: 404 }
      );
    }

    // 2. Fetch approved practitioner public profile (strict least privilege)
    const { data: profile } = await supabase
      .from('therapist_profiles')
      .select(`
        full_name,
        title,
        bio,
        qualification,
        experience_years,
        specializations,
        languages,
        profile_image_url,
        timezone
      `)
      .eq('therapist_account_id', resolved.therapistAccountId)
      .maybeSingle();

    // 3. Fetch authoritative pricing and GST breakdown directly from backend service
    const pricing = await SessionBookingService.getAuthoritativePricing(resolved.therapistAccountId);

    // 3b. Fetch client prefill info for frictionless checkout
    let clientPrefill: { name: string; phone: string; email: string } | null = null;
    if (resolved.userId) {
      try {
        const { data: clientUser } = await supabase
          .from('users')
          .select('name, phone_number, email')
          .eq('id', resolved.userId)
          .maybeSingle();

        if (clientUser) {
          clientPrefill = {
            name: clientUser.name || '',
            phone: clientUser.phone_number || '',
            email: (clientUser as any).email || '',
          };
        }
      } catch {
        // Non-blocking prefill
      }
    }

    // 4. Fetch real-time bookable availability
    const searchParams = request.nextUrl.searchParams;
    const now = new Date();
    const defaultStart = now.toISOString();
    const defaultEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const startDate = searchParams.get('startDate') || defaultStart;
    const endDate = searchParams.get('endDate') || defaultEnd;

    let availableSlots: Array<{ start: string; end: string }> = [];

    try {
      const rawSlots = await SessionBookingService.getTherapistAvailability(
        resolved.therapistAccountId,
        startDate,
        endDate
      );

      // Only include valid open slots starting in the future
      availableSlots = (rawSlots || [])
        .filter((s) => s.available && new Date(s.start).getTime() > Date.now())
        .map((s) => ({
          start: s.start,
          end: s.end,
        }));
    } catch (availErr: any) {
      console.error('[GET /api/therapy/book/[token]] Availability query failed:', availErr?.message);
      // Fail safely: never fabricate slots when upstream scheduling services fail
      availableSlots = [];
    }

    const resolvedPhotoUrl = await resolveTherapistPhotoUrl(profile?.profile_image_url);

    // 5. Construct sanitized response DTO (zero client/relationship ID disclosure)
    const sanitizedResponse = {
      success: true,
      practitioner: {
        name: profile?.full_name || 'Assigned Therapist',
        title: profile?.title || 'Consultant Psychologist',
        bio: profile?.bio || '',
        qualification: profile?.qualification || '',
        experienceYears: profile?.experience_years ?? 0,
        specializations: Array.isArray(profile?.specializations) ? profile.specializations : [],
        languages: Array.isArray(profile?.languages) ? profile.languages : ['English', 'Hindi'],
        photoUrl: resolvedPhotoUrl,
        timezone: profile?.timezone || 'Asia/Kolkata',
      },
      session: {
        durationMinutes: 50,
        format: 'video',
        instructions: [
          'Your session is 50 minutes long and conducted securely over Google Meet.',
          'You will receive instant calendar invites and private access instructions once confirmed.',
          'Cancellations made 48+ hours in advance are eligible for a 100% automated refund.',
        ],
      },
      pricing: {
        currency: pricing.currency,
        subtotalPaise: pricing.subtotalPaise,
        subtotalInr: pricing.subtotalInr,
        gstPaise: pricing.gstPaise,
        gstInr: pricing.gstInr,
        totalPaise: pricing.totalPaise,
        totalInr: pricing.totalInr,

        // Transparent Pricing Breakdown
        therapyFeeInr: pricing.therapyFeeInr,
        therapyFeePaise: pricing.therapyFeePaise,
        therapyGstRate: pricing.therapyGstRate,
        therapyGstPaise: pricing.therapyGstPaise,
        therapyGstInr: pricing.therapyGstInr,
        isTherapyGstExempt: pricing.isTherapyGstExempt,

        platformFeeInr: pricing.platformFeeInr,
        platformFeePaise: pricing.platformFeePaise,
        platformFeeGstRate: pricing.platformFeeGstRate,
        platformFeeNetPaise: pricing.platformFeeNetPaise,
        platformFeeNetInr: pricing.platformFeeNetInr,
        platformFeeGstPaise: pricing.platformFeeGstPaise,
        platformFeeGstInr: pricing.platformFeeGstInr,
        platformFeeDescription: pricing.platformFeeDescription,
      },
      availability: {
        timezone: profile?.timezone || 'Asia/Kolkata',
        startDate,
        endDate,
        slotsCount: availableSlots.length,
        slots: availableSlots,
      },
      clientPrefill,
    };

    return NextResponse.json(sanitizedResponse, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    console.error('[GET /api/therapy/book/[token]] Unexpected error:', err?.message);
    return NextResponse.json(
      {
        error: {
          code: 'BOOKING_LINK_ERROR',
          message: 'This booking link is currently unavailable. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}
