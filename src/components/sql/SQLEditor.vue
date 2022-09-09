<script setup lang="ts">
// Editor
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism-okaidia.css'

import { useDebounceFn, useVModel } from '@vueuse/core'

import Button from '@/components/common/Button.vue'

const props = defineProps<{
  modelValue: string
  errorMessage?: string
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'execute', value: string): void
}>()

const vModel = useVModel(props, 'modelValue', emit)

const isMac = navigator.platform.startsWith('Mac')

const highlighter = (code: string) => highlight(code, languages.sql, 'sql')
const exec = useDebounceFn(() => {
  emit('execute', vModel.value)
}, 50)
</script>

<template>
  <div class="sql-editor">
    <PrismEditor
      class="editor"
      v-model="vModel"
      :highlight="highlighter"
      line-numbers
      @keydown.ctrl.enter.prevent="exec"
      @keydown.meta.enter.prevent="exec"
    />
    <div class="footer">
      <div class="error-message" v-if="props.errorMessage">{{ props.errorMessage }}</div>
      <div class="spacer" v-else />
      <Button @click="exec">Execute ({{ isMac ? 'Cmd' : 'Ctrl' }} + Enter)</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sql-editor {
  display: flex;
  flex-direction: column;

  .editor {
    flex-grow: 1;
  }

  .footer {
    display: flex;
    padding: 1rem;
    border-top: 1px solid var(--color-dark-gray-gray-100);
    flex-basis: 1rem;

    .error-message {
      flex: 1 0;
      display: flex;
      align-items: center;
      background: var(--color-dark-red-red-100);
      margin-right: 1rem;
      padding: 0 1rem;
      overflow: auto;
      border-radius: 0.25rem;
      min-width: 0;
      min-height: 0;
      font-size: 12px;
    }

    .spacer {
      flex-grow: 1;
    }
  }
}
</style>
