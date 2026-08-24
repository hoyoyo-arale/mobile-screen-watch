<script setup lang="ts">
import { toRef } from "vue";
import { useTimer } from "../composables/useTimer";

interface Props {
  workDurationMinutes: number;
  breakDurationMinutes: number;
}

const props = defineProps<Props>();
const { state, phase, remainingText, statusText, handlePrimaryAction } =
  useTimer(
    toRef(props, "workDurationMinutes"),
    toRef(props, "breakDurationMinutes"),
  );
</script>

<template>
  <section class="timer-display" aria-label="タイマー">
    <p class="timer-phase">{{ phase === "work" ? "作業" : "休憩" }}</p>
    <time class="timer-time" :datetime="remainingText">{{
      remainingText
    }}</time>
    <p class="timer-status" aria-live="polite">{{ statusText }}</p>
    <button class="timer-action" type="button" @click="handlePrimaryAction">
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
