import { describe, expect, it } from "vitest";
import { advanceMotion, createVelocity, type MotionState } from "./motion";

const initialState: MotionState = { x: 10, y: 20, vx: 30, vy: 40 };
const bounds = { width: 100, height: 80 };

describe("createVelocity", () => {
  it("creates a vector with the requested speed", () => {
    const velocity = createVelocity(80, Math.PI / 4);

    expect(Math.hypot(velocity.vx, velocity.vy)).toBeCloseTo(80);
  });

  it("rejects a negative speed", () => {
    expect(() => createVelocity(-1, 0)).toThrow(RangeError);
  });
});

describe("advanceMotion", () => {
  it("moves according to elapsed time", () => {
    expect(advanceMotion(initialState, 0.5, bounds)).toEqual({
      x: 25,
      y: 40,
      vx: 30,
      vy: 40,
    });
  });

  it("reflects from the right and bottom edges", () => {
    expect(advanceMotion(initialState, 3.25, bounds)).toEqual({
      x: 92.5,
      y: 10,
      vx: -30,
      vy: -40,
    });
  });

  it("reflects correctly when one update crosses an edge more than once", () => {
    expect(advanceMotion({ x: 10, y: 0, vx: 250, vy: 0 }, 1, bounds)).toEqual({
      x: 60,
      y: 0,
      vx: 250,
      vy: 0,
    });
  });

  it("keeps a zero-sized axis safe", () => {
    expect(advanceMotion(initialState, 1, { width: 0, height: 0 })).toEqual({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    });
  });
});
