<script setup lang="ts">
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
  <section class="timer-display" aria-label="タイマー">
    <p class="timer-phase">{{ phase === "work" ? "作業" : "休憩" }}</p>
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
