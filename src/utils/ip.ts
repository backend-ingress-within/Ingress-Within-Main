import { NextRequest } from 'next/server';

/**
 * Extracts a sanitized, single client IP address from request headers.
 * Truncates comma-separated proxy chains (e.g. "client, proxy1, proxy2") to the original client IP
 * and limits length to 45 characters to fit PostgreSQL VARCHAR(45) / INET columns.
 */
export function getClientIp(request: Request | NextRequest | { headers: Headers }): string {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const firstIp = forwarded.split(',')[0].trim();
      if (firstIp) return firstIp.substring(0, 45);
    }

    const realIp = request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip');
    if (realIp) {
      return realIp.trim().substring(0, 45);
    }
  } catch {
    // Fallback if headers fail to read
  }

  return '127.0.0.1';
}
