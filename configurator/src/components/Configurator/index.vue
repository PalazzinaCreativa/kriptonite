<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useInitialSetupStore } from '@/stores/initialSetup'
import Controls from './Controls.vue'
import Configurator from './Configurator'
import { useConfiguratorStore } from '../../stores/configurator';

const initialSetup = useInitialSetupStore()
const configurator = useConfiguratorStore()

const canvasWrapper = ref(null)

onMounted(() => {
  const viewer = new Configurator(canvasWrapper.value,
      {
        layout: initialSetup.layout,
        type: initialSetup.type,
        dimensions: initialSetup.dimensions
      }
    )
  configurator.$patch({
    viewerGetter: () => viewer
  })
})
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 h-full" ref="canvasWrapper"></div>
    <Controls class="w-80" />
  </div>
</template>