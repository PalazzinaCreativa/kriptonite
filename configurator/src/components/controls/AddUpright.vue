<template>
  <div uprights class="grid grid-cols-3 gap-8 w-full my-6">
    <div v-for="(upright, index) in uprights" :key="`upright-${index}`" class="cursor-pointer hover:opacity-60 transition-all duration-400 group" @click="configurator.addElement({ ...variant, id: upright.id, variantId: variant.id })">
      <div upright>
        <img v-if="upright.image?.url" :src="upright.image.url" :width="upright.image.width" :height="upright.image.height" class="w-full h-full object-cover p-4 transform duration-400 transition-all group-hover:-translate-y-2" :alt="upright.image.url">
        <div class="text-center" v-text="upright.name" />
      </div>
    </div>
  </div>
  bisogna fare una sidebar per le varianti di montante
  <!-- <div class="my-20">
    <h2>Montanti</h2>
    <div v-if="uprights.length">
      <div v-for="upright of uprights" :key="`upright${upright.id}`" class="flex flex-wrap">
        <div class="m-2 cursor-pointer hover:opacity-60" v-for="variant of upright.variants" :key="variant.id"  @click="configurator.addElement({ ...variant, id: upright.id, variantId: variant.id })">
          <img v-if="upright.image?.url" :src="upright.image.url" :width="upright.image.width" :height="upright.image.height" class="w-full h-full object-cover p-4 transform duration-400 transition-all group-hover:-translate-y-2" :alt="upright.image.url">
          <div>{{ variant.name }}</div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script setup>
import { computed } from 'vue'
//import { uprightsData } from "@/dataset/uprightsData"
import { useConfiguratorStore } from '@/stores/configurator'
import useUprightsStore from '@/stores/uprights'

const configurator = useConfiguratorStore()
const uprightsModule = useUprightsStore()
uprightsModule.getUprights(1)
const uprights = computed(() => uprightsModule.index)

//const uprights = computed(() => uprightsData.filter(u => u.products.includes('k1')))
</script>