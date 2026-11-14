import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../../lib/auth/adminAuthHelper';
import { TherapyClientAuthService } from '../../../../../../lib/therapy/therapyClientAuthService';
import { supabase } from '../../../../../../lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthorizedAdmin(request);
    const { id: clientId } = await params;

    // Find or create therapy_client_account
    let { data: clientAcc } = await supabase
      .from('therapy_client_accounts')
      .select('id, email, full_name, phone_number, metadata')
      .or(`user_id.eq.${clientId},id.eq.${clientId}`)
      .maybeSingle();

    if (!clientAcc) {
      const { data: u } = await supabase.from('users').select('*').eq('id', clientId).maybeSingle();
      const { data: intk } = await supabase
        .from('therapy_intakes')
        .select('*')
        .eq('user_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const email = intk?.email || u?.email;
      if (!email) {
        return NextResponse.json(
          { error: { message: 'Client has no recorded email address to establish account.' } },
          { status: 400 }
        );
      }

      const { data: created } = await supabase
        .from('therapy_client_accounts')
        .insert({
          user_id: clientId,
          email: email.toLowerCase().trim(),
          full_name: intk?.full_name || u?.name || 'Client',
          phone_number: intk?.phone_number || u?.phone_number || null,
          status: 'in_care',
        })
        .select('id, email, full_name, phone_number, metadata')
        .single();

      clientAcc = created;
    }

    if (!clientAcc) {
      return NextResponse.json({ error: { message: 'Failed to access client account.' } }, { status: 500 });
    }

    const claimResult = await TherapyClientAuthService.generateClaimToken(clientAcc.id);

    return NextResponse.json({
      success: true,
      claimUrl: claimResult.claimUrl,
      expiresAt: claimResult.expiresAt,
      isAlreadyClaimed: Boolean(clientAcc.metadata?.claimed_at),
      client: {
        id: clientAcc.id,
        name: clientAcc.full_name,
        phone: clientAcc.phone_number,
        email: clientAcc.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: err.message || 'Internal server error' } },
      { status: err.status || 500 }
    );
  }
}
