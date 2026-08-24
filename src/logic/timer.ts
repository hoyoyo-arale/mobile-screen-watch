import type { TimerPhase, TimerState } from "../types/app";

const MILLISECONDS_PER_MINUTE = 60_000;

export const durationMinutesToMilliseconds = (minutes: number): number =>
  minutes * MILLISECONDS_PER_MINUTE;

export const startTimer = (
  phase: TimerPhase,
  durationMinutes: number,
  now = Date.now(),
): TimerState => ({
  status: "running",
  phase,
  startedAt: now,
  endAt: now + durationMinutesToMilliseconds(durationMinutes),
});

export const getRemainingMilliseconds = (
  state: TimerState,
  now = Date.now(),
): number | null => {
  if (state.status === "running") {
    return Math.max(0, state.endAt - now);
  }

  if (state.status === "paused") {
    return state.remainingMs;
  }

  return null;
};

export const isTimerExpired = (state: TimerState, now = Date.now()): boolean =>
  state.status === "running" && now >= state.endAt;

export const pauseTimer = (state: TimerState, now = Date.now()): TimerState => {
  if (state.status !== "running") {
    return state;
  }

  return {
    status: "paused",
    phase: state.phase,
    remainingMs: Math.max(0, state.endAt - now),
  };
};

export const resumeTimer = (
  state: TimerState,
  now = Date.now(),
): TimerState => {
  if (state.status !== "paused") {
    return state;
  }

  return {
    status: "running",
    phase: state.phase,
    startedAt: now,
    endAt: now + state.remainingMs,
  };
};

export const completeTimer = (
  state: TimerState,
  now = Date.now(),
): TimerState => {
  if (state.status !== "running" && state.status !== "paused") {
    return state;
  }

  return {
    status: "completed",
    phase: state.phase,
    completedAt: now,
  };
};

export const getNextPhase = (phase: TimerPhase): TimerPhase =>
  phase === "work" ? "break" : "work";
