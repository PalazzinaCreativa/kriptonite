<template>
  <div class="flex w-full my-4 text-m" v-if="props.option.showIf.includes(props.config.room.type)">
    <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold min-w-[150px]" v-text="props.option.label"/>
    <input class="bg-white/40 px-6 w-full focus:outline-none" :type="props.option.type" :value="props.config.room.dimensions[props.option.model]" :step="props.option.step" :max="props.option.max" :placeholder="props.option.placeholder" @input="emitValue($event)"/>
  </div>
</template>

<script>
import { defineProps, defineEmits } from 'vue'

export default {
  props: ['modelValue', 'option', 'config'],

  setup(props) {
    const emits = ['update:modelValue']
    const emitValue = (event) => { emit('update:modelValue', event.target.value) }
    return { props, emitValue }
  }
}

</script>