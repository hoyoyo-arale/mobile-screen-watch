import { describe, expect, it } from "vitest";
import { formatDate, formatTime, toIsoDate } from "./clock";

describe("clock formatting", () => {
  const date = new Date(2026, 7, 23, 4, 5, 6);

  it("formats the local time with two-digit fields", () => {
    expect(formatTime(date)).toEqual({
      hours: "04",
      minutes: "05",
      seconds: "06",
    });
  });

  it("formats the date with a Japanese weekday", () => {
    expect(formatDate(date)).toBe("2026年8月23日（日）");
  });

  it("returns an ISO timestamp for the datetime attribute", () => {
    expect(toIsoDate(date)).toBe(date.toISOString());
  });
});
