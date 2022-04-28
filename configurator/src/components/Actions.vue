<script setup>
import { useConfiguratorStore } from "@/stores/configurator"
import { storeToRefs } from 'pinia'
import Undo from '@/components/icons/Undo.vue'
import Redo from '@/components/icons/Redo.vue'
import CenterCam from '@/components/icons/CenterCam.vue'
import Pan from '@/components/icons/Pan.vue'
import Dimensions from '@/components/icons/Dimensions.vue'
import Human from '@/components/icons/Human.vue'
import List from '@/components/icons/List.vue'
import Download from '@/components/icons/Download.vue'

const configurator = useConfiguratorStore()
const { canUndo, canRedo } = storeToRefs(configurator)
</script>

<template>
  <div class="fixed left-3 top-1/2 transform -translate-y-1/2">
    <div class="flex flex-col">
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" :class="{ 'pointer-events-none opacity-30': !canUndo }" @click="configurator.undo()">
        <Undo />
      </div>
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" :class="{ 'pointer-events-none opacity-30': !canRedo }" @click="configurator.redo()">
        <Redo />
      </div>
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" @click="configurator.togglePan()">
        <Pan />
      </div>
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" @click="configurator.centerCam()">
        <CenterCam />
      </div>
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" @click="configurator.toggleMeasures()">
        <Dimensions />
      </div>
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" @click="configurator.toggleHuman()">
        <Human />
      </div>
      <div class="mt-2.5 w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" @click="$emit('toggle-list')">
        <List />
      </div>
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer text-black" @click="$emit('toggle-download')">
        <Download />
      </div>
    </div>
  </div>
</template>