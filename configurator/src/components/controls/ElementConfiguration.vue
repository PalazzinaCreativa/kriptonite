<template>
  <div v-if="element.config" class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full z-5">
    <div configuration-header class="bg-light-gray flex items-center justify-between py-4 px-6 w-full">
      <div v-if="element.config.name" v-text="element.config.name" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div configuration-content class="grow h-full w-full">
      <div class="py-4 px-6">
        <img v-if="element.config.image" :src="element.config.image.url" :width="element.config.image.width" :height="element.config.image.height" :alt="element.config.image.alternativeText" class="w-[200px] h-full object-cover m-auto my-4" />
        <div v-if="elementSettingsInstance">
          <div class="flex flex-wrap my-4 w-full">
            <component :is="elementSettingsInstance" :element="element"></component>
          </div>
        </div>
        <div v-if="textures || materials" class="my-4">
          <div class="uppercase text-center w-full">Finitura</div>
          <div class="flex flex-wrap justify-center gap-12 my-4">
            <div v-for="texture in textures" :key="`texture-${texture.id}`" class="flex flex-wrap justify-center cursor-pointer"  @click="setMaterial(texture)">
              <div class="border-2 w-14 h-14 rounded-full" :class="element.config.material.id === texture.id ? 'border-2 border-yellow' : 'border-dark-gray'" :style="`background: url('${texture.thumb}') center center / cover`"></div>
              <div class="text-center mt-3 w-full">{{ texture.name }}</div>
            </div>
            <!-- <div v-for="material of materials" :key="material.id" class="m-4 cursor-pointer group"  @click="setMaterial(material)">
              <div class="w-12 h-12 shadow-lg group-hover:shadow-xl" :class="{ 'shadow-xl': element.config.material.id === material.id }" :style="{ backgroundColor: material.color }"></div>
              <div class="mt-2">{{ material.name }}</div>
            </div> -->
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <span v-if="element.config.material" class="bg-black cursor-pointer hover:bg-opacity-80 text-white px-6 py-2 rounded-full mt-4 mx-auto inline-block" @click="addToAll">Applica finitura a tutti</span>
      </div>
    </div>
    <div configuration-actions class="flex w-full">
      <Btn class="bg-light-gray" label="Elimina elemento" @click="destroy" />
      <Btn class="bg-yellow" label="Aggiorna elemento" @click="addElement" />
    </div>
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
import useTexturesStore from '../../stores/textures';
import Btn from '@/components/forms/Button.vue'

const props = defineProps(['element'])
const emits = defineEmits(['close'])
const configurator = useConfiguratorStore()
const texturesModule = useTexturesStore()

const elementSettingsInstance = computed(() => defineAsyncComponent(() => import(`./${capitalize(props.element.config.type)}Settings.vue`)))

const textures = texturesModule.index

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
  emits('close')
}

const addElement = () => {
  props.element.setSize(props.element.config)
  emits('close')
}

const destroy = () => {
  props.element.destroy()
  close()
}
</script>