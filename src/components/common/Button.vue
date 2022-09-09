<script setup lang="ts">
const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<template>
  <button class="button" @click="emit('click')">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  cursor: pointer;
  height: 56px;
  background: var(--color-primary);
  border-radius: 12px;
  font-size: 14px;
  line-height: 18px;
  border: 0 none;
  outline: none;
  padding: 0 2rem;
}
</style>
