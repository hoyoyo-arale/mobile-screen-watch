import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-vue";
import App from "../../src/App.vue";
import "../../src/style.css";

const renderMenu = async () => {
  const screen = await render(App);
  const hoverAreaElement = screen.container.querySelector(".menu-hover-area");

  if (!(hoverAreaElement instanceof HTMLElement)) {
    throw new Error("Menu hover area was not rendered");
  }

  const hoverArea = page.elementLocator(hoverAreaElement);
  const menuBarElement = screen.container.querySelector(".menu-bar");
  if (!(menuBarElement instanceof HTMLElement)) {
    throw new Error("Menu bar was not rendered");
  }
  const menuPanelElement = screen.container.querySelector("#clock-menu");
  if (!(menuPanelElement instanceof HTMLElement)) {
    throw new Error("Menu panel was not rendered");
  }
  const menuPanel = page.elementLocator(menuPanelElement);
  const previewButton = screen.getByRole("button", {
    name: "操作メニューを開く",
  });

  return { hoverArea, menuBarElement, menuPanel, previewButton, screen };
};

const openSettings = async () => {
  const rendered = await renderMenu();
  const { hoverArea, menuPanel, previewButton, screen } = rendered;

  await hoverArea.hover();
  await previewButton.click();
  await menuPanel.getByRole("button", { name: "設定" }).click();

  const dialog = page.getByRole("dialog", { name: "設定" });
  await expect.element(dialog).toBeVisible();

  return { ...rendered, dialog };
};

const renderTouchMenu = async () => {
  const rendered = await renderMenu();
  const gestureAreaElement = rendered.screen.container.querySelector(
    ".mobile-menu-gesture-area",
  );

  if (!(gestureAreaElement instanceof HTMLElement)) {
    throw new Error("Mobile menu gesture area was not rendered");
  }

  gestureAreaElement.setPointerCapture = () => undefined;

  return { ...rendered, gestureAreaElement };
};

const dispatchTouchPointer = (
  element: HTMLElement,
  type: string,
  pointerId: number,
  x: number,
  y: number,
) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      clientX: x,
      clientY: y,
      isPrimary: true,
      pointerId,
      pointerType: "touch",
    }),
  );
};

test("shows the menu preview while hovering", async () => {
  const { hoverArea, menuBarElement } = await renderMenu();

  expect(menuBarElement.getBoundingClientRect().top).toBeGreaterThanOrEqual(
    window.innerHeight,
  );
  await hoverArea.hover();
  await expect
    .poll(() => menuBarElement.getBoundingClientRect().top)
    .toBeLessThan(window.innerHeight);
});

test("shows the menu preview after a 12px upward touch gesture", async () => {
  const { gestureAreaElement, menuBarElement } = await renderTouchMenu();
  const pointerId = 1;
  const startY = window.innerHeight - 1;

  dispatchTouchPointer(
    gestureAreaElement,
    "pointerdown",
    pointerId,
    100,
    startY,
  );
  dispatchTouchPointer(
    gestureAreaElement,
    "pointermove",
    pointerId,
    100,
    startY - 12,
  );

  await expect
    .poll(() => menuBarElement.classList.contains("menu-bar--preview"))
    .toBe(true);
});

test("opens the menu after a 48px upward touch gesture", async () => {
  const { gestureAreaElement, menuBarElement, menuPanel } =
    await renderTouchMenu();
  const pointerId = 1;
  const startY = window.innerHeight - 1;

  dispatchTouchPointer(
    gestureAreaElement,
    "pointerdown",
    pointerId,
    100,
    startY,
  );
  dispatchTouchPointer(
    gestureAreaElement,
    "pointermove",
    pointerId,
    100,
    startY - 48,
  );

  await expect
    .poll(() => menuBarElement.classList.contains("menu-bar--open"))
    .toBe(true);
  await expect.element(menuPanel).toHaveAttribute("aria-hidden", "false");
});

test("does not activate the timer after opening the menu by touch gesture", async () => {
  const { gestureAreaElement, menuPanel, screen } = await renderTouchMenu();
  const primaryControl = screen.getByRole("button", { name: "作業開始" });
  const pointerId = 1;
  const startY = window.innerHeight - 1;

  dispatchTouchPointer(
    gestureAreaElement,
    "pointerdown",
    pointerId,
    100,
    startY,
  );
  dispatchTouchPointer(
    gestureAreaElement,
    "pointermove",
    pointerId,
    100,
    startY - 48,
  );
  dispatchTouchPointer(
    gestureAreaElement,
    "pointerup",
    pointerId,
    100,
    startY - 48,
  );
  gestureAreaElement.click();

  await expect.element(menuPanel).toHaveAttribute("aria-hidden", "false");
  await expect
    .element(primaryControl)
    .toHaveAttribute("aria-label", "作業開始");
});

test("hides the touch preview when the gesture ends before opening", async () => {
  const { gestureAreaElement, menuBarElement } = await renderTouchMenu();
  const pointerId = 1;
  const startY = window.innerHeight - 1;

  dispatchTouchPointer(
    gestureAreaElement,
    "pointerdown",
    pointerId,
    100,
    startY,
  );
  dispatchTouchPointer(
    gestureAreaElement,
    "pointermove",
    pointerId,
    100,
    startY - 12,
  );
  await expect
    .poll(() => menuBarElement.classList.contains("menu-bar--preview"))
    .toBe(true);

  dispatchTouchPointer(
    gestureAreaElement,
    "pointerup",
    pointerId,
    100,
    startY - 12,
  );

  await expect
    .poll(() => menuBarElement.classList.contains("menu-bar--preview"))
    .toBe(false);
  expect(menuBarElement).not.toHaveClass("menu-bar--open");
});

test("opens the previewed menu and closes it from outside", async () => {
  const { hoverArea, menuPanel, previewButton, screen } = await renderMenu();
  const settingsButton = menuPanel.getByRole("button", { name: "設定" });

  await hoverArea.hover();
  await previewButton.click();
  await expect.element(settingsButton).toBeVisible();

  const backdropElement = screen.container.querySelector(".menu-backdrop");
  if (!(backdropElement instanceof HTMLElement)) {
    throw new Error("Menu backdrop was not rendered");
  }

  await page.elementLocator(backdropElement).click();
  await expect.element(menuPanel).toHaveAttribute("aria-hidden", "true");
});

test("opens settings from the menu and closes it from the frontmost button", async () => {
  const { dialog } = await openSettings();

  await dialog.getByRole("button", { name: "閉じる" }).click();

  await expect.element(dialog).not.toBeInTheDocument();
});

test("closes settings from the backdrop", async () => {
  const { dialog } = await openSettings();
  const backdropElement = document.querySelector(".settings-backdrop");

  if (!(backdropElement instanceof HTMLElement)) {
    throw new Error("Settings backdrop was not rendered");
  }

  await page.elementLocator(backdropElement).click({
    position: { x: 4, y: 4 },
  });

  await expect.element(dialog).not.toBeInTheDocument();
});

test("does not activate the screen timer control while settings is open", async () => {
  const { screen } = await openSettings();
  const primaryControl = screen.getByRole("button", { name: "作業開始" });

  await expect.element(primaryControl).toBeDisabled();

  const primaryControlElement = primaryControl.element();
  if (!(primaryControlElement instanceof HTMLButtonElement)) {
    throw new Error("Screen primary control was not rendered as a button");
  }
  primaryControlElement.click();

  await expect
    .poll(() => primaryControlElement.getAttribute("aria-label"))
    .toBe("作業開始");
});

test("keeps selected timer durations after settings is reopened", async () => {
  const { dialog, hoverArea, menuPanel, previewButton } = await openSettings();

  await dialog.getByLabelText("作業時間").selectOptions("60");
  await dialog.getByLabelText("休憩時間").selectOptions("15");
  await dialog.getByRole("button", { name: "閉じる" }).click();

  await hoverArea.unhover();
  await hoverArea.hover();
  await previewButton.click();
  await menuPanel.getByRole("button", { name: "設定" }).click();

  const reopenedDialog = page.getByRole("dialog", { name: "設定" });
  await expect
    .element(reopenedDialog.getByLabelText("作業時間"))
    .toHaveValue("60");
  await expect
    .element(reopenedDialog.getByLabelText("休憩時間"))
    .toHaveValue("15");
});

test("applies and keeps the theme selected from settings", async () => {
  const { dialog, hoverArea, previewButton, screen } = await openSettings();

  await dialog.getByLabelText("テーマ").selectOptions("light");

  const clockScreen = screen.container.querySelector(".clock-screen");
  const settingsLayer = document.querySelector(".settings-layer");
  expect(clockScreen).toHaveClass("theme-light");
  expect(settingsLayer).toHaveClass("theme-light");

  await dialog.getByRole("button", { name: "閉じる" }).click();
  await hoverArea.unhover();
  await hoverArea.hover();
  await previewButton.click();
  await page
    .getByRole("navigation", { name: "操作メニュー" })
    .getByRole("button", { name: "設定" })
    .click();

  const reopenedDialog = page.getByRole("dialog", { name: "設定" });
  await expect
    .element(reopenedDialog.getByLabelText("テーマ"))
    .toHaveValue("light");
});

test("toggles clock seconds in the display when the setting changes", async () => {
  const { dialog, screen } = await openSettings();

  expect(screen.container.querySelector(".clock-seconds")).toBeNull();

  await dialog.getByLabelText("秒表示").selectOptions("on");
  await expect
    .poll(() => screen.container.querySelector(".clock-seconds"))
    .not.toBeNull();

  await dialog.getByLabelText("秒表示").selectOptions("off");
  await expect
    .poll(() => screen.container.querySelector(".clock-seconds"))
    .toBeNull();
});
