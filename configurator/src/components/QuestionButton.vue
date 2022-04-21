<script setup>
import { ref, onMounted } from 'vue'

const button = ref(null)
const orderValue = ref(null)

onMounted(() => {
  const index = Array.from(button.value.parentNode.children).indexOf(button.value)
  orderValue.value = index === 0 ? 'A' : index === 1 ? 'B' : index === 2 ? 'C' : 'D'
})
</script>

<template>
  <div class="w-full bg-white/40 group relative my-4 cursor-pointer" ref="button">
    <div class="h-full w-full absolute bg-white transform scale-x-0 left-0 top-0 origin-right group-hover:origin-left group-hover:scale-x-100 transition-transform duration-1200 ease-power-out"></div>
    <div class="absolute left-0 top-0 w-1 bg-white h-full"></div>
    <div class="flex relative py-4 pl-6 text-m">
      <div class="text-black/40" v-if="orderValue">{{ orderValue }}</div>
      <div class="ml-8 text-black"><slot /></div>
    </div>
  </div>
</template>