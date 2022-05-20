<template>
  <div shelves class="grid grid-cols-3 gap-8 w-full">
    <div v-for="(shelf, index) in shelves" :key="`shelf-${index}`" class="cursor-pointer hover:opacity-60 transition-all duration-400 group">
      <div shelf @click="configurator.addElement({ ...shelf.variants[0], id: shelf.id, variantId: shelf.variants[0].id })">
        <img v-if="shelf.image" :src="shelf.image.url" :width="shelf.image.width" :height="shelf.image.height" class="w-32 h-32 object-contain transform duration-400 transition-all group-hover:-translate-y-2" :alt="shelf.name">
        <img v-else src="https://placehold.jp/150x150.png" width="150" height="150" alt="" class="bg-light-gray w-24 h-24 object-cover mx-auto mb-4"/>
        <div class="text-center" v-text="shelf.name" />
      </div>
    </div>
  </div>
  <!-- <div class="my-20">
    <h2>Scaffali</h2>
    <div class="flex flex-wrap" v-if="shelvesData">
      <div v-for="shelf of shelves" :key="shelf.id" class="flex flex-wrap">
        <div  class="m-2 cursor-pointer hover:opacity-60" v-for="variant of shelf.variants" :key="variant.id"  @click="configurator.addElement({ ...variant, id: shelf.id, variantId: variant.id })">
          <img v-if="variant.image" :src="variant.image">
          <div>{{ variant.name }}</div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script setup>
//import { shelvesData } from "@/dataset/shelvesData"
//import { useConfiguratorStore } from '@/stores/configurator'

//const configurator = useConfiguratorStore()

//const shelves = computed(() => shelvesData.filter(u => u.products.includes('k1')))



import { onMounted, computed } from 'vue'
//import { shelfsData } from "@/dataset/shelfsData"
import { useConfiguratorStore } from '@/stores/configurator'
import useProductsStore from '@/stores/products'
import useShelvesStore from '@/stores/shelves'

const configurator = useConfiguratorStore()
const productsModule = useProductsStore()
const shelvesModule = useShelvesStore()
shelvesModule.getShelves(productsModule.selectedProduct.id)
const shelves = computed(() => shelvesModule.index)
</script>