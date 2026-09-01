import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";
import ScreenPrimaryControl from "../../src/components/ScreenPrimaryControl.vue";

test("uses the provided accessible label", async () => {
  const screen = await render(ScreenPrimaryControl, {
    props: { label: "一時停止", disabled: false },
  });
  const control = screen.getByRole("button", { name: "一時停止" });

  await expect.element(control).toHaveAttribute("aria-label", "一時停止");
});

test("covers its positioned container", async () => {
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "320px";
  container.style.height = "240px";
  document.body.append(container);

  const screen = await render(ScreenPrimaryControl, {
    container,
    props: { label: "作業開始", disabled: false },
  });
  const controlElement = container.querySelector(".screen-primary-control");

  if (!(controlElement instanceof HTMLButtonElement)) {
    throw new Error("Screen primary control was not rendered");
  }

  const containerRect = container.getBoundingClientRect();
  const controlRect = controlElement.getBoundingClientRect();

  expect(controlRect.left).toBe(containerRect.left);
  expect(controlRect.top).toBe(containerRect.top);
  expect(controlRect.width).toBe(containerRect.width);
  expect(controlRect.height).toBe(containerRect.height);

  await screen.unmount();
  container.remove();
});

test("emits activate from pointer and keyboard input", async () => {
  const screen = await render(ScreenPrimaryControl, {
    props: { label: "再開", disabled: false },
  });
  const control = screen.getByRole("button", { name: "再開" });

  await control.click();
  expect(screen.emitted("activate")).toHaveLength(1);

  control.element().focus();
  await userEvent.keyboard("{Enter}");
  await userEvent.keyboard("{Space}");
  expect(screen.emitted("activate")).toHaveLength(3);
});

test("does not emit activate while disabled", async () => {
  const screen = await render(ScreenPrimaryControl, {
    props: { label: "一時停止", disabled: true },
  });
  const control = page.getByRole("button", { name: "一時停止" });

  await expect.element(control).toBeDisabled();
  control.element().click();
  expect(screen.emitted("activate")).toBeUndefined();
});
