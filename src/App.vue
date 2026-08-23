<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import ClockDisplay from "./components/ClockDisplay.vue";
import { toggleTheme as getNextTheme } from "./logic/theme";
import type { Theme } from "./types/app";

const now = ref(new Date());
const theme = ref<Theme>("dark");
let clockInterval: number | undefined;

const handleThemeToggle = () => {
  theme.value = getNextTheme(theme.value);
};

onMounted(() => {
  clockInterval = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});
onUnmounted(() => {
  if (clockInterval !== undefined) window.clearInterval(clockInterval);
});
</script>
<template>
  <main class="clock-screen" :class="`theme-${theme}`">
    <ClockDisplay :now="now" />
    <button
      class="theme-toggle"
      type="button"
      :aria-label="
        theme === 'dark' ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'
      "
      :aria-pressed="theme === 'light'"
      @click="handleThemeToggle"
    >
      {{ theme === "dark" ? "ライト" : "ダーク" }}
    </button>
  </main>
</template>
