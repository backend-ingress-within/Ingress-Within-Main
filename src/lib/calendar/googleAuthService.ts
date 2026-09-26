import { supabase } from '../db';
import { encryptToken, decryptToken } from '../../utils/encryption';

export interface OAuthStatePayload {
  accountType: 'user' | 'therapist';
  userId?: string;
  therapistAccountId?: string;
  returnTo?: string;
}

export class GoogleAuthService {
  private static getClientId(): string {
    return process.env.GOOGLE_CLIENT_ID || '';
  }

  private static getClientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET || '';
  }

  private static getRedirectUri(): string {
    return (
      process.env.GOOGLE_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/calendar/google/callback`
    );
  }

  /**
   * Generates Google OAuth 2.0 authorization URL with offline access for refresh tokens.
   */
  static getAuthUrl(statePayload: OAuthStatePayload): string {
    const clientId = this.getClientId();
    const redirectUri = this.getRedirectUri();
    const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email',
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for tokens and persists encrypted credentials.
   */
  static async handleOAuthCallback(code: string, stateEncoded: string) {
    let state: OAuthStatePayload;
    try {
      state = JSON.parse(Buffer.from(stateEncoded, 'base64url').toString('utf8'));
    } catch {
      throw new Error('INVALID_STATE: Malformed OAuth state.');
    }

    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();
    const redirectUri = this.getRedirectUri();

    // 1. Exchange code for access & refresh tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[GoogleAuth] Token exchange failed:', errText);
      throw new Error(`GOOGLE_TOKEN_EXCHANGE_FAILED: ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = Number(tokenData.expires_in) || 3600;
    const tokenExpiry = new Date(Date.now() + expiresIn * 1000).toISOString();

    // 2. Fetch Google user info (email)
    let googleEmail = '';
    let googleAccountId = '';
    try {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userRes.ok) {
        const userInfo = await userRes.json();
        googleEmail = userInfo.email || '';
        googleAccountId = userInfo.id || '';
      }
    } catch (err) {
      console.warn('[GoogleAuth] Failed to fetch userinfo:', err);
    }

    // 3. Encrypt tokens for secure storage
    const encryptedAccess = encryptToken(accessToken);
    const encryptedRefresh = refreshToken ? encryptToken(refreshToken) : '';

    // 4. Save into google_calendar_connections table
    const targetUserId = state.accountType === 'user' ? state.userId : null;
    const targetTherapistId = state.accountType === 'therapist' ? state.therapistAccountId : null;

    // Check existing
    let query = supabase.from('google_calendar_connections').select('id, refresh_token_encrypted');
    if (state.accountType === 'therapist') {
      query = query.eq('therapist_account_id', targetTherapistId).eq('account_type', 'therapist');
    } else {
      query = query.eq('user_id', targetUserId).eq('account_type', 'user');
    }

    const { data: existing } = await query.maybeSingle();

    const finalRefreshTokenEncrypted = encryptedRefresh || existing?.refresh_token_encrypted || '';

    const payload = {
      account_type: state.accountType,
      user_id: targetUserId,
      therapist_account_id: targetTherapistId,
      google_email: googleEmail || 'unknown@google.com',
      google_account_id: googleAccountId,
      access_token_encrypted: encryptedAccess,
      refresh_token_encrypted: finalRefreshTokenEncrypted,
      token_expiry: tokenExpiry,
      sync_status: 'connected',
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      await supabase.from('google_calendar_connections').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('google_calendar_connections').insert(payload);
    }

    return {
      success: true,
      accountType: state.accountType,
      googleEmail,
      returnTo: state.returnTo || '/',
    };
  }

  /**
   * Retrieves a valid decrypted access token, automatically refreshing if expired.
   */
  static async getValidAccessToken(
    accountType: 'user' | 'therapist',
    accountId: string
  ): Promise<string | null> {
    let query = supabase.from('google_calendar_connections').select('*');
    if (accountType === 'therapist') {
      query = query.eq('therapist_account_id', accountId).eq('account_type', 'therapist');
    } else {
      query = query.eq('user_id', accountId).eq('account_type', 'user');
    }

    const { data: connection, error } = await query.maybeSingle();

    if (error || !connection || connection.sync_status === 'revoked') {
      return null;
    }

    const now = Date.now();
    const expiry = connection.token_expiry ? new Date(connection.token_expiry).getTime() : 0;
    const isExpiringSoon = expiry - now < 5 * 60 * 1000; // within 5 minutes

    // Decrypt current access token
    const decryptedAccess = decryptToken(connection.access_token_encrypted);

    if (!isExpiringSoon && decryptedAccess) {
      return decryptedAccess;
    }

    // Refresh token needed
    const decryptedRefresh = decryptToken(connection.refresh_token_encrypted);
    if (!decryptedRefresh) {
      return decryptedAccess || null;
    }

    try {
      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.getClientId(),
          client_secret: this.getClientSecret(),
          refresh_token: decryptedRefresh,
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshRes.ok) {
        console.warn('[GoogleAuth] Refresh token request failed:', await refreshRes.text());
        return decryptedAccess || null;
      }

      const refreshedData = await refreshRes.json();
      const newAccessToken = refreshedData.access_token;
      const expiresIn = Number(refreshedData.expires_in) || 3600;
      const newExpiry = new Date(Date.now() + expiresIn * 1000).toISOString();

      await supabase
        .from('google_calendar_connections')
        .update({
          access_token_encrypted: encryptToken(newAccessToken),
          token_expiry: newExpiry,
          sync_status: 'connected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', connection.id);

      return newAccessToken;
    } catch (refreshErr) {
      console.error('[GoogleAuth] Exception during token refresh:', refreshErr);
      return decryptedAccess || null;
    }
  }

  /**
   * Disconnects and revokes calendar sync for an account.
   */
  static async disconnectGoogleCalendar(accountType: 'user' | 'therapist', accountId: string) {
    let query = supabase.from('google_calendar_connections').update({
      sync_status: 'revoked',
      updated_at: new Date().toISOString(),
    });

    if (accountType === 'therapist') {
      query = query.eq('therapist_account_id', accountId).eq('account_type', 'therapist');
    } else {
      query = query.eq('user_id', accountId).eq('account_type', 'user');
    }

    const { error } = await query;
    return { success: !error };
  }

  /**
   * Checks status of connection.
   */
  static async getConnectionStatus(accountType: 'user' | 'therapist', accountId: string) {
    let query = supabase.from('google_calendar_connections').select('id, google_email, sync_status, last_synced_at');
    if (accountType === 'therapist') {
      query = query.eq('therapist_account_id', accountId).eq('account_type', 'therapist');
    } else {
      query = query.eq('user_id', accountId).eq('account_type', 'user');
    }

    const { data } = await query.maybeSingle();
    return {
      connected: Boolean(data && data.sync_status === 'connected'),
      googleEmail: data?.google_email || null,
      syncStatus: data?.sync_status || 'not_connected',
      lastSyncedAt: data?.last_synced_at || null,
    };
  }
}
