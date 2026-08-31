<script setup lang="ts">
import { toRef, useTemplateRef } from "vue";
import { useClockMotion } from "../composables/useClockMotion";
import type { MotionBounds } from "../logic/motion";

interface Props {
  containerSize: MotionBounds;
  movementSpeedPixelsPerSecond: number;
}

const props = defineProps<Props>();
const motionElement = useTemplateRef<HTMLElement>("motionElement");

const { motionStyle } = useClockMotion(
  motionElement,
  toRef(props, "containerSize"),
  toRef(props, "movementSpeedPixelsPerSecond"),
);
</script>

<template>
  <div ref="motionElement" class="moving-display-block" :style="motionStyle">
    <slot />
  </div>
</template>

<style scoped>
.moving-display-block {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}
</style>
