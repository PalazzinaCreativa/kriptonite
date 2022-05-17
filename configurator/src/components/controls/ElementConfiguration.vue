<template>
  <div v-if="element.config" class="absolute bg-white h-full w-full z-4">
    <div class="bg-light-gray flex items-center justify-between py-4 px-6">
      <div v-if="element.config.name" v-text="element.config.name" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div class="py-4 px-6">
      <img :src="element.config.image.url" :width="element.config.image.width" :height="element.config.image.height" :alt="element.config.image.alternativeText" class="w-[200px] h-full object-cover m-auto my-4" />
      <div v-if="elementSettingsInstance">
        <component :is="elementSettingsInstance" :element="element"></component>
      </div>
      <div v-if="materials">
        Materiali
        <div class="flex flex-wrap my-4">
          <div v-for="material of materials" :key="material.id" class="m-4 cursor-pointer group"  @click="setMaterial(material)">
            <div class="w-12 h-12 shadow-lg group-hover:shadow-xl" :class="{ 'shadow-xl': element.config.material.id === material.id }" :style="{ backgroundColor: material.color }"></div>
            <div class="mt-2">{{ material.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4" @click="addToAll">Aggiungi a tutti</div>
    <div class="mt-8" @click="destroy">Elimina elemento</div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { capitalize } from '../../utils/capitalize'
import Close from '@/components/icons/Close.vue'
import { obstaclesData } from '@/dataset/obstaclesData'
import { shelvesData } from '@/dataset/shelvesData'
import { uprightsData } from '@/dataset/uprightsData'
import { useConfiguratorStore } from '../../stores/configurator';

const props = defineProps(['element'])
const emit = defineEmits(['close'])
const configurator = useConfiguratorStore()

const elementSettingsInstance = computed(() => defineAsyncComponent(() => import(`./${capitalize(props.element.config.type)}Settings.vue`)))

const data = {
  obstacle: obstaclesData,
  upright: uprightsData,
  shelf: shelvesData
}

const materials = ref(data[props.element.config.type][0].materials)

const obstacleDimensions = ref({
  width: props.element.getSize().width,
  height: props.element.getSize().height,
  depth: props.element.getSize().depth
})

const setMaterial = (material) => {
  props.element.setMaterial(material)
  configurator.updateConfig()
}

const addToAll = () => {
  const material = materials.value.find(m => m.id === props.element.config.material.id)
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