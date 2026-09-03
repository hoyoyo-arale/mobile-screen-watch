<script setup lang="ts">
import type { Theme } from "../types/app";

interface Props {
  open: boolean;
  theme: Theme;
}

defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();
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
        <header>
          <h2 id="settings-title">設定</h2>
          <button type="button" @click="emit('close')">閉じる</button>
        </header>
        <div class="settings-content">
          <fieldset>
            <legend>タイマー</legend>
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

.settings-content {
  display: grid;
  gap: 16px;
}
</style>
