<script setup lang="ts">
import { computed } from "vue";
import { formatDate, formatTime, toIsoDate } from "../logic/clock";

interface Props {
  now: Date;
  showSeconds: boolean;
}

const props = defineProps<Props>();

const timeText = computed(() => formatTime(props.now));
const dateText = computed(() => formatDate(props.now));
const isoDate = computed(() => toIsoDate(props.now));
</script>

<template>
  <section class="clock-block" aria-label="現在時刻">
    <time class="clock-time" :datetime="isoDate">
      <span>{{ timeText.hours }}</span>
      <span aria-hidden="true">:</span>
      <span>{{ timeText.minutes }}</span>
      <span v-if="showSeconds" class="clock-seconds"
        >:{{ timeText.seconds }}</span
      >
    </time>
    <p class="clock-date">{{ dateText }}</p>
  </section>
</template>

<style scoped>
.clock-block {
  width: min(100%, 1100px);
  text-align: center;
  pointer-events: none;
  user-select: none;
}
.clock-time {
  display: inline-flex;
  align-items: baseline;
  color: var(--primary-text);
  font-size: clamp(4rem, 19vw, 15rem);
  font-weight: 400;
  letter-spacing: -0.08em;
  line-height: 0.95;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.clock-seconds {
  margin-left: 0.16em;
  color: var(--seconds-text);
  font-size: 0.42em;
  letter-spacing: -0.06em;
}
.clock-date {
  margin: clamp(24px, 5vw, 48px) 0 0;
  color: var(--secondary-text);
  font-size: clamp(1rem, 3.5vw, 2rem);
  letter-spacing: 0.04em;
}
@media (orientation: portrait) {
  .clock-time {
    font-size: clamp(4rem, 19vw, 15rem);
  }
}
@media (orientation: landscape) {
  .clock-time {
    font-size: clamp(3rem, min(19vw, 30vh), 15rem);
  }
  .clock-date {
    margin-top: clamp(16px, 4vh, 32px);
  }
}
</style>
