<template>
  <div controls-section>
    <div class="sticky top-0 cursor-pointer flex justify-start border-b border-gray transition-all duration-400 z-3" :class="props.active ? 'items-start' : 'items-center'" @click="activate(id)">
      <div v-if="id" class="border-r border-gray flex font-bold px-8 leading-none min-w-[130px] transition-all duration-400" v-text="zeroPad(id, 2)" :class="props.active ? 'bg-yellow text-white text-6xl py-4' : 'bg-light-gray text-dark-gray text-[40px] py-3'"/>
      <div v-if="name" class="bg-white py-4 px-8 transition-all duration-400 self-stretch w-full" :class="props.active ? 'text-3xl' : 'text-m'" v-text="name"/>
    </div>
    <div v-if="active" class="border-b border-gray p-6">
      <div v-if="description" v-html="description" />
      <slot/>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { zeroPad } from '../../utils/zeroPad'

const props = defineProps(['id', 'name', 'description', 'active'])
const emits = defineEmits(['activate'])
const activate = (id) => {
  emits('activate', id)
}
</script>