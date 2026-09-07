import { ExerciseLifecycleStatus } from '../types/exercise.types';

export interface ExerciseAvailabilityParams {
  exerciseId: string;
  unlockDay: number;
  minEntries?: number;
  totalUserDays: number;
  userEntryCount: number;
  persistedStatus?: string | null;
  isBaselineCompleted?: boolean;
}

export interface ExerciseAvailabilityResult {
  status: ExerciseLifecycleStatus;
  isUnlocked: boolean;
  unlockDay: number;
  totalUserDays: number;
  remainingEntriesNeeded: number;
  unlockLabel?: string;
  reason?: string;
}

export class ExerciseAvailabilityService {
  /**
   * Resolves the dynamic availability status of an exercise based on:
   * 1. Lifecycle status priority (completed > in_progress/started > available > locked)
   * 2. Total accumulated cycle day requirement (totalUserDays >= unlockDay)
   * 3. Total journal entry requirement (userEntryCount >= minEntries)
   */
  public static resolveStatus(params: ExerciseAvailabilityParams): ExerciseAvailabilityResult {
    const {
      exerciseId,
      unlockDay,
      minEntries = 0,
      totalUserDays,
      userEntryCount,
      persistedStatus,
      isBaselineCompleted = false
    } = params;

    // Special auto-heal rule for baseline exercise
    if (exerciseId === 'exercise_0' || exerciseId === 'ocean') {
      if (isBaselineCompleted || persistedStatus === 'completed') {
        return {
          status: 'completed',
          isUnlocked: true,
          unlockDay,
          totalUserDays,
          remainingEntriesNeeded: 0
        };
      }
    }

    // 1. COMPLETED: Preserved unconditionally
    if (persistedStatus === 'completed') {
      return {
        status: 'completed',
        isUnlocked: true,
        unlockDay,
        totalUserDays,
        remainingEntriesNeeded: 0
      };
    }

    // 2. IN_PROGRESS / STARTED / ANALYSING / PROCESSING: Preserved unconditionally
    if (persistedStatus && ['started', 'in_progress', 'analysing', 'processing', 'submitted'].includes(persistedStatus)) {
      return {
        status: persistedStatus as ExerciseLifecycleStatus,
        isUnlocked: true,
        unlockDay,
        totalUserDays,
        remainingEntriesNeeded: 0
      };
    }

    // 3. Dynamic unlock evaluation for AVAILABLE vs LOCKED
    const dayMet = totalUserDays >= unlockDay;
    const entriesMet = minEntries <= 0 || userEntryCount >= minEntries;
    const remainingEntriesNeeded = minEntries > 0 ? Math.max(0, minEntries - userEntryCount) : 0;

    if (dayMet && entriesMet) {
      return {
        status: 'available',
        isUnlocked: true,
        unlockDay,
        totalUserDays,
        remainingEntriesNeeded: 0
      };
    }

    // Construct informative unlock label for locked status
    let unlockLabel = `Unlocks Day ${unlockDay}`;
    let reason = `Unlocks on Day ${unlockDay}`;

    if (!dayMet && !entriesMet) {
      unlockLabel = `Unlocks Day ${unlockDay} (${remainingEntriesNeeded} more entries needed)`;
      reason = `Requires Day ${unlockDay} and ${remainingEntriesNeeded} more journal entries`;
    } else if (!dayMet) {
      unlockLabel = `Unlocks Day ${unlockDay}`;
      reason = `Requires Day ${unlockDay} (current Day ${totalUserDays})`;
    } else if (!entriesMet) {
      unlockLabel = `${remainingEntriesNeeded} more entries needed`;
      reason = `Requires ${remainingEntriesNeeded} more journal entries`;
    }

    return {
      status: 'locked',
      isUnlocked: false,
      unlockDay,
      totalUserDays,
      remainingEntriesNeeded,
      unlockLabel,
      reason
    };
  }
}
