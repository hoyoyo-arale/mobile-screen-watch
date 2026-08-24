<script setup lang="ts">
import { onUnmounted, watch } from "vue";

interface Props {
  open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  openSettings: [];
  startTimer: [];
}>();

let hideTimeout: number | undefined;

const scheduleHide = () => {
  if (hideTimeout !== undefined) window.clearTimeout(hideTimeout);
  hideTimeout = window.setTimeout(() => emit("close"), 5_000);
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
  <nav
    class="menu-bar"
    :class="{ 'menu-bar--open': open }"
    aria-label="操作メニュー"
    @pointerenter="handleInteraction"
    @focusin="handleInteraction"
  >
    <Transition name="menu-sheet">
      <div v-if="open" id="clock-menu" class="menu-panel" @click.stop>
        <button type="button" @click="emit('startTimer')">作業開始</button>
        <button type="button" @click="emit('openSettings')">設定</button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.menu-bar {
  position: fixed;
  right: 10%;
  bottom: max(24px, env(safe-area-inset-bottom));
  left: 10%;
  z-index: 2;
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
.menu-sheet-enter-active,
.menu-sheet-leave-active {
  transition: transform 180ms ease;
}
.menu-sheet-enter-from,
.menu-sheet-leave-to {
  transform: translateY(100%);
}
@media (prefers-reduced-motion: reduce) {
  .menu-sheet-enter-active,
  .menu-sheet-leave-active {
    transition-duration: 0ms;
  }
}
</style>
