<script setup>
import { useInitialSetupStore } from './stores/initialSetup'
import Init from '@/components/Init.vue'
import Configurator from '@/components/Configurator/index.vue'

const initialSetup = useInitialSetupStore()

const handleGoToConfigurator = () => {
  initialSetup.$patch({
    step: 4,
    layout: 'wall',
    type: 'classic',
    dimensions: {
      width: 5,
      height: 2.8,
      leftHeight: 1.2,
      rightHeight: 2.8,
      depth: 0.5
    }
  })
}
</script>

<template>
  <div>
    <div class="fixed right-12 bottom-12 underline text-black cursor-pointer" @click="handleGoToConfigurator">
      Go to configurator
    </div>
    <Init v-if="initialSetup.step < 4" />
    <Configurator v-else />
  </div>
</template>
