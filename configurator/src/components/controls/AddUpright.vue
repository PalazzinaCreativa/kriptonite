<script setup>
import { uprightsData } from "@/dataset/uprightsData"
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'

const configurator = useConfiguratorStore()

const uprights = computed(() => uprightsData.filter(u => u.products.includes('k1')))
</script>

<template>
  <div class="my-20">
    <h2>Montanti</h2>
    <div class="flex flex-wrap" v-if="uprightsData">
      <div v-for="upright of uprights" :key="upright.id" class="m-2 cursor-pointer hover:opacity-60" @click="configurator.addUpright(upright.variants[3])">
        <img v-if="upright.variants[3].image" :src="upright.variants[3].image">
        <div>{{ upright.variants[3].name }}</div>
      </div>
    </div>
  </div>
</template>