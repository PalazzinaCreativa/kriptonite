<template>
  <button role="button" class="border border-gray hover:border-black flex items-center gap-2 rounded-full py-1.5 px-3.5 transition" :class="isSelected ? 'bg-black text-white' : 'bg-white text-black'">
    <component v-if="icon" :is="icon" :class="isSelected ? 'text-white' : 'text-black'" />
    <slot/>
  </button>
</template>
<script setup>
import { computed, markRaw, defineAsyncComponent } from 'vue';
import { capitalize } from '@/utils/capitalize'
const icon = props.icon ? computed(markRaw(() => defineAsyncComponent(() => import(/* @vite-ignore */`./icons/${capitalize(props.icon)}.vue`)))) : null

const props = defineProps({
    isSelected: {
        default: false,
        type: Boolean
    },
    icon: {
        default: '',
        type: String
    }
})
</script>