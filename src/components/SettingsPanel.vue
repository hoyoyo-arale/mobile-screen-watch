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
</template>

<style scoped>
.settings-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 5;
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
