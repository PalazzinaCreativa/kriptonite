<script setup>
import SetWallColor from '@/components/controls/SetWallColor.vue'
import AddObstacles from '@/components/controls/AddObstacles.vue'
</script>

<template>
  <div class="h-full bg-white z-20 shadow-md flex flex-col px-6 py-10">
    <SetWallColor @changeColor="color => $emit('changeColor', color)" />
    <AddObstacles />
  </div>
</template>

<style>
.hu-color-picker canvas {
  max-width: 100%;
}
</style>