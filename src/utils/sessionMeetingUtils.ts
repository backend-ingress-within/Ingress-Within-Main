/**
 * Ingress Within — Session Meeting Room Access Window Helper
 * 
 * Clinical & Platform Invariant:
 * Meeting room access (Google Meet) opens strictly 1 hour prior to the scheduled
 * session start time. Prior to the 1-hour window, the join action MUST be disabled.
 */

export interface SessionMeetingWindow {
  canJoin: boolean;
  isTooEarly: boolean;
  isEnded: boolean;
  joinOpensAt: Date;
  joinOpensAtFormatted: string;
  hoursUntilJoin: number;
  minutesUntilJoin: number;
}

export const MEETING_POST_SESSION_BUFFER_MS = 20 * 60 * 1000; // 20-minute buffer for late joins

export function getSessionMeetingWindow(
  scheduledStart: string | Date | null | undefined,
  scheduledEnd?: string | Date | null | undefined
): SessionMeetingWindow {
  if (!scheduledStart) {
    return {
      canJoin: false,
      isTooEarly: false,
      isEnded: true,
      joinOpensAt: new Date(),
      joinOpensAtFormatted: '',
      hoursUntilJoin: 0,
      minutesUntilJoin: 0,
    };
  }

  const startMs = new Date(scheduledStart).getTime();
  const endMs = scheduledEnd ? new Date(scheduledEnd).getTime() : startMs + 50 * 60 * 1000;
  const joinOpensMs = startMs - 60 * 60 * 1000; // 1 hour prior
  const bufferEndMs = endMs + MEETING_POST_SESSION_BUFFER_MS; // 20-minute post-session grace period buffer
  const now = Date.now();

  const isTooEarly = now < joinOpensMs;
  const isEnded = now > bufferEndMs;
  const canJoin = !isTooEarly && !isEnded;

  const joinOpensAt = new Date(joinOpensMs);
  let joinOpensAtFormatted = '';
  try {
    joinOpensAtFormatted = joinOpensAt.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    joinOpensAtFormatted = joinOpensAt.toISOString();
  }

  const msUntilJoin = Math.max(0, joinOpensMs - now);
  const minutesUntilJoin = Math.ceil(msUntilJoin / (1000 * 60));
  const hoursUntilJoin = Math.round((msUntilJoin / (1000 * 60 * 60)) * 10) / 10;

  return {
    canJoin,
    isTooEarly,
    isEnded,
    joinOpensAt,
    joinOpensAtFormatted,
    hoursUntilJoin,
    minutesUntilJoin,
  };
}
