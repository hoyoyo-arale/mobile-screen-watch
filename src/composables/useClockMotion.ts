import { computed, onMounted, onUnmounted, ref, type Ref, watch } from "vue";
import {
  advanceMotion,
  createVelocity,
  type MotionBounds,
  type MotionState,
} from "../logic/motion";

export const useClockMotion = (
  motionElement: Readonly<Ref<HTMLElement | null>>,
  containerSize: Readonly<Ref<MotionBounds>>,
) => {
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

  const updateBounds = () => {
    const element = motionElement.value;
    if (!element) return;

    bounds.value = {
      width: Math.max(0, containerSize.value.width - element.offsetWidth),
      height: Math.max(0, containerSize.value.height - element.offsetHeight),
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

  watch(containerSize, updateBounds);

  const animate = (timestamp: number) => {
    if (previousTimestamp === undefined) previousTimestamp = timestamp;

    const deltaSeconds = Math.min((timestamp - previousTimestamp) / 1000, 0.1);
    previousTimestamp = timestamp;
    motion.value = advanceMotion(motion.value, deltaSeconds, bounds.value);
    animationFrameId = requestAnimationFrame(animate);
  };

  const motionStyle = computed(() => ({
    transform: `translate3d(${motion.value.x}px, ${motion.value.y}px, 0)`,
  }));

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

  return { motion, bounds, motionStyle };
};
