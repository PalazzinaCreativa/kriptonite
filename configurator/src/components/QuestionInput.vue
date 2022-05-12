<template>
  <div class="flex w-full my-4 text-m" v-if="props.option.showIf.includes(props.config.room.type)">
    <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold min-w-[150px]" v-text="props.option.label"/>
    <input class="bg-white/40 px-6 w-full focus:outline-none" :type="props.option.type" :value="value" :step="props.option.step" :max="props.option.max" :placeholder="props.option.placeholder" @input="emitValue($event)"/>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['value', 'option', 'config'])
const emits = defineEmits(['update:model-value'])
const emitValue = (event) => { emits('update:model-value', event.target.value) }
</script>