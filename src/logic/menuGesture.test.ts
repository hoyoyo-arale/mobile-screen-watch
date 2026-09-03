import { describe, expect, it } from "vitest";
import { getMenuSwipeStage, isMenuSwipeStart } from "./menuGesture";

describe("isMenuSwipeStart", () => {
  const viewportHeight = 800;

  it("accepts a pointer within 24px of the bottom edge", () => {
    expect(isMenuSwipeStart(776, viewportHeight)).toBe(true);
    expect(isMenuSwipeStart(800, viewportHeight)).toBe(true);
  });

  it("rejects a pointer outside the bottom 24px", () => {
    expect(isMenuSwipeStart(775, viewportHeight)).toBe(false);
    expect(isMenuSwipeStart(801, viewportHeight)).toBe(false);
  });
});

describe("getMenuSwipeStage", () => {
  const start = { x: 100, y: 100 };

  it("stays hidden before reaching the preview distance", () => {
    expect(getMenuSwipeStage(start, { x: 100, y: 89 })).toBe("hidden");
  });

  it("previews at 12px of upward movement", () => {
    expect(getMenuSwipeStage(start, { x: 100, y: 88 })).toBe("preview");
  });

  it("continues previewing before reaching the open distance", () => {
    expect(getMenuSwipeStage(start, { x: 100, y: 53 })).toBe("preview");
  });

  it("opens at 48px of upward movement", () => {
    expect(getMenuSwipeStage(start, { x: 100, y: 52 })).toBe("open");
  });

  it("stays hidden when vertical and horizontal movement are equal", () => {
    expect(getMenuSwipeStage(start, { x: 52, y: 52 })).toBe("hidden");
  });

  it.each([52, 148])(
    "stays hidden when horizontal movement toward x=%i is greater",
    (x) => {
      expect(getMenuSwipeStage(start, { x, y: 53 })).toBe("hidden");
    },
  );

  it("stays hidden during downward movement", () => {
    expect(getMenuSwipeStage(start, { x: 100, y: 112 })).toBe("hidden");
  });
});
