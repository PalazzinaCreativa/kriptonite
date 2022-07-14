<template>
  <div uprights v-if="productOptions && uprights.length" class="grid grid-cols-3 gap-8 w-full">
    <div v-for="(upright, index) in uprights" :key="`upright-${index}`" class="cursor-pointer hover:opacity-60 transition-all duration-400 group">
      <div upright @click="configurator.addElement({ ...upright.variants[0], id: upright.id, variantId: upright.variants[0].id })" class="relative">
        <!-- <div badge class="bg-yellow absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 rounded-full px-2 z-2">3</div> -->
        <img v-if="upright.image" :src="upright.image.url" :width="upright.image.width" :height="upright.image.height" class="w-32 h-32 object-contain mx-auto pb-4 transform duration-400 transition-all group-hover:-translate-y-2" :alt="upright.name">
        <img v-else src="https://placehold.jp/150x150.png" width="150" height="150" alt="" class="bg-light-gray w-24 h-24 object-cover mx-auto mb-4"/>
        <div class="text-center" v-text="upright.name" />
      </div>
    </div>
    <Teleport to="body">
        <Alert :visible="isActive(activeTip)">
          <Carousel :options="carouselOptions" :dots="true" :arrows="true" class="max-w-[600px] px-4 w-full">
            <div class="w-full">
              <div alert-text class="text-black text-center" v-html="'<b>Posiziona il primo montante a partire da sinistra</b> e prosegui la tua composizione verso destra'"/>
            </div>
            <div class="w-full">
              <div alert-text class="text-black text-center" v-html="`Se intendi <b>posizionare più montanti uno sotto l'altro</b>, devi farlo <b>prima di aggiungere</b> un montante alla sua destra`"/>
              <div alert-actions class="flex items-center justify-center gap-8 mt-6 w-full">
                <Btn class="bg-yellow rounded-full" :label="`Ho capito`" @click="closeAlert" />
              </div>
            </div>
          </Carousel>
        </Alert>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import useProductsStore from '@/stores/products'
import useUprightsStore from '@/stores/uprights'
import useTipsStore from '@/stores/tips'
import Carousel from '@/components/Carousel.vue'
import Alert from '@/components/Alert.vue'
import Btn from '@/components/forms/Button.vue'

const configurator = useConfiguratorStore()
const productsModule = useProductsStore()
const uprightsModule = useUprightsStore()
uprightsModule.getUprights(productsModule.selectedProduct.id)
const tipsModule = useTipsStore()
const activeTip = computed(() => tipsModule.activeTip)

const productOptions = computed(() => configurator.options)
const uprights = computed(() => {
  return uprightsModule.index.length ? uprightsModule.index.filter((upright => {
    // Se ci sono varianti di centro, saranno utilizzate quelle
    if(upright.variants.some((variant) => variant.sku?.slice(-1) === 'C')) {
      upright.variants = upright.variants.filter((variant) => variant.sku?.slice(-1) === 'C')
    }
    return productOptions.value.uprightsPosition === 'standalone' ? upright.type === 'floor' : upright.type === 'wall'
  })) : []
})

const closeAlert = () => {
  tipsModule.closeTip(activeTip.value)
}

const isActive = (tip) => {
  return activeTip?.value?.name ? activeTip.value.name === tip.name : false
}

const carouselOptions = {
  type: 'carousel'
}

onMounted(() => {
  tipsModule.setActiveTip('uprights')

  // Prova: Se ho un solo montante, apro direttamente le sue varianti per l'aggiunta
  if(uprights.value.length === 1) {
    let upright = uprights.value[0]
    configurator.addElement({ ...upright.variants[0], id: upright.id, variantId: upright.variants[0].id })
  }
})
</script>