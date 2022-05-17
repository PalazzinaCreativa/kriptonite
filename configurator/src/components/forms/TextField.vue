<template>
  <label :for="props.name" class="relative group">
    <span label v-text="props.label" class="absolute flex items-center left-4 h-full transform transition-all duration-300 px-1 group-focus-within:text-xxs group-focus-within:-translate-y-1/2 group-focus-within:h-auto z-2" :class="props.value ? 'text-xxs -translate-y-1/2 h-auto' : ''"/>
    <input type="text" v-model="props.value" :name="props.name" class="border border-dark-gray rounded-lg text-black px-4 py-3 focus:border-yellow focus:outline-none"/>
    <span placeholder v-text="props.placeholder" class="absolute right-0 inline-block h-full flex items-center" />
  </label>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps(['label', 'name', 'value' ])
</script>
<style scoped>
[label] {
  box-shadow: inset 0 0 rgba(255, 255, 255, 1);
}
label:focus-within >[label] {
  box-shadow: inset 0 14px rgba(255, 255, 255, 1);
}
</style>