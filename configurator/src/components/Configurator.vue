<script setup>
import { onMounted, reactive, ref } from 'vue'

import Controls from '@/components/controls/Controls.vue'
import ElementConfiguration from '@/components/controls/ElementConfiguration.vue'
import Actions from '@/components/Actions.vue'
import ProductList from '@/components/ProductList.vue'
import DownloadModel from '@/components/DownloadModel.vue'

import Viewer from '@/Viewer/Viewer'
import { useConfiguratorStore } from '@/stores/configurator'

import { obstaclesData } from '@/dataset/obstaclesData'
import { uprightsData } from '@/dataset/uprightsData'
import { shelvesData } from '@/dataset/shelvesData'

const configurator = useConfiguratorStore()

const props = defineProps(['config'])

const canvasWrapper = ref(null)
const selectedElement = ref(null)
const showList = ref(false)
const showDownload = ref(false)

onMounted(() => {
  const viewer = new Viewer(
    canvasWrapper.value, // Elemento del dom principale
    props.config,
    () => { // Callback
      configurator.$patch({
        viewerGetter: () => viewer,
        isReady: true
      })
    }
  )

// Passo i dati al viewer per popolare il configuratore
  viewer.setHook('getData', ({ type, id, variantId }) => {
    const data = {
      obstacle: obstaclesData,
      upright: uprightsData,
      shelf: shelvesData
    }

    const el = data[type].find(p => p.id === id)
    if (!variantId) return el
    return { ...el.variants.find(v => v.id === variantId), id, variantId }
  })

  viewer.setHook('selectElement', (element) => {
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

<template>
  <div class="flex h-screen w-full">
    <div class="flex-1 h-full" ref="canvasWrapper"></div>
    <Actions @toggle-list="showList = !showList" @toggle-download="showDownload = !showDownload" />
    <Controls class="w-80">
      <ElementConfiguration :element="selectedElement" v-if="selectedElement" @close="selectedElement = null" />
      <ProductList v-if="showList" @close="showList = false" />
      <DownloadModel v-if="showDownload" @close="showDownload = false" />
    </Controls>
  </div>
</template>