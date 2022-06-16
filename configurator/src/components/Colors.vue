<template>
  <div colors v-if="colors.length" class="mt-12">
    <div class="uppercase text-center w-full">Finitura</div>
    <div class="flex flex-wrap justify-center gap-4 my-8 w-full">
      <div v-for="color in colors" :key="`color-${color.id}`" class="flex flex-col items-center cursor-pointer max-w-[100px]" @click="setMaterial(color)">
        <div class="border-2 w-14 h-14 rounded-full" :class="materialColor?.id === color.id ? 'border-2 border-yellow' : 'border-dark-gray'" :style="`background-color: ${color.code}`"></div>
        <span class="inline-block text-center mt-3" v-text="color.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import useColorsStore from '@/stores/colors';

const colorsModule = useColorsStore()
const colors = computed(() => colorsModule.index)
const selectedColor = computed(() => colorsModule.selected)

const props = defineProps(['element'])
const emits = defineEmits(['setColor'])

const materialColor = computed(() => props.element?.config?.material)

const setMaterial = (material) => {
  // Mappo le proprietà del colore nell'oggetto nuovo
  material = { ...materialColor.value, ...material, color: material.code }
  colorsModule.setSelectedColor(material)
  emits('setColor', material)
}

if(colors.value && colors.value.length) {
  // Se non ho già impostato un colore
  if(typeof materialColor.value?.id === "undefined") {
    // Se ho già dato un colore ad un altro elemento in precedenza
    if(Object.keys(selectedColor.value).length) {
      setMaterial(selectedColor.value)
    } else {
      // imposto il colore definita a database
      if(materialColor.value.color) {
        let startingColor = colors.value.find((color) => materialColor.value.color === color.code)
        if(startingColor) {
          setMaterial(startingColor)
          // imposto il primo delle scelte dei colori
        } else {
          setMaterial(colors.value[0])
        }
      }
    }
  } else {
    // altrimenti imposto quello già assegnato al modello in precedenza
    setMaterial(materialColor.value)
  }
} 
</script>
