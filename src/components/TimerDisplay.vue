<script setup lang="ts">
import breakCoffeeIconUrl from "../assets/icons/break-coffee-outline.svg";
import idleTimerIconUrl from "../assets/icons/idle-timer-outline.svg";
import pausedIconUrl from "../assets/icons/paused.svg";
import workWrenchIconUrl from "../assets/icons/work-wrench.svg";
import type { TimerPhase, TimerState } from "../types/app";

interface Props {
  state: TimerState;
  phase: TimerPhase;
  remainingText: string;
}

defineProps<Props>();
</script>

<template>
  <section
    class="timer-display"
    :class="[
      `timer-display--${phase}`,
      { 'timer-display--paused': state.status === 'paused' },
    ]"
    aria-label="タイマー"
  >
    <span class="timer-icons">
      <span
        v-if="state.status === 'paused'"
        class="timer-icon"
        :style="{ '--timer-icon-url': `url(&quot;${pausedIconUrl}&quot;)` }"
        role="img"
        aria-label="一時停止"
      ></span>
      <span
        v-else
        class="timer-icon"
        :style="{
          '--timer-icon-url': `url(&quot;${state.status === 'idle' ? idleTimerIconUrl : phase === 'work' ? workWrenchIconUrl : breakCoffeeIconUrl}&quot;)`,
        }"
        role="img"
        :aria-label="
          state.status === 'idle' ? '待機' : phase === 'work' ? '作業' : '休憩'
        "
      ></span>
    </span>
    <time class="timer-time" :datetime="remainingText">{{
      remainingText
    }}</time>
  </section>
</template>

<style scoped>
.timer-display {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.5em;
  margin: clamp(12px, 2.5vw, 24px) auto 0;
  padding: 0.45em 1.1em 0.45em 0.85em;
  border-radius: 999px;
  font-size: 1.8rem;
  color: var(--timer-color);
  background: color-mix(in srgb, var(--timer-color) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--timer-color) 45%, transparent);
  transition:
    opacity 180ms ease,
    border-color 180ms ease;
}

.timer-display--work {
  --timer-color: #5fa8ff;
}

.timer-display--break {
  --timer-color: #58c989;
}

.timer-display--paused {
  border-style: dashed;
  opacity: 0.7;
}

.timer-icons {
  display: flex;
}

.timer-icon {
  width: 0.95em;
  height: 0.95em;
  background: currentColor;
  mask: var(--timer-icon-url) center / contain no-repeat;
}

.timer-time {
  font-size: 1em;
  font-weight: 500;
  letter-spacing: 0.01em;
  font-variant-numeric: tabular-nums;
}
</style>
