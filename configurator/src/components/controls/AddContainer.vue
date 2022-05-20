<template>
  <div>
    Coming soon!
  </div>
</template>

<script setup>
import { computed } from 'vue'
// import { obstaclesData } from '@/dataset/obstaclesData'
import { useConfiguratorStore } from '@/stores/configurator'
//import useEncumbrancesStore from '@/stores/encumbrances'

const configurator = useConfiguratorStore()
/* const encumbrancesModule = useEncumbrancesStore()
encumbrancesModule.getEncumbrances()
const encumbrances = computed(() => encumbrancesModule.index) */
</script>