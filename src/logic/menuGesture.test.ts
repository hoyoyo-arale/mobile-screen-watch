import { describe, expect, it } from "vitest";
import {
  getMenuSwipeStage,
  getMenuSwipeStartAreaHeight,
  isMenuSwipeStart,
} from "./menuGesture";

describe("getMenuSwipeStartAreaHeight", () => {
  it("uses the minimum height on a short viewport", () => {
    expect(getMenuSwipeStartAreaHeight(400)).toBe(32);
  });

  it("uses 6% of the viewport height between the limits", () => {
    expect(getMenuSwipeStartAreaHeight(600)).toBe(36);
  });

  it("uses the maximum height on a tall viewport", () => {
    expect(getMenuSwipeStartAreaHeight(1000)).toBe(48);
  });
});

describe("isMenuSwipeStart", () => {
  it.each([
    { viewportHeight: 400, areaHeight: 32 },
    { viewportHeight: 600, areaHeight: 36 },
    { viewportHeight: 1000, areaHeight: 48 },
  ])(
    "accepts the $areaHeight px start area for a $viewportHeight px viewport",
    ({ viewportHeight, areaHeight }) => {
      expect(
        isMenuSwipeStart(viewportHeight - areaHeight, viewportHeight),
      ).toBe(true);
      expect(
        isMenuSwipeStart(viewportHeight - areaHeight - 1, viewportHeight),
      ).toBe(false);
    },
  );

  it("rejects a pointer below the viewport", () => {
    expect(isMenuSwipeStart(801, 800)).toBe(false);
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
