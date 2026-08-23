<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import ClockDisplay from "./components/ClockDisplay.vue";
const now = ref(new Date());
let clockInterval: number | undefined;
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
  <main class="clock-screen">
    <ClockDisplay :now="now" />
  </main>
</template>
