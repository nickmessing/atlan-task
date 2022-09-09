<script setup lang="ts">
import { onClickOutside, useVModel } from '@vueuse/core'
import { computed, ref } from 'vue'
import IconChevronDown from '../icons/IconChevronDown.vue'

export type AutocompleteOption = {
  label: string
  value: string
}

const props = defineProps<{
  placeholder?: string
  modelValue: string | null
  options: AutocompleteOption[]
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
const data = useVModel(props, 'modelValue', emit)

const rootElement = ref<HTMLDivElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)

const searchString = ref(props.placeholder ?? 'No selection')
const isFocused = ref(false)

const filteredOptions = computed(() => {
  if (!searchString.value) {
    return props.options
  }

  return props.options.filter(option => option.label.toLowerCase().includes(searchString.value.toLowerCase()))
})

onClickOutside(rootElement, () => {
  isFocused.value = false

  const currentSelection = props.options.find(option => option.value === data.value)
  searchString.value = currentSelection?.label ?? props.placeholder ?? 'No selection'
})

const focusInput = () => {
  inputElement.value?.focus()
}

const onInputFocus = () => {
  isFocused.value = true
  searchString.value = ''
}

const selectOption = (option: AutocompleteOption) => {
  data.value = option.value
  searchString.value = option.label
  isFocused.value = false
}
</script>

<template>
  <div ref="rootElement" class="autocomplete">
    <div class="autocomplete-input" :class="{ focus: isFocused }" @click="focusInput">
      <input ref="inputElement" v-model="searchString" type="text" @focus="onInputFocus" @click.stop />
      <div class="autocomplete-input-icon">
        <IconChevronDown />
      </div>
    </div>
    <div v-if="isFocused" class="autocomplete-options">
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        class="autocomplete-options-option"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.autocomplete {
  position: relative;

  .autocomplete-input {
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

    .autocomplete-input-icon {
      margin-left: 0.5rem;
      height: 24px;
    }
  }

  .autocomplete-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    margin-top: 0.25rem;
    padding: 0.5rem 0;
    border-radius: 0.25rem;
    border: 1px solid var(--color-dark-gray-gray-80);
    max-height: 200px;
    overflow: auto;
    background: var(--color-dark-gray-gray-100);

    .autocomplete-options-option {
      padding: 0 2rem;
      cursor: pointer;
      line-height: 56px;

      &:hover {
        background: var(--color-dark-gray-gray-60);
      }
    }
  }
}
</style>
