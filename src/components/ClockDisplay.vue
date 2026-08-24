<script setup lang="ts">
import { computed, toRef, useTemplateRef } from "vue";
import { formatDate, formatTime, toIsoDate } from "../logic/clock";
import type { MotionBounds } from "../logic/motion";
import { useClockMotion } from "../composables/useClockMotion";

interface Props {
  now: Date;
  containerSize: MotionBounds;
  movementSpeedPixelsPerSecond: number;
}

const props = defineProps<Props>();
const motionElement = useTemplateRef<HTMLElement>("motionElement");

const timeText = computed(() => formatTime(props.now));
const dateText = computed(() => formatDate(props.now));
const isoDate = computed(() => toIsoDate(props.now));

const { motionStyle } = useClockMotion(
  motionElement,
  toRef(props, "containerSize"),
  toRef(props, "movementSpeedPixelsPerSecond"),
);
</script>

<template>
  <div ref="motionElement" class="clock-motion" :style="motionStyle">
    <section class="clock-block" aria-label="現在時刻">
      <time class="clock-time" :datetime="isoDate">
        <span>{{ timeText.hours }}</span>
        <span aria-hidden="true">:</span>
        <span>{{ timeText.minutes }}</span>
        <span class="clock-seconds">:{{ timeText.seconds }}</span>
      </time>
      <p class="clock-date">{{ dateText }}</p>
    </section>
  </div>
</template>
