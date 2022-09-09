<script setup lang="ts">
import { templates, useRootDatabase } from '@/db'
import { ref } from 'vue'

import Initialization from './pages/Initialization.vue'
import SelectTemplate from './pages/SelectTemplate.vue'
import SetName from './pages/SetName.vue'
import Loading from './pages/Loading.vue'

const emit = defineEmits<{
  (event: 'finish'): void
}>()

enum Steps {
  Initialization,
  SelectTemplate,
  SetName,
  Loading,
}

const currentStep = ref(Steps.Initialization)
const selectedTemplate = ref('')
const databaseName = ref('')
const progress = ref(0)

const { createDatabase } = useRootDatabase()

const triggerDatabaseCreation = async () => {
  currentStep.value = Steps.Loading
  const template = templates.find(template => template.id === selectedTemplate.value)
  const promise = createDatabase(databaseName.value, template)
  promise.onProgressChange(p => {
    progress.value = p
  })
  await promise
  emit('finish')
}

const nextFromInitialization = (withTemplate: boolean) => {
  currentStep.value = withTemplate ? Steps.SelectTemplate : Steps.SetName
}
const nextFromSelectTemplate = (templateId: string) => {
  selectedTemplate.value = templateId
  currentStep.value = Steps.SetName
}
const nextFromSetName = (name: string) => {
  databaseName.value = name
  triggerDatabaseCreation()
}
</script>

<template>
  <div class="wizard">
    <div class="wizard-box">
      <Transition name="wizard-slide-fade" mode="out-in">
        <Initialization v-if="currentStep === Steps.Initialization" @next="nextFromInitialization" />
        <SelectTemplate v-else-if="currentStep === Steps.SelectTemplate" @next="nextFromSelectTemplate" />
        <SetName v-else-if="currentStep === Steps.SetName" @next="nextFromSetName" />
        <Loading v-else-if="currentStep === Steps.Loading" :progress="progress" />
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wizard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .wizard-box {
    background: var(--color-dark-gray-gray-100);
    padding: 2rem;
    border-radius: 0.5rem;
    width: 620px;
    height: 460px;
  }
}
</style>
