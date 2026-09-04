<script setup lang="ts">
import breakCoffeeIconUrl from "../assets/icons/break-coffee.svg";
import idleTimerIconUrl from "../assets/icons/idle-timer-outline.svg";
import pausedIconUrl from "../assets/icons/paused.svg";
import workHammerIconUrl from "../assets/icons/work-hammer.svg";
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
    :class="`timer-display--${phase}`"
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
          '--timer-icon-url': `url(&quot;${state.status === 'idle' ? idleTimerIconUrl : phase === 'work' ? workHammerIconUrl : breakCoffeeIconUrl}&quot;)`,
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
