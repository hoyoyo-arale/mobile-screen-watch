<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { UI_TIMINGS, type Theme } from "../types/app";

interface Props {
  open: boolean;
  theme: Theme;
  autoHideDurationMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoHideDurationMs: UI_TIMINGS.menuAutoHideDurationMs,
});
const emit = defineEmits<{
  close: [];
  open: [];
  openSettings: [];
  startTimer: [];
  toggleTheme: [];
}>();

let hideTimeout: number | undefined;

const scheduleHide = () => {
  if (hideTimeout !== undefined) window.clearTimeout(hideTimeout);
  hideTimeout = window.setTimeout(
    () => emit("close"),
    props.autoHideDurationMs,
  );
};

watch(
  () => props.open,
  (open) => {
    if (open) scheduleHide();
  },
);

const handleInteraction = () => {
  scheduleHide();
};

onUnmounted(() => {
  if (hideTimeout !== undefined) window.clearTimeout(hideTimeout);
});
</script>

<template>
  <div class="menu-hover-area" :class="{ 'menu-hover-area--open': open }">
    <nav
      class="menu-bar"
      :class="{ 'menu-bar--open': open }"
      aria-label="操作メニュー"
      @pointerenter="handleInteraction"
      @focusin="handleInteraction"
    >
      <button
        v-if="!open"
        class="menu-peek-trigger"
        type="button"
        tabindex="-1"
        aria-label="操作メニューを開く"
        @click.stop="emit('open')"
      />
      <div
        id="clock-menu"
        class="menu-panel"
        :aria-hidden="!open"
        :inert="!open"
        @click.stop
      >
        <button type="button" @click="emit('startTimer')">作業開始</button>
        <button
          class="theme-toggle"
          type="button"
          :aria-label="
            theme === 'dark'
              ? 'ライトテーマに切り替え'
              : 'ダークテーマに切り替え'
          "
          :aria-pressed="theme === 'light'"
          @click="emit('toggleTheme')"
        >
          {{ theme === "dark" ? "ライト" : "ダーク" }}
        </button>
        <button type="button" @click="emit('openSettings')">設定</button>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.menu-hover-area {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  height: 0;
  pointer-events: none;
}
.menu-bar {
  --menu-bottom-gap: max(24px, env(safe-area-inset-bottom));
  position: fixed;
  right: 10%;
  bottom: var(--menu-bottom-gap);
  left: 10%;
  pointer-events: auto;
  transform: translateY(calc(100% + var(--menu-bottom-gap)));
  transition: transform 180ms ease;
}
.menu-bar--open {
  transform: translateY(0);
}
.menu-panel {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px max(16px, env(safe-area-inset-left))
    max(12px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-right));
  border: 1px solid var(--control-border);
  border-radius: 16px;
  background: var(--screen-background);
  box-shadow: 0 8px 24px rgb(0 0 0 / 20%);
}
.menu-peek-trigger {
  position: absolute;
  inset: 0;
  z-index: 1;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}
@media (hover: hover) and (pointer: fine) {
  .menu-hover-area:not(.menu-hover-area--open) {
    height: 100px;
    pointer-events: auto;
  }
  .menu-hover-area:hover .menu-bar:not(.menu-bar--open) {
    transform: translateY(calc(100% + var(--menu-bottom-gap) - 16px));
  }
}
.menu-panel button {
  border: 1px solid var(--control-border);
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--primary-text);
  background: var(--screen-background);
  font: inherit;
  cursor: pointer;
}
.menu-panel button:hover,
.menu-panel button:focus-visible {
  background: color-mix(
    in srgb,
    var(--primary-text) 10%,
    var(--screen-background)
  );
}
.theme-toggle {
  opacity: 0.75;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    opacity 180ms ease;
}
.theme-toggle:hover,
.theme-toggle:focus-visible {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .menu-bar {
    transition-duration: 0ms;
  }
}
</style>
