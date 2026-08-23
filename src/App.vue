<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import ClockDisplay from "./components/ClockDisplay.vue";
import type { Theme } from "./types/app";

const now = ref(new Date());
const theme = ref<Theme>("dark");
let clockInterval: number | undefined;

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
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
      @click="toggleTheme"
    >
      {{ theme === "dark" ? "ライト" : "ダーク" }}
    </button>
  </main>
</template>
