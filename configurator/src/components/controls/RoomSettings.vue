<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full">
    <div configuration-header class="bg-light-gray flex items-center justify-between py-4 px-6 w-full">
      <div v-text="title" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div configuration-content class="grow w-full">
      <Textures class="mt-8" title="Pavimento" :key="`${JSON.stringify(element)}`" :element="element" entity="room" @setTexture="setMaterial"/>
      <div class="mt-8 px-6">
        <SetWallColor @changeColor="color => $emit('changeColor', color)" />
      </div>
      <!-- <div class="flex items-center justify-center">
        <span v-if="element.config.material" class="bg-black cursor-pointer hover:bg-opacity-80 text-white px-6 py-2 rounded-full mt-4 mx-auto inline-block" @click="addToAll">Applica finitura a tutti</span>
      </div> -->
    </div>
    <!-- <div configuration-actions class="flex w-full">
      <Btn class="bg-light-gray" label="Elimina elemento" @click="destroy" />
      <Btn class="bg-yellow" label="Aggiorna elemento" @click="addElement" />
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useConfiguratorStore } from '@/stores/configurator'
import { capitalize } from '@/utils/capitalize'
import useTexturesStore from '@/stores/textures';

import SetWallColor from '@/components/controls/SetWallColor.vue'
import Textures from '@/components/Textures.vue'

import Close from '@/components/icons/Close.vue'
import Btn from '@/components/forms/Button.vue'

const texturesModule = useTexturesStore()
texturesModule.getRoomTextures()

const props = defineProps(['element'])
const emits = defineEmits(['close'])
const title = ref('Opzioni stanza')

const configurator = useConfiguratorStore()

//const elementSettingsInstance = computed(markRaw(() => defineAsyncComponent(() => import(`./${capitalize(props.element.config.type)}Settings.vue`))))

const setMaterial = (material) => {
  //props.element.setMaterial(material)
  configurator.changeFloor(material)
  configurator.updateConfig()
}

const close = () => {
  emits('close')
}

/* const addElement = () => {
  props.element.setSize(props.element.config)
  emits('close')
} */

/* const destroy = () => {
  props.element.destroy()
  close()
} */
</script>
<style>
.hu-color-picker canvas {
  max-width: 100%;
}
</style>