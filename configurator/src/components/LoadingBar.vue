<template>
  <div progress-bar class="relative flex items-end h-1.5 w-full">
    <div progress class="absolute bg-yellow h-full left-0 top-0" :style="`width: ${progress}%`"></div>
    <div class="bg-gray h-0.5 w-full"></div>
  </div>
</template>
<script setup>
  import { computed, defineProps } from 'vue'

  const props = defineProps(['value', 'total'])
  const progress = computed(() => { return (props.value / props.total) * 100 })
</script>