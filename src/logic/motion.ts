export interface MotionState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface MotionBounds {
  width: number;
  height: number;
}

/** 固定速度と角度から、速度ベクトルを作る。 */
export const createVelocity = (
  speed: number,
  angle: number,
): Pick<MotionState, "vx" | "vy"> => {
  if (speed < 0) {
    throw new RangeError("speed must be zero or greater");
  }

  return {
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
  };
};

interface AxisMotion {
  position: number;
  velocity: number;
}

/** 1軸分の移動を計算し、範囲を超えた分も反射させる。 */
const advanceAxis = (
  axis: AxisMotion,
  deltaSeconds: number,
  maxPosition: number,
): AxisMotion => {
  if (maxPosition <= 0) {
    return { position: 0, velocity: 0 };
  }

  if (axis.velocity === 0 || deltaSeconds <= 0) {
    return {
      position: Math.max(0, Math.min(axis.position, maxPosition)),
      velocity: axis.velocity,
    };
  }

  const speed = Math.abs(axis.velocity);
  const direction = axis.velocity < 0 ? -1 : 1;
  const unfoldedPosition =
    direction === 1
      ? axis.position + speed * deltaSeconds
      : 2 * maxPosition - axis.position + speed * deltaSeconds;
  const period = 2 * maxPosition;
  const wrappedPosition = ((unfoldedPosition % period) + period) % period;
  const isMovingForward = wrappedPosition <= maxPosition;

  return {
    position: isMovingForward
      ? wrappedPosition
      : 2 * maxPosition - wrappedPosition,
    velocity: (isMovingForward ? direction : -direction) * speed,
  };
};

export const advanceMotion = (
  state: MotionState,
  deltaSeconds: number,
  bounds: MotionBounds,
): MotionState => ({
  ...state,
  ...(() => {
    const x = advanceAxis(
      { position: state.x, velocity: state.vx },
      deltaSeconds,
      bounds.width,
    );
    const y = advanceAxis(
      { position: state.y, velocity: state.vy },
      deltaSeconds,
      bounds.height,
    );

    return { x: x.position, y: y.position, vx: x.velocity, vy: y.velocity };
  })(),
});
