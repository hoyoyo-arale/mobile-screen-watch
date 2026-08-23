<script setup lang="ts">
import { computed } from "vue";

interface Props {
  now: Date;
}

const props = defineProps<Props>();

const pad = (value: number) => String(value).padStart(2, "0");

const timeText = computed(() => ({
  hours: pad(props.now.getHours()),
  minutes: pad(props.now.getMinutes()),
  seconds: pad(props.now.getSeconds()),
}));

const dateText = computed(() => {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return (
    String(props.now.getFullYear()) +
    "年" +
    String(props.now.getMonth() + 1) +
    "月" +
    String(props.now.getDate()) +
    "日（" +
    weekdays[props.now.getDay()] +
    "）"
  );
});

const isoDate = computed(() => props.now.toISOString());
</script>

<template>
  <section class="clock-block" aria-label="現在時刻">
    <time class="clock-time" :datetime="isoDate">
      <span>{{ timeText.hours }}</span>
      <span aria-hidden="true">:</span>
      <span>{{ timeText.minutes }}</span>
      <span class="clock-seconds">:{{ timeText.seconds }}</span>
    </time>
    <p class="clock-date">{{ dateText }}</p>
  </section>
</template>
