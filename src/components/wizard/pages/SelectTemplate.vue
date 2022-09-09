<script setup lang="ts">
import { useTimeout } from '@vueuse/core'
import { computed, ref } from 'vue'

import { templates } from '@/db'

import Autocomplete from '@/components/form/Autocomplete.vue'
import Button from '@/components/common/Button.vue'

import type { AutocompleteOption } from '@/components/form/Autocomplete.vue'
import Page from './generic/Page.vue'

const emit = defineEmits<{
  (event: 'next', templateId: string): void
}>()

const isTemplatePickerVisible = useTimeout(600)

const options = computed<AutocompleteOption[]>(() =>
  templates.map(template => ({
    label: template.name,
    value: template.id,
  })),
)

const selectedTemplateId = ref(null)
const selectedTemplate = computed(() => templates.find(template => template.id === selectedTemplateId.value))
</script>

<template>
  <Page :isFooterHidden="!selectedTemplate">
    <template #header>
      <h1 class="title">Find a template that fits your needs</h1>
    </template>
    <template #body>
      <Transition name="wizard-slide-fade">
        <div v-if="isTemplatePickerVisible">
          <Autocomplete v-model="selectedTemplateId" :options="options" />
        </div>
      </Transition>
      <Transition name="wizard-slide-fade" mode="out-in">
        <h3 v-if="selectedTemplate" :key="selectedTemplate.description" class="selected-template-description">
          {{ selectedTemplate.description }}
        </h3>
      </Transition>
    </template>
    <template #footer>
      <div class="footer">
        <div class="spacer" />
        <Button @click="emit('next', selectedTemplateId ?? '')">Next</Button>
      </div>
    </template>
  </Page>
</template>

<style lang="scss" scoped>
.title {
  margin-bottom: 1rem;
}

.selected-template-description {
  margin-top: 2rem;
}

.footer {
  display: flex;

  .spacer {
    flex-grow: 1;
  }
}
</style>
