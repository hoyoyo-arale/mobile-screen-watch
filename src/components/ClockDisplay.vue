<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { formatDate, formatTime, toIsoDate } from "../logic/clock";
import {
  advanceMotion,
  createVelocity,
  type MotionBounds,
  type MotionState,
} from "../logic/motion";

interface Props {
  now: Date;
  containerSize: MotionBounds;
}

const props = defineProps<Props>();
const motionElement = useTemplateRef<HTMLElement>("motionElement");
const motion = ref<MotionState>({
  x: 0,
  y: 0,
  ...createVelocity(80, Math.PI / 4),
});
const bounds = ref<MotionBounds>({ width: 0, height: 0 });
let animationFrameId: number | undefined;
let previousTimestamp: number | undefined;
let resizeObserver: ResizeObserver | undefined;
let hasPositioned = false;

const timeText = computed(() => formatTime(props.now));
const dateText = computed(() => formatDate(props.now));
const isoDate = computed(() => toIsoDate(props.now));

const motionStyle = computed(() => ({
  transform: `translate3d(${motion.value.x}px, ${motion.value.y}px, 0)`,
}));

const updateBounds = () => {
  const element = motionElement.value;
  if (!element) return;

  bounds.value = {
    width: Math.max(0, props.containerSize.width - element.offsetWidth),
    height: Math.max(0, props.containerSize.height - element.offsetHeight),
  };

  if (!hasPositioned) {
    hasPositioned = true;
    motion.value = {
      ...motion.value,
      x: bounds.value.width / 2,
      y: bounds.value.height / 2,
    };
    return;
  }

  motion.value = {
    ...motion.value,
    x: Math.min(motion.value.x, bounds.value.width),
    y: Math.min(motion.value.y, bounds.value.height),
  };
};

watch(
  () => [props.containerSize.width, props.containerSize.height],
  updateBounds,
);

const animate = (timestamp: number) => {
  if (previousTimestamp === undefined) previousTimestamp = timestamp;

  const deltaSeconds = Math.min((timestamp - previousTimestamp) / 1000, 0.1);
  previousTimestamp = timestamp;
  motion.value = advanceMotion(motion.value, deltaSeconds, bounds.value);
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  updateBounds();
  resizeObserver = new ResizeObserver(updateBounds);
  if (motionElement.value) resizeObserver.observe(motionElement.value);
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
  resizeObserver?.disconnect();
});
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
