import { describe, expect, it } from "vitest";
import {
  completeTimer,
  durationMinutesToMilliseconds,
  getNextPhase,
  getRemainingMilliseconds,
  isTimerExpired,
  pauseTimer,
  resumeTimer,
  startTimer,
} from "./timer";

describe("timer logic", () => {
  const now = 1_000_000;

  it("converts minutes to milliseconds", () => {
    expect(durationMinutesToMilliseconds(2)).toBe(120_000);
  });

  it("starts a timer with an end timestamp", () => {
    expect(startTimer("work", 25, now)).toEqual({
      status: "running",
      phase: "work",
      startedAt: now,
      endAt: now + 1_500_000,
    });
  });

  it("calculates remaining time from the end timestamp", () => {
    const state = startTimer("work", 1, now);

    expect(getRemainingMilliseconds(state, now + 15_000)).toBe(45_000);
    expect(getRemainingMilliseconds(state, now + 60_000)).toBe(0);
  });

  it("returns the paused remaining time without using the current time", () => {
    const state = pauseTimer(startTimer("break", 1, now), now + 20_000);

    expect(state).toEqual({
      status: "paused",
      phase: "break",
      remainingMs: 40_000,
    });
    expect(getRemainingMilliseconds(state, now + 100_000)).toBe(40_000);
  });

  it("resumes a paused timer from the preserved remaining time", () => {
    const paused = pauseTimer(startTimer("work", 1, now), now + 20_000);

    expect(resumeTimer(paused, now + 30_000)).toEqual({
      status: "running",
      phase: "work",
      startedAt: now + 30_000,
      endAt: now + 70_000,
    });
  });

  it("reports expiration at and after the end timestamp", () => {
    const state = startTimer("work", 1, now);

    expect(isTimerExpired(state, now + 59_999)).toBe(false);
    expect(isTimerExpired(state, now + 60_000)).toBe(true);
    expect(isTimerExpired(state, now + 60_001)).toBe(true);
  });

  it("completes running and paused timers", () => {
    const running = startTimer("work", 1, now);
    const paused = pauseTimer(running, now + 10_000);

    expect(completeTimer(running, now + 60_000)).toEqual({
      status: "completed",
      phase: "work",
      completedAt: now + 60_000,
    });
    expect(completeTimer(paused, now + 60_000)).toEqual({
      status: "completed",
      phase: "work",
      completedAt: now + 60_000,
    });
  });

  it("leaves inactive states unchanged for pause and resume", () => {
    const idle = { status: "idle" as const };
    const completed = {
      status: "completed" as const,
      phase: "break" as const,
      completedAt: now,
    };

    expect(pauseTimer(idle, now)).toBe(idle);
    expect(resumeTimer(completed, now)).toBe(completed);
    expect(completeTimer(idle, now)).toBe(idle);
    expect(getRemainingMilliseconds(idle, now)).toBeNull();
  });

  it("switches between work and break phases", () => {
    expect(getNextPhase("work")).toBe("break");
    expect(getNextPhase("break")).toBe("work");
  });
});
