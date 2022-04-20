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
    <div  v-if="uprightsData">
      <div v-for="upright of uprights" :key="upright.id" class="flex flex-wrap">
        <div  class="m-2 cursor-pointer hover:opacity-60" v-for="variant of upright.variants" :key="variant.id"  @click="configurator.addUpright(Object.assign(variant, { id: upright.id, variantId: variant.id }, {}))">
          <img v-if="variant.image" :src="variant.image">
          <div>{{ variant.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>