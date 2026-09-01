<script setup lang="ts">
import breakCoffeeIconUrl from "../assets/icons/break-coffee.svg";
import pausedIconUrl from "../assets/icons/paused.svg";
import workHammerIconUrl from "../assets/icons/work-hammer.svg";
import type { TimerPhase, TimerState } from "../types/app";

interface Props {
  state: TimerState;
  phase: TimerPhase;
  remainingText: string;
  statusText: string;
}

defineProps<Props>();
const isDevelopment = import.meta.env.DEV;
</script>

<template>
  <section
    class="timer-display"
    :class="`timer-display--${phase}`"
    aria-label="タイマー"
  >
    <span class="timer-icons">
      <span
        class="timer-icon"
        :style="{
          '--timer-icon-url': `url(&quot;${phase === 'work' ? workHammerIconUrl : breakCoffeeIconUrl}&quot;)`,
        }"
        role="img"
        :aria-label="phase === 'work' ? '作業' : '休憩'"
      ></span>
      <span
        v-if="state.status === 'paused'"
        class="timer-icon"
        :style="{ '--timer-icon-url': `url(&quot;${pausedIconUrl}&quot;)` }"
        role="img"
        aria-label="一時停止"
      ></span>
    </span>
    <time class="timer-time" :datetime="remainingText">{{
      remainingText
    }}</time>
    <p class="timer-status" aria-live="polite">{{ statusText }}</p>
  </section>
  <Teleport to="body">
    <aside
      v-if="isDevelopment"
      class="timer-icon-debug"
      aria-label="タイマー状態アイコン確認"
    >
      <span class="timer-icon-debug__item timer-display--work">
        <span
          class="timer-icon"
          :style="{
            '--timer-icon-url': `url(&quot;${workHammerIconUrl}&quot;)`,
          }"
          aria-hidden="true"
        ></span>
        作業
      </span>
      <span class="timer-icon-debug__item timer-display--break">
        <span
          class="timer-icon"
          :style="{
            '--timer-icon-url': `url(&quot;${breakCoffeeIconUrl}&quot;)`,
          }"
          aria-hidden="true"
        ></span>
        休憩
      </span>
      <span class="timer-icon-debug__item">
        <span
          class="timer-icon"
          :style="{ '--timer-icon-url': `url(&quot;${pausedIconUrl}&quot;)` }"
          aria-hidden="true"
        ></span>
        一時停止
      </span>
    </aside>
  </Teleport>
</template>
