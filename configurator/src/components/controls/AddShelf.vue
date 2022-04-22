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
      <div v-for="shelf of shelves" :key="shelf.id" class="flex flex-wrap">
        <div  class="m-2 cursor-pointer hover:opacity-60" v-for="variant of shelf.variants" :key="variant.id"  @click="configurator.addElement({ ...variant, id: shelf.id, variantId: variant.id })">
          <img v-if="variant.image" :src="variant.image">
          <div>{{ variant.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>