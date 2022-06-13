<template>
  <div class="flex w-full my-4 text-m" v-if="isVisible">
    <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold min-w-[150px]" v-text="option.label"/>
    <input class="bg-white/40 px-6 w-full focus:outline-none" :type="option.type" v-model="inputValue" :value="value" :step="option.step" :min="option.min" :max="option.max" :placeholder="option.placeholder" @input="emitValue($event)" @blur="validate"/>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import lget from 'lodash.get'

const props = defineProps(['value', 'option', 'config'])
const emits = defineEmits(['input'])

const inputValue = ref(props.value)

const validate = () => {
  if(props.option.min) {
    inputValue.value = parseInt(inputValue.value) < parseInt(props.option.min) ? props.option.min : inputValue.value
  }
  if(props.option.max) {
    inputValue.value = parseInt(inputValue.value) > parseInt(props.option.max) ? props.option.max : inputValue.value
  }
  emits('input', inputValue.value)
}

const emitValue = (event) => {
  emits('input', inputValue.value)
}

const isVisible = computed(() => {
  return !props.option.showIf || props.option.showIf.values.includes(lget(props.config, props.option.showIf.entity))
})
</script>