<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full">
    <div configuration-header class="bg-light-gray flex items-center justify-between py-4 px-6 w-full">
      <div v-text="title" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div configuration-content class="grow px-6 w-full">
      <Textures class="mt-8" title="Pavimento" :element="element" entity="room" @setTexture="setMaterial"/>
      <div class="mt-8 px-6">
        <SetWallColor @changeColor="color => $emit('changeColor', color)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useConfiguratorStore } from '@/stores/configurator'
import useTexturesStore from '@/stores/textures';

import SetWallColor from '@/components/controls/SetWallColor.vue'
import Textures from '@/components/Textures.vue'

import Close from '@/components/icons/Close.vue'

const texturesModule = useTexturesStore()
texturesModule.getRoomTextures()

const props = defineProps(['element'])
const emits = defineEmits(['close'])
const title = ref('Opzioni stanza')

const configurator = useConfiguratorStore()

const setMaterial = (material) => {
  configurator.changeFloor(material)
  configurator.updateConfig()
}

const close = () => {
  emits('close')
}
</script>
<style>
.hu-color-picker canvas {
  max-width: 100%;
}
</style>