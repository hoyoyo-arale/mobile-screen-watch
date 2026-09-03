export const MENU_SWIPE_THRESHOLDS = {
  startAreaHeight: 24,
  previewDistance: 12,
  openDistance: 48,
} as const;

export type MenuSwipeStage = "hidden" | "preview" | "open";

export interface PointerPosition {
  x: number;
  y: number;
}

export const isMenuSwipeStart = (
  pointerY: number,
  viewportHeight: number,
): boolean =>
  pointerY >= viewportHeight - MENU_SWIPE_THRESHOLDS.startAreaHeight &&
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
