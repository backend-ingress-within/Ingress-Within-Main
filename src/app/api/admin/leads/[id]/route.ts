import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { LeadPipelineService } from '../../../../../lib/therapy/leadPipelineService';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/leads/[id]
 * ===========================
 * Updates follow-up status and internal notes for a lead.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthorizedAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const { follow_up_status, internal_notes } = body || {};

    const updated = await LeadPipelineService.updateLeadFollowUp(id, {
      follow_up_status,
      internal_notes,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: error.message || 'Unauthorized admin access' },
        { status: error.status }
      );
    }
    console.error('[PATCH /api/admin/leads/[id] Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/leads/[id]
 * =============================
 * Deletes a lead and removes it from pipeline and drop-offs tracking.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthorizedAdmin(request);
    const { id } = await params;

    const result = await LeadPipelineService.deleteLead(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
      id,
    });
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: error.message || 'Unauthorized admin access' },
        { status: error.status }
      );
    }
    console.error('[DELETE /api/admin/leads/[id] Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
