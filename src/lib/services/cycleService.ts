export interface CycleMinimal {
  id?: string;
  cycle_number?: number | null;
  number?: number | null;
  status?: string | null;
  start_date?: string | null;
  started_at?: string | null;
  end_date?: string | null;
  ended_at?: string | null;
  total_days?: number | null;
  current_day?: number | null;
}

/**
 * Calculates current cycle day (1-indexed) based on cycle start date and client/UTC date.
 * Day 1 = start date.
 */
export function calculateCurrentCycleDay(
  cycle?: CycleMinimal | null,
  clientDateStr?: string | null
): number {
  if (!cycle) return 1;

  const startDateStr = (cycle.start_date || cycle.started_at || '').split('T')[0];
  if (!startDateStr) {
    return Math.max(1, cycle.current_day || 1);
  }

  let todayMidnight: Date;
  if (clientDateStr) {
    todayMidnight = new Date(clientDateStr + 'T00:00:00Z');
    if (isNaN(todayMidnight.getTime())) {
      const today = new Date();
      todayMidnight = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    }
  } else {
    const today = new Date();
    todayMidnight = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  }

  const startMidnight = new Date(startDateStr + 'T00:00:00Z');
  if (isNaN(startMidnight.getTime())) {
    return Math.max(1, cycle.current_day || 1);
  }

  const diffMs = todayMidnight.getTime() - startMidnight.getTime();
  const calculatedDay = Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
  const totalDays = cycle.total_days || 30;

  return Math.min(totalDays, Math.max(1, Math.max(cycle.current_day || 1, calculatedDay)));
}

/**
 * Calculates total accumulated user days across cycles.
 * e.g. Cycle 1 Day 14 = 14 days.
 *      Cycle 2 Day 5 = (2 - 1) * 30 + 5 = 35 days.
 */
export function calculateTotalUserDays(
  cycle?: CycleMinimal | null,
  clientDateStr?: string | null
): number {
  if (!cycle) return 1;
  const cNum = cycle.cycle_number || cycle.number || 1;
  const currentCycleDay = calculateCurrentCycleDay(cycle, clientDateStr);
  return (cNum - 1) * 30 + currentCycleDay;
}
