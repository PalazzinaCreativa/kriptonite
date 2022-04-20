<script setup>
import { obstaclesData } from '@/dataset/obstaclesData'
import { shelvesData } from '@/dataset/shelvesData'
import { uprightsData } from '@/dataset/uprightsData'
import { onMounted, ref } from 'vue';

const props = defineProps(['element'])

const data = {
  obstacle: obstaclesData,
  upright: uprightsData,
  shelf: shelvesData
}

const materials = ref(data[props.element.type][0].materials)

const handleClick = (material) => {
  props.element.setMaterial(material)
}
</script>

<template>
  <div class="absolute w-full z-20 bg-white h-full p-5">
    Materiali
    <div class="flex flex-wrap my-4">
      <div v-for="material of materials" :key="material.id" class="mx-2" @click="handleClick(material)">
        <div class="w-12 h-12" :style="{ backgroundColor: material.color }"></div>
        <div class="mt-2">{{ material.name }}</div>
      </div>
    </div>
  </div>
</template>