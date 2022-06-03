<template>
  <div cases class="grid grid-cols-3 gap-8 w-full">
    <div v-for="(item, index) in cases" :key="`item-${index}`" class="cursor-pointer hover:opacity-60 transition-all duration-400 group">
      <div item @click="addCase(item)">
        <img v-if="item.image" :src="item.image.url" :width="item.image.width" :height="item.image.height" class="w-32 h-32 object-contain transform duration-400 transition-all group-hover:-translate-y-2" :alt="item.name">
        <img v-else src="https://placehold.jp/150x150.png" width="150" height="150" alt="" class="bg-light-gray w-24 h-24 object-cover mx-auto mb-4"/>
        <div class="text-center" v-text="item.name" />
      </div>
    </div>
    <Teleport to="body">
      <Alert :visible="isAlerting" message="Devi prima posizionare almeno <b>2 montanti</b> per poter aggiungere i contenitori" @confirm="closeModal" @cancel="closeModal"/>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import useProductsStore from '@/stores/products'
import useCasesStore from '@/stores/cases'
import Alert from '@/components/Alert.vue'


const configurator = useConfiguratorStore()
const productsModule = useProductsStore()
const casesModule = useCasesStore()
casesModule.getCases(productsModule.selectedProduct.id)
const configuration = computed(() => configurator.options)
const cases = computed(() => casesModule.index)

const isVisible = ref(false)

const openModal = () => {
  isVisible.value = true
}

const closeModal = () => {
  isVisible.value = false
}

const isAlerting = computed(() => isVisible.value && configuration.value.uprights?.length <= 1)

const addCase = (item) => {
  openModal()
  if(!isAlerting.value) {
    configurator.addElement({ ...item.variants[0], id: item.id, variantId: item.variants[0].id })
  }
}
</script>