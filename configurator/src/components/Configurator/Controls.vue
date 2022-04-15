<script setup>
import SetWallColor from '@/components/controls/SetWallColor.vue'
import AddObstacles from '@/components/controls/AddObstacles.vue'
import AddUpright from '@/components/controls/AddUpright.vue'
import AddShelf from '@/components/controls/AddShelf.vue'
import { useConfiguratorStore } from '../../stores/configurator';

const configurator = useConfiguratorStore()
</script>

<template>
  <div>
    <div class="h-full bg-white z-20 shadow-md flex flex-col px-6 py-10" v-if="configurator.isReady">
      <SetWallColor @changeColor="color => $emit('changeColor', color)" />
      <AddObstacles />
      <AddUpright />
      <AddShelf />
    </div>
  </div>
</template>

<style>
.hu-color-picker canvas {
  max-width: 100%;
}
</style>