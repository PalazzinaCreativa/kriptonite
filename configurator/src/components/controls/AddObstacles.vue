<script setup>
import { obstaclesData } from '@/dataset/obstaclesData'
import { useConfiguratorStore } from '@/stores/configurator'

const configurator = useConfiguratorStore()
</script>

<template>
  <div class="obstacles relative mt-10">
    <h2>Ingombri</h2>
    <div class="flex mt-4">
      <div v-for="obstacle of obstaclesData" :key="obstacle.type" class="w-20 cursor-pointer hover:opacity-60" @click="configurator.addElement(obstacle)">
        <img :src="obstacle.image" alt="">
        <div class="block text-center">{{ obstacle.name }}</div>
      </div>
    </div>
  </div>
</template>