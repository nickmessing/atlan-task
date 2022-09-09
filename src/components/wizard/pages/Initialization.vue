<script setup lang="ts">
import { useTimeout } from '@vueuse/core'

import Page from './generic/Page.vue'

const emit = defineEmits<{
  (event: 'next', withTemplate: boolean): void
}>()

const isTypePickerVisible = useTimeout(600)
</script>

<template>
  <Page :isBodyHidden="!isTypePickerVisible">
    <template #header>
      <h1 class="title">Let's get you started</h1>
    </template>
    <template #body>
      <div class="type-picker-container">
        <h3 class="type-picker-description">Select the type of database you want to create:</h3>
        <div class="type-picker">
          <div @click="emit('next', true)">
            <img src="@/assets/wizard/templates.svg" alt="Select a template" />
            <h4>Select a template</h4>
          </div>
          <div @click="emit('next', false)">
            <img src="@/assets/wizard/build-your-own.svg" alt="Build your own" />
            <h4>Build your own</h4>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>

<style lang="scss" scoped>
.title {
  margin-bottom: 1rem;
}

.type-picker-container {
  .type-picker-description {
    margin-bottom: 1rem;
  }

  .type-picker {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    > div {
      border: 1px solid var(--color-dark-eigengrau-eigengrau-100);
      padding: 1rem;
      border-radius: 0.5rem;
      cursor: pointer;

      &:hover {
        background: var(--color-dark-gray-gray-80);
      }

      > img {
        width: 160px;
        height: 160px;
      }

      > h4 {
        text-align: center;
      }
    }
  }
}
</style>
