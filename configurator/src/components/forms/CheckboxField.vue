<template>
  <label :for="props.name" class="relative group">
    <span v-if="props.label" label v-text="props.label" class="absolute flex items-center inline-block left-4 transform transition-all duration-300 px-1 group-focus-within:bg-white group-focus-within:text-xxs group-focus-within:-translate-y-1/2 group-focus-within:h-auto z-2" :class="inputValue ? 'bg-white text-xxs -translate-y-1/2 h-auto' : 'h-full'" @click="focusOnInput($event)"/>
    <input type="checkbox" v-model="inputValue" :name="props.name" :readonly="props.readonly" :disabled="props.disabled" class="border border-dark-gray rounded-lg text-current px-4 py-3 focus:border-yellow focus:outline-none" @update:modelValue="emitValue($event)"/>
    <span v-if="props.append" append v-text="props.append" class="absolute bg-white right-4 top-1/2 inline-block flex pl-4 transform -translate-y-1/2 items-center" @click="focusOnInput($event)"/>
  </label>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue';
const props = defineProps(['label', 'name', 'modelValue', 'append', 'readonly', 'disabled'])
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
</script>