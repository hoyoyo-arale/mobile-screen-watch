<script setup lang="ts">
interface Props {
  open: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <section
    v-if="open"
    class="settings-panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-title"
  >
    <header>
      <h2 id="settings-title">設定</h2>
      <button type="button" @click="emit('close')">閉じる</button>
    </header>
  </section>
</template>

<style scoped>
.settings-panel {
  position: relative;
  z-index: 5;
}
</style>
