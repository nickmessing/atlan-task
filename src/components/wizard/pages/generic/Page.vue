<script setup lang="ts">
const props = defineProps<{
  isHeaderHidden?: boolean
  isBodyHidden?: boolean
  isFooterHidden?: boolean
}>()
</script>

<template>
  <div class="container">
    <Transition name="wizard-slide-fade">
      <div v-if="!props.isHeaderHidden" class="header">
        <slot name="header" />
      </div>
    </Transition>
    <Transition name="wizard-slide-fade">
      <div v-if="!props.isBodyHidden" class="body">
        <slot name="body" />
      </div>
    </Transition>
    <Transition name="wizard-slide-fade">
      <div v-if="!props.isFooterHidden" class="footer">
        <slot name="footer" />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    margin-bottom: 3rem;
  }

  .body {
    flex-grow: 1;
  }
}
</style>
