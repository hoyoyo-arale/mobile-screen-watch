import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  toValue,
  type MaybeRefOrGetter,
} from "vue";
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

export const useTimer = (
  workDurationMinutes: MaybeRefOrGetter<number>,
  breakDurationMinutes: MaybeRefOrGetter<number>,
) => {
  const state = ref<TimerState>({ status: "idle" });
  const selectedPhase = ref<TimerPhase>("work");
  const currentTime = ref(Date.now());
  let timerInterval: number | undefined;

  const durationFor = (phase: TimerPhase) =>
    phase === "work"
      ? toValue(workDurationMinutes)
      : toValue(breakDurationMinutes);

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

  return {
    state,
    phase,
    remainingText,
    handlePrimaryAction,
  };
};
