<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
const now = ref(new Date());
let clockInterval: number | undefined;

const pad = (value: number) => String(value).padStart(2, "0");

const timeText = computed(() => {
  const date = now.value;
  return {
    hours: pad(date.getHours()),
    minutes: pad(date.getMinutes()),
    seconds: pad(date.getSeconds()),
  };
});

const dateText = computed(() => {
  const date = now.value;
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return (
    String(date.getFullYear()) +
    "年" +
    String(date.getMonth() + 1) +
    "月" +
    String(date.getDate()) +
    "日（" +
    weekdays[date.getDay()] +
    "）"
  );
});

const isoDate = computed(() => now.value.toISOString());
onMounted(() => {
  clockInterval = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});
onUnmounted(() => {
  if (clockInterval !== undefined) window.clearInterval(clockInterval);
});
</script>
<template>
  <main class="clock-screen">
    <section class="clock-block" aria-label="現在時刻">
      <time class="clock-time" :datetime="isoDate"
        ><span>{{ timeText.hours }}</span
        ><span aria-hidden="true">:</span><span>{{ timeText.minutes }}</span
        ><span class="clock-seconds">:{{ timeText.seconds }}</span></time
      >
      <p class="clock-date">{{ dateText }}</p>
    </section>
  </main>
</template>
