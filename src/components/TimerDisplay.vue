<script setup lang="ts">
import breakCoffeeIconUrl from "../assets/icons/break-coffee.svg";
import pausedIconUrl from "../assets/icons/paused.svg";
import workHammerIconUrl from "../assets/icons/work-hammer.svg";
import type { TimerPhase, TimerState } from "../types/app";

interface Props {
  state: TimerState;
  phase: TimerPhase;
  remainingText: string;
  statusText: string;
}

defineProps<Props>();
const emit = defineEmits<{
  primaryAction: [];
}>();
</script>

<template>
  <section
    class="timer-display"
    :class="`timer-display--${phase}`"
    aria-label="タイマー"
  >
    <span
      class="timer-icons"
      role="img"
      :aria-label="`${phase === 'work' ? '作業' : '休憩'}${
        state.status === 'paused' ? '、一時停止' : ''
      }`"
    >
      <span
        class="timer-icon"
        :style="{
          '--timer-icon-url': `url(&quot;${phase === 'work' ? workHammerIconUrl : breakCoffeeIconUrl}&quot;)`,
        }"
        aria-hidden="true"
      ></span>
      <span
        v-if="state.status === 'paused'"
        class="timer-icon"
        :style="{ '--timer-icon-url': `url(&quot;${pausedIconUrl}&quot;)` }"
        aria-hidden="true"
      ></span>
    </span>
    <time class="timer-time" :datetime="remainingText">{{
      remainingText
    }}</time>
    <p class="timer-status" aria-live="polite">{{ statusText }}</p>
    <button class="timer-action" type="button" @click="emit('primaryAction')">
      {{
        state.status === "running"
          ? "一時停止"
          : state.status === "paused"
            ? "再開"
            : "開始"
      }}
    </button>
  </section>
</template>
