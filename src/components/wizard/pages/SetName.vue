<script setup lang="ts">
import { useTimeout } from '@vueuse/core'
import { ref } from 'vue'

import Page from './generic/Page.vue'

import TextField from '@/components/form/TextField.vue'
import Button from '@/components/common/Button.vue'

const emit = defineEmits<{
  (event: 'next', databaseName: string): void
}>()

const isNameInputVisible = useTimeout(600)

const databaseName = ref('')

const submit = () => {
  emit('next', databaseName.value ?? '')
}
</script>

<template>
  <Page :isBodyHidden="!isNameInputVisible" :isFooterHidden="databaseName === ''">
    <template #header>
      <h1 class="title">What's the name of your database?</h1>
    </template>
    <template #body>
      <TextField v-model="databaseName" placeholder="ReallyCoolDatabase" @keydown.enter="submit" />
    </template>
    <template #footer>
      <div class="footer">
        <div class="spacer" />
        <Button @click="submit">Next</Button>
      </div>
    </template>
  </Page>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;

  .spacer {
    flex-grow: 1;
  }
}
</style>
