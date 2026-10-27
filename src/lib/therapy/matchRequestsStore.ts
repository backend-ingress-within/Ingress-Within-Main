'use strict';

export interface PersistedMatchRequest {
  id: string;
  therapistId: string;
  userId?: string | null;
  answers: Record<string, any>;
  status: 'pending' | 'reviewing' | 'contacted' | 'booked';
  createdAt: string;
}

// In-memory fallback ledger ensuring requests survive even during local/offline testing
const IN_MEMORY_REQUESTS: PersistedMatchRequest[] = [];

export function getPersistedMatchRequests(): PersistedMatchRequest[] {
  return [...IN_MEMORY_REQUESTS].reverse();
}

export function recordMatchRequest(record: PersistedMatchRequest): void {
  IN_MEMORY_REQUESTS.push(record);
}

export function markClientRequestsAsClaimed(userId?: string | null): void {
  if (!userId) return;
  for (const req of IN_MEMORY_REQUESTS) {
    if (req.userId === userId && req.status === 'pending') {
      req.status = 'booked';
    }
  }
}
