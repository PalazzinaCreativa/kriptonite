<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useInitialSetupStore } from '@/stores/initialSetup'
import Controls from './Controls.vue'
import ElementConfiguration from './ElementConfiguration.vue'
import Viewer from '../Viewer/Viewer'
import { useConfiguratorStore } from '@/stores/configurator';
import { obstaclesData } from '@/dataset/obstaclesData'
import { uprightsData } from '@/dataset/uprightsData'
import { shelvesData } from '@/dataset/shelvesData'
import { storeToRefs } from 'pinia'

const initialSetup = useInitialSetupStore()
const configurator = useConfiguratorStore()

const props = defineProps(['config'])

const canvasWrapper = ref(null)

const selectedElement = ref(null)

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

  viewer.setHook('getData', ({ type, id, variantId }) => {
    const data = {
      obstacle: obstaclesData,
      upright: uprightsData,
      shelf: shelvesData
    }

    const el = data[type].find(p => p.id === id)
    if (!variantId) return el
    return el.variants.find(v => v.id === variantId)
  })

  viewer.setHook('selectElement', (element) => {
    selectedElement.value = element
  })
})
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="flex-1 h-full" ref="canvasWrapper"></div>
    <Controls class="w-80">
      <ElementConfiguration :element="selectedElement" v-if="selectedElement" @close="selectedElement = null" />
    </Controls>
  </div>
</template>