import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-vue";
import App from "../../src/App.vue";
import "../../src/style.css";

test("opens the previewed menu and closes it from outside", async () => {
  const screen = await render(App);
  const hoverAreaElement = screen.container.querySelector(".menu-hover-area");

  if (!(hoverAreaElement instanceof HTMLElement)) {
    throw new Error("Menu hover area was not rendered");
  }

  const hoverArea = page.elementLocator(hoverAreaElement);
  const menuPanelElement = screen.container.querySelector("#clock-menu");
  if (!(menuPanelElement instanceof HTMLElement)) {
    throw new Error("Menu panel was not rendered");
  }
  const menuPanel = page.elementLocator(menuPanelElement);
  const previewButton = screen.getByRole("button", {
    name: "操作メニューを開く",
  });
  const workButton = screen.getByRole("button", { name: "作業開始" });

  await hoverArea.hover();
  await expect.element(previewButton).toBeVisible();

  await previewButton.click();
  await expect.element(workButton).toBeVisible();

  const backdropElement = screen.container.querySelector(".menu-backdrop");
  if (!(backdropElement instanceof HTMLElement)) {
    throw new Error("Menu backdrop was not rendered");
  }

  await page.elementLocator(backdropElement).click();
  await expect.element(menuPanel).toHaveAttribute("aria-hidden", "true");
});
