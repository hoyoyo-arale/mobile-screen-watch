import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-vue";
import SettingsSelect from "../../src/components/SettingsSelect.vue";

test("renders string options with a suffix", async () => {
  await render(SettingsSelect, {
    props: {
      label: "表示密度",
      modelValue: "compact",
      options: ["compact", "comfortable"],
      suffix: " mode",
    },
  });
  const select = page.getByLabelText("表示密度").element();

  if (!(select instanceof HTMLSelectElement)) {
    throw new Error("Settings select was not rendered");
  }

  expect([...select.options].map((option) => option.text)).toEqual([
    "compact mode",
    "comfortable mode",
  ]);
});

test("emits a selected number without converting it to a string", async () => {
  const screen = await render(SettingsSelect, {
    props: {
      label: "数量",
      modelValue: 10,
      options: [10, 20, 30],
    },
  });

  await page.getByLabelText("数量").selectOptions("20");

  const emittedValue = screen.emitted("update:modelValue")?.[0]?.[0];
  expect(emittedValue).toBe(20);
  expect(typeof emittedValue).toBe("number");
});

test("uses a formatter for option labels", async () => {
  await render(SettingsSelect, {
    props: {
      label: "サイズ",
      modelValue: "small",
      options: ["small", "large"],
      suffix: " ignored",
      formatOption: (value: string | number) =>
        value === "small" ? "小さい" : "大きい",
    },
  });
  const select = page.getByLabelText("サイズ").element();

  if (!(select instanceof HTMLSelectElement)) {
    throw new Error("Settings select was not rendered");
  }

  expect([...select.options].map((option) => option.text)).toEqual([
    "小さい",
    "大きい",
  ]);
});
