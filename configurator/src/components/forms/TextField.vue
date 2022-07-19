<template>
  <label :for="name" class="h-full relative group">
    <span v-if="label" label v-text="label" class="absolute flex items-center left-4 transform transition-all duration-300 px-1 group-focus-within:bg-white group-focus-within:text-xxs group-focus-within:-translate-y-1/2 group-focus-within:h-auto z-2" :class="[inputValue ? 'bg-white text-xxs -translate-y-1/2 h-auto' : error ? 'h-auto translate-y-1/2' : 'h-full', error ? 'text-red font-bold h-auto' : '']" @click="focusOnInput($event)"/>
    <input type="text" v-model="inputValue" :name="name" :readonly="readonly" :disabled="disabled" class="border border-dark-gray rounded-lg text-current px-4 py-3 focus:border-yellow focus:outline-none w-full" :class="error ? 'border-red' : ''" @update:modelValue="emitValue($event)"/>
    <span v-if="append" append v-text="append" class="absolute bg-white right-4 top-1/2 inline-block flex pl-4 transform -translate-y-1/2 items-center" @click="focusOnInput($event)"/>
    <span v-if="error && errorMessage" class="inline-block text-xxs text-red mt-2 leading-4" v-text="errorMessage" />
  </label>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps(['label', 'name', 'modelValue', 'append', 'readonly', 'disabled', 'error'])
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

const errorMessage = computed(() => 'Questo campo è obbligatorio, se è stato compilato per favore controlla il suo contenuto.') //props.error?.message
</script>