<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  placeholder?: string
  modelValue: string | null
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const data = useVModel(props, 'modelValue', emit)

const inputElement = ref<HTMLInputElement | null>(null)

const isFocused = ref(false)

const focusInput = () => {
  inputElement.value?.focus()
}

const onInputFocus = () => {
  isFocused.value = true
}

const onInputBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div class="text-field" :class="{ focus: isFocused }" @click="focusInput">
    <input
      ref="inputElement"
      v-model="data"
      :placeholder="props.placeholder"
      type="text"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @click.stop
    />
  </div>
</template>

<style lang="scss" scoped>
.text-field {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
  height: 56px;
  border-radius: 0.25rem;
  border: 1.5px solid var(--color-dark-eigengrau-eigengrau-100);
  cursor: text;

  &.focus {
    border-color: var(--color-dark-purple-purple-100);
  }

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
    line-height: 18px;
  }
}
</style>
