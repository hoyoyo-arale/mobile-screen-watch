<script setup lang="ts">
import { SETTINGS_OPTIONS, type Theme } from "../types/app";

interface Props {
  open: boolean;
  theme: Theme;
  workDurationMinutes: number;
  breakDurationMinutes: number;
}

defineProps<Props>();
const emit = defineEmits<{
  close: [];
  "update:workDurationMinutes": [value: number];
  "update:breakDurationMinutes": [value: number];
}>();

const numberFromEvent = (event: Event) =>
  Number((event.target as HTMLSelectElement).value);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="settings-layer" :class="`theme-${theme}`">
      <div
        class="settings-backdrop"
        aria-hidden="true"
        @click="emit('close')"
      ></div>
      <section
        class="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <header class="settings-header">
          <h2 id="settings-title">設定</h2>
          <button type="button" @click="emit('close')">閉じる</button>
        </header>
        <div class="settings-content">
          <fieldset class="settings-section">
            <legend>タイマー</legend>
            <label>
              <span>作業時間</span>
              <select
                :value="workDurationMinutes"
                @change="
                  emit('update:workDurationMinutes', numberFromEvent($event))
                "
              >
                <option
                  v-for="minutes in SETTINGS_OPTIONS.workDurationMinutes"
                  :key="minutes"
                  :value="minutes"
                >
                  {{ minutes }}分
                </option>
              </select>
            </label>
            <label>
              <span>休憩時間</span>
              <select
                :value="breakDurationMinutes"
                @change="
                  emit('update:breakDurationMinutes', numberFromEvent($event))
                "
              >
                <option
                  v-for="minutes in SETTINGS_OPTIONS.breakDurationMinutes"
                  :key="minutes"
                  :value="minutes"
                >
                  {{ minutes }}分
                </option>
              </select>
            </label>
          </fieldset>
          <fieldset>
            <legend>サウンド</legend>
          </fieldset>
          <fieldset>
            <legend>表示</legend>
          </fieldset>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.settings-layer {
  --screen-background: #090909;
  --primary-text: #f1eee8;
  --settings-panel-border: #f1eee8;
  position: fixed;
  inset: 0;
  z-index: 5;
}

.settings-layer.theme-light {
  --screen-background: #f3f1ed;
  --primary-text: #252321;
  --settings-panel-border: #252321;
}

.settings-backdrop {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 45%);
}

.settings-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: min(calc(100% - 32px), 720px);
  padding: 20px;
  color: var(--primary-text);
  background: var(--screen-background);
  transform: translate(-50%, -50%);
  border: medium solid var(--settings-panel-border);
  border-radius: 10px;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.settings-header h2 {
  margin: 0;
}

.settings-header button {
  border: 1px solid var(--settings-panel-border);
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--primary-text);
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.settings-header button:hover,
.settings-header button:focus-visible {
  color: var(--screen-background);
  background: var(--primary-text);
}

.settings-content {
  display: grid;
  gap: 16px;
}

.settings-section {
  display: grid;
  gap: 14px;
}

.settings-section label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.settings-section select {
  border: 1px solid var(--settings-panel-border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--primary-text);
  background: var(--screen-background);
  font: inherit;
}
</style>
