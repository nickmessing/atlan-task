<script setup lang="ts">
import { RouterView } from 'vue-router'

import Navigation from './Navigation.vue'
</script>

<template>
  <div class="app">
    <Navigation />
    <div class="app-content">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: row;

  > * {
    height: 100%;
  }

  .app-content {
    flex-grow: 1;
  }
}
</style>
