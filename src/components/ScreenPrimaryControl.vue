<script setup lang="ts">
interface Props {
  label: string;
  disabled: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  activate: [];
}>();
</script>

<template>
  <button
    class="screen-primary-control"
    type="button"
    :aria-label="label"
    :disabled="disabled"
    @click="emit('activate')"
  ></button>
</template>

<style scoped>
.screen-primary-control {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}
.screen-primary-control:focus-visible {
  outline: 2px solid var(--primary-text);
  outline-offset: -4px;
}
</style>
