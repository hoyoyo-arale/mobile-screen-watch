<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import ClockDisplay from "./components/ClockDisplay.vue";
import TimerDisplay from "./components/TimerDisplay.vue";
import { toggleTheme as getNextTheme } from "./logic/theme";
import type { MotionBounds } from "./logic/motion";
import { DEFAULT_SETTINGS, type Theme } from "./types/app";

const now = ref(new Date());
const theme = ref<Theme>("dark");
const movementSpeedPixelsPerSecond = ref(
  DEFAULT_SETTINGS.movementSpeedPixelsPerSecond,
);
const screenElement = useTemplateRef<HTMLElement>("screenElement");
const containerSize = ref<MotionBounds>({ width: 0, height: 0 });
let clockInterval: number | undefined;
let resizeObserver: ResizeObserver | undefined;

const handleThemeToggle = () => {
  theme.value = getNextTheme(theme.value);
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
    <ClockDisplay
      :now="now"
      :container-size="containerSize"
      :movement-speed-pixels-per-second="movementSpeedPixelsPerSecond"
    />
    <TimerDisplay
      :work-duration-minutes="DEFAULT_SETTINGS.workDurationMinutes"
      :break-duration-minutes="DEFAULT_SETTINGS.breakDurationMinutes"
    />
    <button
      class="theme-toggle"
      type="button"
      :aria-label="
        theme === 'dark' ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'
      "
      :aria-pressed="theme === 'light'"
      @click="handleThemeToggle"
    >
      {{ theme === "dark" ? "ライト" : "ダーク" }}
    </button>
  </main>
</template>
