import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import MovingDisplayBlock from "../../src/components/MovingDisplayBlock.vue";

test("moves while remaining inside its container", async () => {
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "320px";
  container.style.height = "240px";
  document.body.append(container);

  const screen = await render(MovingDisplayBlock, {
    container,
    props: {
      containerSize: { width: 320, height: 240 },
      movementSpeedPixelsPerSecond: 80,
    },
    slots: {
      default:
        '<div style="width: 80px; height: 40px" aria-label="移動対象" />',
    },
  });
  const movingElement = container.querySelector(".moving-display-block");

  if (!(movingElement instanceof HTMLElement)) {
    throw new Error("Moving display block was not rendered");
  }

  const initialRect = movingElement.getBoundingClientRect();

  await expect
    .poll(() => {
      const currentRect = movingElement.getBoundingClientRect();
      return (
        Math.abs(currentRect.x - initialRect.x) +
        Math.abs(currentRect.y - initialRect.y)
      );
    })
    .toBeGreaterThan(1);

  const containerRect = container.getBoundingClientRect();
  const movingRect = movingElement.getBoundingClientRect();

  expect(movingRect.left).toBeGreaterThanOrEqual(containerRect.left);
  expect(movingRect.top).toBeGreaterThanOrEqual(containerRect.top);
  expect(movingRect.right).toBeLessThanOrEqual(containerRect.right);
  expect(movingRect.bottom).toBeLessThanOrEqual(containerRect.bottom);

  await screen.unmount();
  container.remove();
});
