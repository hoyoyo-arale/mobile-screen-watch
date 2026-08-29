import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-vue";
import MenuBar from "../../src/components/MenuBar.vue";

test("hides the menu preview after the configured duration", async () => {
  const screen = await render(MenuBar, {
    props: {
      open: false,
      theme: "dark",
      previewDurationMs: 300,
    },
  });
  const hoverAreaElement = screen.container.querySelector(".menu-hover-area");
  const menuBarElement = screen.container.querySelector(".menu-bar");

  if (!(hoverAreaElement instanceof HTMLElement)) {
    throw new Error("Menu hover area was not rendered");
  }
  if (!(menuBarElement instanceof HTMLElement)) {
    throw new Error("Menu bar was not rendered");
  }

  await page.elementLocator(hoverAreaElement).hover();
  await expect
    .poll(() => menuBarElement.getBoundingClientRect().top)
    .toBeLessThan(window.innerHeight);
  await expect
    .poll(() => menuBarElement.getBoundingClientRect().top)
    .toBeGreaterThanOrEqual(window.innerHeight);
});

test("emits close after the configured auto-hide duration", async () => {
  const screen = await render(MenuBar, {
    props: {
      open: false,
      theme: "dark",
      autoHideDurationMs: 50,
    },
  });

  await screen.rerender({ open: true });

  await expect.poll(() => screen.emitted("close")?.length ?? 0).toBe(1);
});
