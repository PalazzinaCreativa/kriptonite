<template>
  <label :for="props.name" class="relative group w-full">
    <span label v-if="props.label" v-text="props.label" class="absolute flex items-center left-4 transform transition-all duration-300 px-1 group-focus-within:bg-white group-focus-within:text-xxs group-focus-within:-translate-y-1/2 group-focus-within:h-auto z-2" :class="inputValue ? 'bg-white text-xxs -translate-y-1/2 h-auto' : 'h-full'" @click="focusOnInput($event)"/>
    <input type="number" v-model="inputValue" :name="props.name" class="border bg-white read-only:text-dark-gray border-dark-gray rounded-lg text-black px-4 py-3 w-full focus:border-yellow focus:outline-none w-full" :readonly="readonly" :disabled="disabled" @update:modelValue="emitValue($event)"/>
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