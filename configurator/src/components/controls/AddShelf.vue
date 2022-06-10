<template>
  <div shelves class="grid grid-cols-3 gap-8 w-full">
    <div v-for="(shelf, index) in shelves" :key="`shelf-${index}`" class="cursor-pointer hover:opacity-60 transition-all duration-400 group">
      <div shelf @click="addShelf(shelf)">
        <img v-if="shelf.image" :src="shelf.image.url" :width="shelf.image.width" :height="shelf.image.height" class="w-32 h-32 object-contain transform duration-400 transition-all group-hover:-translate-y-2" :alt="shelf.name">
        <img v-else src="https://placehold.jp/150x150.png" width="150" height="150" alt="" class="bg-light-gray w-24 h-24 object-cover mx-auto mb-4"/>
        <div class="text-center" v-text="shelf.name" />
      </div>
    </div>
    <Teleport to="body">
      <Alert :visible="isAlerting" message="Devi prima posizionare almeno <b>2 montanti</b> per poter aggiungere i ripiani" @confirm="closeModal" @cancel="closeModal">
        <template #actions>
          <div alert-actions class="flex items-center justify-center gap-8 mt-6 w-full">
            <Btn class="bg-yellow rounded-full" :label="confirmLabel" @click="closeModal" />
          </div>
        </template>
      </Alert>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import useProductsStore from '@/stores/products'
import useShelvesStore from '@/stores/shelves'
import useTipsStore from '@/stores/tips'
import Alert from '@/components/Alert.vue'
import Btn from '@/components/forms/Button.vue'

const configurator = useConfiguratorStore()
const productsModule = useProductsStore()
const shelvesModule = useShelvesStore()
shelvesModule.getShelves(productsModule.selectedProduct.id)
const tipsModule = useTipsStore()

const configuration = computed(() => configurator.options)
const shelves = computed(() => shelvesModule.index)

const isVisible = ref(false)
const confirmLabel = 'Ho capito'

const openModal = () => {
  isVisible.value = true
}

const closeModal = () => {
  isVisible.value = false
}

const isAlerting = computed(() => isVisible.value && configuration.value.uprights?.length <= 1)

const addShelf = (shelf) => {
  openModal()
  if(!isAlerting.value) {
    configurator.addElement({ ...shelf.variants[0], id: shelf.id, variantId: shelf.variants[0].id })
  }
}

onMounted(() => {
  tipsModule.setActiveTip('shelves')
})
</script>