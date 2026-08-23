<script setup lang="ts">
import { computed } from "vue";
import { formatDate, formatTime, toIsoDate } from "../logic/clock";

interface Props {
  now: Date;
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
      <span class="clock-seconds">:{{ timeText.seconds }}</span>
    </time>
    <p class="clock-date">{{ dateText }}</p>
  </section>
</template>
