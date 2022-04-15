<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useInitialSetupStore } from '@/stores/initialSetup'
import Controls from './Controls.vue'
import Viewer from '../Viewer/Viewer'
import { useConfiguratorStore } from '../../stores/configurator';

const initialSetup = useInitialSetupStore()
const configurator = useConfiguratorStore()

const canvasWrapper = ref(null)

onMounted(() => {
  const viewer = new Viewer(
    canvasWrapper.value, // Elemento del dom principale
    { // Configurazione iniziale
      room: {
        layout: initialSetup.layout,
        type: initialSetup.type,
        dimensions: initialSetup.dimensions
      },
      product: null // Informazioni prodotto se già disponibili dall'url
    },
    () => { // Callback
      configurator.$patch({
        viewerGetter: () => viewer,
        isReady: true
      })
    }
  )


  // viewer.setHook('selectedObject', (a) => {
  //   console.log('valore ashadskhasdkh', a)
  // })
})
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="flex-1 h-full" ref="canvasWrapper"></div>
    <Controls class="w-80" />
  </div>
</template>