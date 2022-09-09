<script setup lang="ts">
import Page from './generic/Page.vue'

const props = defineProps<{
  progress: number
}>()
</script>

<template>
  <Page>
    <template #header>
      <h1 class="title">Creating the database</h1>
    </template>
    <template #body>
      <div class="progress-container">
        <div class="progress" :style="{ width: props.progress * 100 + '%' }" />
      </div>
    </template>
  </Page>
</template>

<style lang="scss" scoped>
.progress-container {
  overflow: hidden;
  border: 1px solid var(--color-dark-gray-gray-80);
  border-radius: 0.5rem;

  .progress {
    height: 52px;
    background-color: var(--color-primary);
    transition: width 0.3s ease;
  }
}
</style>
