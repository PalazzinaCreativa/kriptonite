<template>
  <label :for="props.name" class="relative group w-full">
    <div class="flex items-center gap-2">
      <input type="checkbox" v-model="inputValue" :name="props.name" :readonly="props.readonly" :disabled="props.disabled" :required="required" class="border border-dark-gray rounded-lg text-current px-4 py-3 focus:border-yellow focus:outline-none" :class="error ? 'ring-1 ring-red' : ''" @update:modelValue="emitValue($event)"/>
      <span v-if="props.label" label v-html="props.label" :class="error ? 'text-red font-bold' : ''" @click="focusOnInput($event)"/>
    </div>
    <span v-if="error && errorMessage" class="inline-block text-xxs text-red mt-2 leading-4 w-full" v-text="errorMessage" />
  </label>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue';
const props = defineProps(['label', 'name', 'modelValue', 'append', 'readonly', 'disabled', 'required', 'error'])
const emits = defineEmits(['update:modelValue'])
const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    return newValue
  }
})
const focusOnInput = (event) => {
  if(event.target.nextElementSibling) {
    event.target.nextElementSibling.focus()
  } else {
    event.target.previousElementSibling.focus()
  }
}
const emitValue = (value) => emits('update:modelValue', value)

const errorMessage = computed(() => props.error?.message)
</script>