<script setup lang="ts">
import App from './App.vue'
</script>

<template>
  <Suspense>
    <App />

    <!-- loading state via #fallback slot -->
    <template #fallback> Loading... </template>
  </Suspense>
</template>
