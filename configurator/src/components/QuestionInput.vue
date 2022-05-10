<template>
  <div class="flex w-full my-4 text-m">
    <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold" v-text="option.label"/>
    <input class="flex-1 bg-white/40 px-6" :type="option.type" :value="config.room.dimensions.width" :step="option.step" :max="option.max" :placeholder="option.placeholder" @input="emitValue($event)"/>
  </div>
</template>

<script setup>
defineEmits(['update:modelValue'])
const props = defineProps(['modelValue', 'option', 'config'])
const emitValue = (event) => { $emit('update:modelValue', event.target.value) }
</script>