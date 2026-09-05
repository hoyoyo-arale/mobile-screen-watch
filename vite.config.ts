import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  base: "/mobile-screen-watch/",
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/pwa-192.png", "icons/pwa-512.png"],
      manifest: {
        name: "Mobile Screen Watch",
        short_name: "Screen Watch",
        description: "作業・休憩タイマー付きの24時間表示クロック",
        theme_color: "#090909",
        background_color: "#090909",
        display: "standalone",
        lang: "ja",
        start_url: "/mobile-screen-watch/",
        scope: "/mobile-screen-watch/",
        icons: [
          {
            src: "icons/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "happy-dom",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        plugins: [vue()],
        test: {
          name: "browser",
          include: ["tests/browser/**/*.test.ts"],
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
