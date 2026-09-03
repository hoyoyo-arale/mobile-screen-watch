export const MENU_SWIPE_THRESHOLDS = {
  startAreaViewportRatio: 0.06,
  minimumStartAreaHeight: 32,
  maximumStartAreaHeight: 48,
  previewDistance: 12,
  openDistance: 48,
} as const;

export type MenuSwipeStage = "hidden" | "preview" | "open";

export interface PointerPosition {
  x: number;
  y: number;
}

export const getMenuSwipeStartAreaHeight = (viewportHeight: number): number =>
  Math.min(
    MENU_SWIPE_THRESHOLDS.maximumStartAreaHeight,
    Math.max(
      MENU_SWIPE_THRESHOLDS.minimumStartAreaHeight,
      viewportHeight * MENU_SWIPE_THRESHOLDS.startAreaViewportRatio,
    ),
  );

export const isMenuSwipeStart = (
  pointerY: number,
  viewportHeight: number,
): boolean =>
  pointerY >= viewportHeight - getMenuSwipeStartAreaHeight(viewportHeight) &&
  pointerY <= viewportHeight;

export const getMenuSwipeStage = (
  start: PointerPosition,
  current: PointerPosition,
): MenuSwipeStage => {
  const upwardDistance = start.y - current.y;
  const horizontalDistance = Math.abs(current.x - start.x);

  if (upwardDistance <= horizontalDistance) {
    return "hidden";
  }

  if (upwardDistance >= MENU_SWIPE_THRESHOLDS.openDistance) {
    return "open";
  }

  if (upwardDistance >= MENU_SWIPE_THRESHOLDS.previewDistance) {
    return "preview";
  }

  return "hidden";
};
