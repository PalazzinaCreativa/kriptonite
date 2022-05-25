<template>
  <div colors v-if="colors.length" class="my-12">
    <div class="uppercase text-center w-full">Finitura</div>
    <div class="flex flex-wrap justify-center gap-12 my-8 w-full">
      <div v-for="color in colors" :key="`color-${color.id}`" class="flex flex-col items-center cursor-pointer max-w-[100px]" @click="setMaterial(color)">
        <div class="border-2 w-14 h-14 rounded-full" :class="selectedColor && selectedColor.id === color.id ? 'border-2 border-yellow' : 'border-dark-gray'" :style="`background-color: ${color.code}`"></div>
        <span class="inline-block text-center mt-3" v-text="color.name" />
      </div>
    </div>
  </div>
  <!-- <div v-for="material of materials" :key="material.id" class="m-4 cursor-pointer group"  @click="setMaterial(material)">
      <div class="w-12 h-12 shadow-lg group-hover:shadow-xl" :class="{ 'shadow-xl': element.config.material.id === material.id }" :style="{ backgroundColor: material.color }"></div>
      <div class="mt-2">{{ material.name }}</div>
    </div> -->
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import useColorsStore from '@/stores/colors';

const colorsModule = useColorsStore()
colorsModule.getColors()
const colors = computed(() => colorsModule.index)
const selectedColor = computed(() => colorsModule.selected)

const props = defineProps(['element'])
const emits = defineEmits(['setColor'])

const setMaterial = (material) => {
  // Mappo le proprietà del colore nell'oggetto nuovo
  material = { ...material, color: material.code }
  colorsModule.setSelectedColor(material)
  emits('setColor', material)
}

if(props.element.config.color && colors.length) {
  let startingColor = colors.find((color) => {
    return props.element.config.color === color.id
  })
  setMaterial(startingColor)
}
</script>
