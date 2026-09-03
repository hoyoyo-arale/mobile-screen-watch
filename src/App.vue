<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import ClockDisplay from "./components/ClockDisplay.vue";
import MenuBar from "./components/MenuBar.vue";
import MovingDisplayBlock from "./components/MovingDisplayBlock.vue";
import ScreenPrimaryControl from "./components/ScreenPrimaryControl.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import TimerDisplay from "./components/TimerDisplay.vue";
import { useTimer } from "./composables/useTimer";
import {
  getMenuSwipeStage,
  isMenuSwipeStart,
  type PointerPosition,
} from "./logic/menuGesture";
import { getTimerPrimaryAction } from "./logic/timer";
import { toggleTheme as getNextTheme } from "./logic/theme";
import type { MotionBounds } from "./logic/motion";
import { DEFAULT_SETTINGS, type Theme } from "./types/app";

const now = ref(new Date());
const theme = ref<Theme>("dark");
const showClockSeconds = ref(DEFAULT_SETTINGS.showClockSeconds);
const movementSpeedPixelsPerSecond = ref(
  DEFAULT_SETTINGS.movementSpeedPixelsPerSecond,
);
const workDurationMinutes = ref(DEFAULT_SETTINGS.workDurationMinutes);
const breakDurationMinutes = ref(DEFAULT_SETTINGS.breakDurationMinutes);
const {
  state: timerState,
  phase: timerPhase,
  remainingText,
  statusText,
  handlePrimaryAction,
} = useTimer(workDurationMinutes, breakDurationMinutes);
const isMenuOpen = ref(false);
const isGesturePreviewVisible = ref(false);
const isSettingsOpen = ref(false);
const primaryActionLabel = computed(() => {
  const action = getTimerPrimaryAction(timerState.value);

  if (action === "pause") return "一時停止";
  if (action === "resume") return "再開";
  if (timerState.value.status !== "completed") return "作業開始";

  return timerState.value.phase === "work" ? "休憩開始" : "作業開始";
});
const screenElement = useTemplateRef<HTMLElement>("screenElement");
const containerSize = ref<MotionBounds>({ width: 0, height: 0 });
let clockInterval: number | undefined;
let resizeObserver: ResizeObserver | undefined;
let gesturePointerId: number | undefined;
let gestureStartPosition: PointerPosition | undefined;

const handleThemeToggle = () => {
  theme.value = getNextTheme(theme.value);
};

const handleMenuOpen = () => {
  isGesturePreviewVisible.value = false;
  isMenuOpen.value = true;
};

const handleMenuClose = () => {
  const activeElement = document.activeElement;
  const menuElement = document.querySelector("#clock-menu");

  if (
    activeElement instanceof HTMLElement &&
    menuElement?.contains(activeElement)
  ) {
    activeElement.blur();
  }

  isMenuOpen.value = false;
};

const handleSettingsOpen = () => {
  handleMenuClose();
  isSettingsOpen.value = true;
};

const handleSettingsClose = () => {
  isSettingsOpen.value = false;
};

const resetMenuGesture = () => {
  gesturePointerId = undefined;
  gestureStartPosition = undefined;
  isGesturePreviewVisible.value = false;
};

const handleMenuGestureStart = (event: PointerEvent) => {
  if (
    event.pointerType !== "touch" ||
    !event.isPrimary ||
    isMenuOpen.value ||
    isSettingsOpen.value ||
    !isMenuSwipeStart(event.clientY, window.innerHeight)
  ) {
    return;
  }

  gesturePointerId = event.pointerId;
  gestureStartPosition = { x: event.clientX, y: event.clientY };
  event.currentTarget instanceof Element &&
    event.currentTarget.setPointerCapture(event.pointerId);
};

const handleMenuGestureMove = (event: PointerEvent) => {
  if (
    event.pointerId !== gesturePointerId ||
    !gestureStartPosition ||
    isMenuOpen.value
  ) {
    return;
  }

  const stage = getMenuSwipeStage(gestureStartPosition, {
    x: event.clientX,
    y: event.clientY,
  });

  if (stage === "open") {
    handleMenuOpen();
    return;
  }

  isGesturePreviewVisible.value = stage === "preview";
};

const updateContainerSize = () => {
  const element = screenElement.value;
  if (!element) return;

  containerSize.value = {
    width: element.clientWidth,
    height: element.clientHeight,
  };
};

onMounted(() => {
  clockInterval = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
  updateContainerSize();
  resizeObserver = new ResizeObserver(updateContainerSize);
  if (screenElement.value) resizeObserver.observe(screenElement.value);
});
onUnmounted(() => {
  if (clockInterval !== undefined) window.clearInterval(clockInterval);
  resizeObserver?.disconnect();
});
</script>
<template>
  <main ref="screenElement" class="clock-screen" :class="`theme-${theme}`">
    <ScreenPrimaryControl
      :label="primaryActionLabel"
      :disabled="isMenuOpen || isSettingsOpen"
      @activate="handlePrimaryAction"
    />
    <MovingDisplayBlock
      class="clock-display-motion"
      :container-size="containerSize"
      :movement-speed-pixels-per-second="movementSpeedPixelsPerSecond"
    >
      <ClockDisplay :now="now" />
      <TimerDisplay
        :state="timerState"
        :phase="timerPhase"
        :remaining-text="remainingText"
        :status-text="statusText"
      />
    </MovingDisplayBlock>
    <div
      v-if="isMenuOpen"
      class="menu-backdrop"
      aria-hidden="true"
      @click.stop="handleMenuClose"
    />
    <div
      class="mobile-menu-gesture-area"
      aria-hidden="true"
      @click.stop
      @pointercancel="resetMenuGesture"
      @pointerdown="handleMenuGestureStart"
      @pointermove="handleMenuGestureMove"
      @pointerup="resetMenuGesture"
    />
    <MenuBar
      :open="isMenuOpen"
      :gesture-preview="isGesturePreviewVisible"
      :theme="theme"
      @close="handleMenuClose"
      @open="handleMenuOpen"
      @open-settings="handleSettingsOpen"
      @toggle-theme="handleThemeToggle"
    />
    <SettingsPanel
      v-model:work-duration-minutes="workDurationMinutes"
      v-model:break-duration-minutes="breakDurationMinutes"
      v-model:show-clock-seconds="showClockSeconds"
      v-model:theme="theme"
      v-model:movement-speed-pixels-per-second="movementSpeedPixelsPerSecond"
      :open="isSettingsOpen"
      @close="handleSettingsClose"
    />
  </main>
</template>

<style scoped>
.clock-display-motion {
  z-index: 1;
  pointer-events: none;
}
.mobile-menu-gesture-area {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  height: clamp(32px, 6dvh, 48px);
  pointer-events: none;
  touch-action: none;
}
.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 3;
}
@media (hover: none) and (pointer: coarse) {
  .mobile-menu-gesture-area {
    pointer-events: auto;
  }
}
</style>
