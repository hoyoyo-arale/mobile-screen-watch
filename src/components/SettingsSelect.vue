<script setup lang="ts" generic="T extends string | number">
interface Props {
  label: string;
  modelValue: T;
  options: readonly T[];
  suffix?: string;
  formatOption?: (value: T) => string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: T];
}>();

const optionLabel = (value: T) =>
  props.formatOption?.(value) ?? `${value}${props.suffix ?? ""}`;

const handleChange = (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value;
  const option = props.options.find((value) => String(value) === selectedValue);

  if (option !== undefined) emit("update:modelValue", option);
};
</script>

<template>
  <label class="settings-select">
    <span>{{ label }}</span>
    <select :value="modelValue" @change="handleChange">
      <option v-for="option in options" :key="option" :value="option">
        {{ optionLabel(option) }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.settings-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.settings-select select {
  border: 1px solid var(--settings-panel-border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--primary-text);
  background: var(--screen-background);
  font: inherit;
}
</style>
