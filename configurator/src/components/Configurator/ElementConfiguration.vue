<script setup>
import { obstaclesData } from '@/dataset/obstaclesData'
import { shelvesData } from '@/dataset/shelvesData'
import { uprightsData } from '@/dataset/uprightsData'
import { reactive } from 'vue';

defineProps({
  element: {
    type: Object,
    required: true
  }
})

const data = {
  obstacle: obstaclesData,
  upright: uprightsData,
  shelf: shelvesData
}

const materials = reactive(data[element.type].materials)
</script>

<template>
  <div class="absolute w-full z-20 bg-white h-full p-5">
    Materiali
    <div class="flex my-4">
      <div v-for="material of materials" :key="material.id" class="mx-2">
        <div class="w-12 h-12" :style="{ backgroundColor: material.color }"></div>
        <div class="mt-2">{{ material.name }}</div>
      </div>
    </div>
  </div>
</template>