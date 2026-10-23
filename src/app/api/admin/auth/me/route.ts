import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { supabase } from '../../../../../lib/db';
import { AdminAuthService, AdminRole } from '../../../../../lib/admin/adminAuthService';
import { COOKIE_ADMIN_ACCESS_NAME, getCookieOptions } from '../../../../../utils/cookies';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuthorizedAdmin(request);

    // Fetch up-to-date record from database if available
    const { data: dbAdmin } = await supabase
      .from('admin_accounts')
      .select('id, email, full_name, role, status, last_login_at, created_at')
      .eq('id', admin.adminId)
      .maybeSingle();

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.adminId,
        email: dbAdmin?.email || admin.email || 'admin@ingresswithin.com',
        full_name: dbAdmin?.full_name || admin.fullName || 'Administrator',
        role: dbAdmin?.role || admin.role,
        status: dbAdmin?.status || 'active',
        last_login_at: dbAdmin?.last_login_at || null,
        actorType: admin.actorType,
      },
    });

    // Rolling session: If authenticated via admin cookie, refresh the 7-day token & cookie so active sessions stay valid
    const adminCookieToken = request.cookies?.get(COOKIE_ADMIN_ACCESS_NAME)?.value;
    if (adminCookieToken && admin.actorType === 'admin_user') {
      const refreshedToken = AdminAuthService.generateAccessToken({
        adminId: admin.adminId,
        email: dbAdmin?.email || admin.email || 'admin@ingresswithin.com',
        role: (dbAdmin?.role || admin.role) as AdminRole,
      });
      response.cookies.set(
        COOKIE_ADMIN_ACCESS_NAME,
        refreshedToken,
        getCookieOptions(AdminAuthService.getAccessTokenExpirySeconds())
      );
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'ADMIN_UNAUTHORIZED', message: err.message } },
      { status: err.status || 403 }
    );
  }
}
