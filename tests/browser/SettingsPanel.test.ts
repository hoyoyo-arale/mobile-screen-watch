import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-vue";
import SettingsPanel from "../../src/components/SettingsPanel.vue";

const renderSettingsPanel = () =>
  render(SettingsPanel, {
    props: {
      open: true,
      theme: "dark",
      workDurationMinutes: 50,
      breakDurationMinutes: 10,
      showClockSeconds: false,
      movementSpeedPixelsPerSecond: 15,
    },
  });

test("shows the configured work and break duration options", async () => {
  await renderSettingsPanel();
  const workSelect = page.getByLabelText("作業時間").element();
  const breakSelect = page.getByLabelText("休憩時間").element();

  if (
    !(workSelect instanceof HTMLSelectElement) ||
    !(breakSelect instanceof HTMLSelectElement)
  ) {
    throw new Error("Timer duration selects were not rendered");
  }

  expect([...workSelect.options].map((option) => option.value)).toEqual([
    "45",
    "50",
    "60",
    "75",
  ]);
  expect([...breakSelect.options].map((option) => option.value)).toEqual([
    "10",
    "15",
    "20",
  ]);
});

test("emits updates when timer durations are selected", async () => {
  const screen = await renderSettingsPanel();

  await page.getByLabelText("作業時間").selectOptions("60");
  await page.getByLabelText("休憩時間").selectOptions("15");

  expect(screen.emitted("update:workDurationMinutes")).toEqual([[60]]);
  expect(screen.emitted("update:breakDurationMinutes")).toEqual([[15]]);
});

test("shows the available theme options", async () => {
  await renderSettingsPanel();
  const themeSelect = page.getByLabelText("テーマ").element();

  if (!(themeSelect instanceof HTMLSelectElement)) {
    throw new Error("Theme select was not rendered");
  }

  expect([...themeSelect.options].map((option) => option.value)).toEqual([
    "dark",
    "light",
  ]);
});

test("emits an update when a theme is selected", async () => {
  const screen = await renderSettingsPanel();

  await page.getByLabelText("テーマ").selectOptions("light");

  expect(screen.emitted("update:theme")).toEqual([["light"]]);
});
