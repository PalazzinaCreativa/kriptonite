<template>
  <div class="flex h-screen overflow-hidden w-full">
    <Header />
    <Loader :visible="loading" />
    <div canvas-wrapper class="flex-1 h-full transition-all w-full" ref="canvasWrapper" />
    <Actions @toggle-list="showList = !showList" @toggle-download="showDownload = !showDownload" />
    <Controls class="transition-all w-[450px] z-2">
      <ElementConfiguration v-if="selectedElement" :element="selectedElement" @close="selectedElement = null" />
      <ProductList v-if="showList" @close="showList = false" />
      <DownloadModel v-if="showDownload" @close="showDownload = false" />
    </Controls>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'

import Loader from '@/components/Loader.vue'
import Controls from '@/components/controls/Controls.vue'
import ElementConfiguration from '@/components/controls/ElementConfiguration.vue'
import Header from '@/components/Header.vue'
import Actions from '@/components/Actions.vue'
import ProductList from '@/components/ProductList.vue'
import DownloadModel from '@/components/DownloadModel.vue'

import Viewer from '@/Viewer/Viewer'
import { useConfiguratorStore } from '@/stores/configurator'
import useEncumbrancesStore from '@/stores/encumbrances'
import useUprightsStore from '@/stores/uprights'
import useTexturesStore from '@/stores/textures'

//import { obstaclesData } from '@/dataset/obstaclesData'
//import { uprightsData } from '@/dataset/uprightsData'
import { shelvesData } from '@/dataset/shelvesData'

const configurator = useConfiguratorStore()

const props = defineProps(['config'])

const canvasWrapper = ref(null)
const selectedElement = ref(null)
const loading = ref(false)
const showList = ref(false)
const showDownload = ref(false)

const encumbrancesModule = useEncumbrancesStore()
encumbrancesModule.getEncumbrances()

const uprightsModule = useUprightsStore()
uprightsModule.getUprights(1)

const texturesModule = useTexturesStore()
texturesModule.getTextures()

onMounted(() => {
  loading.value = true
  const viewer = new Viewer(
    canvasWrapper.value, // Elemento del dom principale
    props.config,
    () => { // Callback
      configurator.$patch({
        viewerGetter: () => viewer,
        isReady: true
      })
      loading.value = false
    }
  )

// Passo i dati al viewer per popolare il configuratore
  viewer.setHook('getData', ({ type, id, variantId }) => {
    const data = {
      obstacle: computed(() => encumbrancesModule.index),
      upright: computed(() => uprightsModule.index),
      shelf: shelvesData
    }

    const el = data[type].find(p => p.id === id)
    if (!variantId) return el
    return { ...el.variants.find(v => v.id === variantId), id, variantId }
  })

  viewer.setHook('selectElement', (element) => {
    console.log(element)
    selectedElement.value = element
  })

  viewer.setHook('removeSelectedElement', () => {
    selectedElement.value = null
  })

  viewer.setHook('checkUndoRedo', ({ canUndo, canRedo }) => {
    configurator.$patch({ canUndo, canRedo })
  })
})
</script>

<style>
[canvas-wrapper] canvas {
  width: 100% !important;
}
</style>x