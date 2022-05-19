<template>
  <div uprights class="grid grid-cols-3 gap-8 w-full">
    <div v-for="(upright, index) in uprights" :key="`upright-${index}`" class="cursor-pointer hover:opacity-60 transition-all duration-400 group">
      <div upright @click="configurator.addElement({ ...upright.variants[0], id: upright.id, variantId: upright.variants[0].id })">
        <img v-if="upright.image" :src="upright.image.url" :width="upright.image.width" :height="upright.image.height" class="w-16 h-16 object-cover p-4 transform duration-400 transition-all group-hover:-translate-y-2" :alt="upright.name">
        <img v-else src="http://placehold.jp/150x150.png" width="150" height="150" alt="" class="bg-light-gray w-24 h-24 object-cover mx-auto mb-4"/>
        <div class="text-center" v-text="upright.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
//import { uprightsData } from "@/dataset/uprightsData"
import { useConfiguratorStore } from '@/stores/configurator'
import useUprightsStore from '@/stores/uprights'

const configurator = useConfiguratorStore()
const uprightsModule = useUprightsStore()
uprightsModule.getUprights(1)
const uprights = computed(() => uprightsModule.index)
</script>