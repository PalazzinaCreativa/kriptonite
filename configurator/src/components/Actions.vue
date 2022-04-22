<script setup>
import { useConfiguratorStore } from "@/stores/configurator"
import { storeToRefs } from 'pinia'

const configurator = useConfiguratorStore()
const { canUndo, canRedo } = storeToRefs(configurator)
</script>

<template>
  <div class="fixed left-3 top-1/2 transform -translate-y-1/2">
    <div class="flex flex-col">
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer" :class="{ 'pointer-events-none opacity-30': !canUndo }" @click="configurator.undo()">
        Undo
      </div>
      <div class="w-10 h-10 border border-gray flex justify-center items-center bg-white cursor-pointer" :class="{ 'pointer-events-none opacity-30': !canRedo }" @click="configurator.redo()">
        Redo
      </div>
    </div>
  </div>
</template>