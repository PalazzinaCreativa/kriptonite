<template>
  <div class="w-full">
    <!-- <Loader :visible="loading" /> -->
    <Configurator v-if="configurationData" :config="configurationData" />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfiguratorStore } from '@/stores/configurator'
import Configurator from '@/components/Configurator.vue'
//import Loader from '@/components/Loader.vue'
import useProductsStore from '@/stores/products'

const configurator = useConfiguratorStore()
const productsModule = useProductsStore()

const route = useRoute()

//const loading = ref(false)
const currentConfiguration = computed(() => configurator.currentConfiguration)
const configurationData = computed(() => currentConfiguration.value?.infos?.infos || currentConfiguration.value?.infos || null)
const products = ref({})

onMounted(async () => {
  //loading.value = true
  if(route?.params?.id) {
    await configurator.getConfiguration(route.params.id)
    setSelectedProduct(configurationData.value.product)
    //await configurator.feed()
    //loading.value = false
  }
  //console.log(route)
})

const setSelectedProduct = async (product) => {
  await productsModule.getProducts()
  products.value = productsModule.index
  const selectedProduct = product.type ? products.value.find((item) => {
    return item.sku === product.type
  }) : products.value[0]
  productsModule.setSelectedProduct(selectedProduct)
}
</script>