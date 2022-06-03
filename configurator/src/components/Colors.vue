<template>
  <div colors v-if="colors.length" class="mt-12">
    <div class="uppercase text-center w-full">Finitura</div>
    <div class="flex flex-wrap justify-center gap-4 my-8 w-full">
      <div v-for="color in colors" :key="`color-${color.id}`" class="flex flex-col items-center cursor-pointer max-w-[100px]" @click="setMaterial(color)">
        <div class="border-2 w-14 h-14 rounded-full" :class="selectedColor && selectedColor.id === color.id ? 'border-2 border-yellow' : 'border-dark-gray'" :style="`background-color: ${color.code}`"></div>
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

const setMaterial = (material) => {
  let elementMaterial = props.element.config.material
  // Mappo le proprietà del colore nell'oggetto nuovo
  material = { ...elementMaterial, ...material, color: material.code }
  colorsModule.setSelectedColor(material)
  emits('setColor', material)
}

if(colors.value && colors.value.length) {
  // Se non ho già impostato un colore
  if(typeof props.element.config?.material?.id === "undefined") {
    // Se ho già dato un colore ad un altro elemento in precedenza
    if(Object.keys(selectedColor.value).length) {
      //console.log('si ho un colore selezionato')
      setMaterial(selectedColor.value)
    } else {
      //console.log('non ho un colore selezionato')
      // imposto il primo delle scelte dei colori
      setMaterial(colors.value[0])
    }
  } else {
    // altrimenti imposto quello già assegnato al modello in precedenza
    let assignedColor = colors.value.find((color) => props.element.config.material.id === color.id)
    colorsModule.setSelectedColor(assignedColor)
  }
} 
</script>
