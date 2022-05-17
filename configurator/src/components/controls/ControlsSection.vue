<template>
  <div controls-section @click="activate(id)">
    <div class="cursor-pointer flex items-start justify-start border-b border-gray">
      <div v-if="id" class="border-r border-gray text-6xl font-bold py-4 px-8" v-text="zeroPad(id, 2)" :class="props.active ? 'bg-yellow text-white' : 'bg-light-gray text-dark-gray'"/>
      <div v-if="name" class="text-3xl py-4 px-8" v-text="name"/>
    </div>
    <div v-if="active" class="border-b border-gray p-6">
      <div v-if="description" v-html="description" />
      <slot/>
    </div>
  </div>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps(['id', 'name', 'description', 'active'])
const emits = defineEmits(['activate'])
const zeroPad = (num, places) => String(num).padStart(places, '0')
const activate = (id) => {
  emits('activate', id)
}
</script>