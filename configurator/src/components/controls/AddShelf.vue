<script setup>
import { shelvesData } from "@/dataset/shelvesData"
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'

const configurator = useConfiguratorStore()

const shelves = computed(() => shelvesData.filter(u => u.products.includes('k1')))
</script>

<template>
  <div class="my-20">
    <h2>Scaffali</h2>
    <div class="flex flex-wrap" v-if="shelvesData">
      <div v-for="shelf of shelves" :key="shelf.id" class="m-2 cursor-pointer hover:opacity-60" @click="configurator.addShelf(shelf.variants[0])">
        <img v-if="shelf.variants[0].image" :src="shelf.variants[0].image">
        <div>{{ shelf.variants[0].name }}</div>
      </div>
    </div>
  </div>
</template>