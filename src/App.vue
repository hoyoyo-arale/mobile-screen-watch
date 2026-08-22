<script setup lang="ts">
const features = [
  '24時間制の時計表示',
  '焼き付き防止のスクリーンセーバー',
  '座り過ぎ防止タイマー',
]
</script>

<template>
  <main class="welcome">
    <section class="welcome-card" aria-labelledby="title">
      <p class="eyebrow">MOBILE SCREEN WATCH</p>
      <h1 id="title">Vue スタートページ</h1>
      <p class="lead">
        24時間制の時計と、座り過ぎ防止タイマーを備えた画面を作っていきます。
      </p>
      <ul class="features">
        <li v-for="feature in features" :key="feature">{{ feature }}</li>
      </ul>
      <p class="status"><span aria-hidden="true"></span> 開発環境は起動準備完了です</p>
    </section>
  </main>
</template>
