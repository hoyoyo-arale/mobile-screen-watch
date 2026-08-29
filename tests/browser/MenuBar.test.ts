import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import MenuBar from "../../src/components/MenuBar.vue";

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
