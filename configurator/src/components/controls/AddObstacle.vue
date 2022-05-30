<template>
  <div encumbrances class="grid grid-cols-3 gap-8 w-full my-6">
    <div v-for="(encumbrace, index) in encumbrances" :key="`encumbrace-${index}`" class="cursor-pointer hover:opacity-60 transition-all duration-400 group" @click="configurator.addElement(encumbrace)">
      <div encumbrace>
        <img v-if="encumbrace.image?.url" :src="encumbrace.image.url" :width="encumbrace.image.width" :height="encumbrace.image.height" class="w-full h-full object-cover p-4 transform duration-400 transition-all group-hover:-translate-y-2" :alt="encumbrace.image.url">
        <div class="text-center" v-text="encumbrace.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import useEncumbrancesStore from '@/stores/encumbrances'

const configurator = useConfiguratorStore()
const encumbrancesModule = useEncumbrancesStore()
const encumbrances = computed(() => encumbrancesModule.index)
</script>