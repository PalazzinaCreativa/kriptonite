<script setup>
import { obstaclesData } from '@/dataset/obstaclesData'
import { shelvesData } from '@/dataset/shelvesData'
import { uprightsData } from '@/dataset/uprightsData'
import { ref } from 'vue';
import { useConfiguratorStore } from '../../stores/configurator';

const props = defineProps(['element'])
const emit = defineEmits(['close'])
const configurator = useConfiguratorStore()

const data = {
  obstacle: obstaclesData,
  upright: uprightsData,
  shelf: shelvesData
}

const materials = ref(data[props.element.config.type][0].materials)

const setMaterial = (material) => {
  props.element.setMaterial(material)
  configurator.updateConfig()
}

const addToAll = () => {
  const material = materials.value.find(m => m.id === props.element.material)
  props.element.setSiblingsMaterial(material)
  configurator.updateConfig()
}

const close = () => {
  configurator.removeSelection()
  emit('close')
}

const destroy = () => {
  props.element.destroy()
  close()
}
</script>

<template>
  <div class="absolute w-full z-20 bg-white h-full p-5">
    <div class="mb-16" @click="close">Chiudi</div>
    Materiali
    <div class="flex flex-wrap my-4">
      <div v-for="material of materials" :key="material.id" class="m-4 cursor-pointer group"  @click="setMaterial(material)">
        <div class="w-12 h-12 shadow-lg group-hover:shadow-xl" :class="{ 'shadow-xl': element.config.material.id === material.id }" :style="{ backgroundColor: material.color }"></div>
        <div class="mt-2">{{ material.name }}</div>
      </div>
    </div>

    <div class="mt-4" @click="addToAll">Aggiungi a tutti</div>
    <div class="mt-8" @click="destroy">Elimina elemento</div>
  </div>
</template>