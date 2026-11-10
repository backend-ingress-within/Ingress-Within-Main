import { NextRequest, NextResponse } from 'next/server';
import { LeadPipelineService } from '../../../../../lib/therapy/leadPipelineService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      phoneNumber,
      fullName,
      email,
      journeyType,
      currentStep,
      dropOffStage,
      answers,
      concerns,
      preferredLanguage,
      therapistGenderPref,
      budget,
      matchesShown,
      selectedTherapistId,
      selectedTherapistName,
      isCompleted,
    } = body || {};

    if (!phoneNumber || String(phoneNumber).replace(/[^\d+]/g, '').length < 7) {
      return NextResponse.json(
        { error: 'Valid phone number is required for autosave lead capture.' },
        { status: 400 }
      );
    }

    const result = await LeadPipelineService.saveOrUpdateLead({
      sessionId: sessionId || `guest_${Date.now()}`,
      phoneNumber: String(phoneNumber).trim(),
      fullName: fullName ? String(fullName).trim() : null,
      email: email ? String(email).trim() : null,
      journeyType: journeyType || 'guided',
      currentStep: Number(currentStep || 0),
      dropOffStage: dropOffStage || 'contact_captured',
      answers: answers || {},
      concerns: Array.isArray(concerns) ? concerns : [],
      preferredLanguage: preferredLanguage || null,
      therapistGenderPref: therapistGenderPref || null,
      budget: budget != null ? Number(budget) : null,
      matchesShown: Array.isArray(matchesShown) ? matchesShown : [],
      selectedTherapistId: selectedTherapistId || null,
      selectedTherapistName: selectedTherapistName || null,
      isCompleted: Boolean(isCompleted),
    });

    return NextResponse.json({
      success: true,
      leadId: result.lead.id,
      isNew: result.isNew,
      stage: result.lead.drop_off_stage,
    });
  } catch (error: any) {
    console.error('[API Leads Autosave Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to autosave lead' },
      { status: 500 }
    );
  }
}
