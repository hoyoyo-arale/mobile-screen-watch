<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  completeTimer,
  getNextPhase,
  getRemainingMilliseconds,
  isTimerExpired,
  pauseTimer,
  resumeTimer,
  startTimer,
} from "../logic/timer";
import type { TimerPhase, TimerState } from "../types/app";

interface Props {
  workDurationMinutes: number;
  breakDurationMinutes: number;
}

const props = defineProps<Props>();
const state = ref<TimerState>({ status: "idle" });
const selectedPhase = ref<TimerPhase>("work");
const currentTime = ref(Date.now());
let timerInterval: number | undefined;

const durationFor = (phase: TimerPhase) =>
  phase === "work" ? props.workDurationMinutes : props.breakDurationMinutes;

const phase = computed<TimerPhase>(() =>
  state.value.status === "idle" ? selectedPhase.value : state.value.phase,
);

const remainingMilliseconds = computed(() => {
  const remaining = getRemainingMilliseconds(state.value, currentTime.value);
  return remaining ?? durationFor(selectedPhase.value) * 60_000;
});

const remainingText = computed(() => {
  const totalSeconds = Math.ceil(remainingMilliseconds.value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const statusText = computed(() => {
  if (state.value.status === "completed") return "完了";
  if (state.value.status === "paused") return "一時停止中";
  if (state.value.status === "running") return "実行中";
  return "待機中";
});

const start = (nextPhase = phase.value) => {
  selectedPhase.value = nextPhase;
  state.value = startTimer(
    nextPhase,
    durationFor(nextPhase),
    currentTime.value,
  );
};

const handlePrimaryAction = () => {
  if (state.value.status === "running") {
    state.value = pauseTimer(state.value, currentTime.value);
    return;
  }

  if (state.value.status === "paused") {
    state.value = resumeTimer(state.value, currentTime.value);
    return;
  }

  start(
    state.value.status === "completed"
      ? getNextPhase(state.value.phase)
      : selectedPhase.value,
  );
};

const update = () => {
  currentTime.value = Date.now();
  if (isTimerExpired(state.value, currentTime.value)) {
    state.value = completeTimer(state.value, currentTime.value);
  }
};

onMounted(() => {
  timerInterval = window.setInterval(update, 250);
});

onUnmounted(() => {
  if (timerInterval !== undefined) window.clearInterval(timerInterval);
});
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
