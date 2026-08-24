import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, ref, toRef, type PropType } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MotionBounds } from "../logic/motion";
import { useClockMotion } from "./useClockMotion";

const Host = defineComponent({
  props: {
    containerSize: {
      type: Object as PropType<MotionBounds>,
      required: true,
    },
  },
  setup(props) {
    const element = ref<HTMLElement | null>(null);
    const { motionStyle } = useClockMotion(
      element,
      toRef(props, "containerSize"),
    );

    return { element, motionStyle };
  },
  template: '<div ref="element" :style="motionStyle" />',
});

describe("useClockMotion lifecycle", () => {
  let animationCallbacks: FrameRequestCallback[];
  let resizeObserverInstance: {
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    animationCallbacks = [];
    resizeObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };

    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        animationCallbacks.push(callback);
        return animationCallbacks.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal(
      "ResizeObserver",
      class MockResizeObserver {
        observe = resizeObserverInstance.observe;
        disconnect = resizeObserverInstance.disconnect;
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts animation and observes the element when mounted", () => {
    const wrapper = mount(Host, {
      props: { containerSize: { width: 320, height: 480 } },
    });

    expect(requestAnimationFrame).toHaveBeenCalledOnce();
    expect(resizeObserverInstance.observe).toHaveBeenCalledWith(
      wrapper.vm.element,
    );
    wrapper.unmount();
  });

  it("updates the transform on the next animation frame", async () => {
    const wrapper = mount(Host, {
      props: { containerSize: { width: 320, height: 480 } },
    });
    const element = wrapper.vm.element as HTMLElement;

    animationCallbacks[0](1000);
    animationCallbacks[1](1100);
    await nextTick();

    expect(element.style.transform).not.toBe("");
    expect(element.style.transform).toContain("translate3d(");
    wrapper.unmount();
  });

  it("cancels animation and disconnects the observer when unmounted", () => {
    const wrapper = mount(Host, {
      props: { containerSize: { width: 320, height: 480 } },
    });

    wrapper.unmount();

    expect(cancelAnimationFrame).toHaveBeenCalledOnce();
    expect(resizeObserverInstance.disconnect).toHaveBeenCalledOnce();
  });
});
