<template>
  <div class="flex h-screen overflow-hidden w-full">
    <Loader :visible="loading" />
    <div class="relative w-full">
      <Header class="absolute" />
      <div canvas-wrapper class="h-full w-full" ref="canvasWrapper" />
      <Btn v-if="selectedElement" @click="closeElementSettings" class="absolute overflow-hidden bottom-16 left-1/2 -translate-x-1/2 rounded-full">
        <template #prepend>
          <Close class="cursor-pointer"/>
        </template> Termina inserimento
      </Btn>
    </div>
    <Actions @toggle-list="showList = !showList" @toggle-download="showDownload = !showDownload" />
    <Controls class="transition-all w-[450px] z-2" :controls="controlsList">
      <Transition name="slide-in">
        <RoomSettings v-if="isEditingRoom" class="relative z-5" :element="config.room" @close="closeRoomSettings" />
      </Transition>
      <ElementConfiguration v-if="selectedElement" :element="selectedElement" @close="closeElementSettings" />
      <ProductList v-if="showList" @close="showList = false" />
      <DownloadModel v-if="showDownload" @close="showDownload = false" />
    </Controls>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, markRaw, computed, defineAsyncComponent } from 'vue'

import Loader from '@/components/Loader.vue'
import Controls from '@/components/controls/Controls.vue'
import RoomSettings from '@/components/controls/RoomSettings.vue'
import ElementConfiguration from '@/components/controls/ElementConfiguration.vue'
import Header from '@/components/Header.vue'
import Actions from '@/components/Actions.vue'
import ProductList from '@/components/ProductList.vue'
import DownloadModel from '@/components/DownloadModel.vue'
import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'

import Viewer from '@/Viewer/Viewer'
import { useConfiguratorStore } from '@/stores/configurator'
import useOptionsStore from '@/stores/options'
import useEncumbrancesStore from '@/stores/encumbrances'
import useUprightsStore from '@/stores/uprights'
import useShelvesStore from '@/stores/shelves'
import useCasesStore from '@/stores/cases'
import useTexturesStore from '@/stores/textures'
import useColorsStore from '@/stores/colors'

import { controlsList } from '@/dataset/controls'
//import { obstaclesData } from '@/dataset/obstaclesData'
//import { uprightsData } from '@/dataset/uprightsData'
//import { shelvesData } from '@/dataset/shelvesData'

const configurator = useConfiguratorStore()

const props = defineProps(['config'])

const canvasWrapper = ref(null)
const selectedElement = ref(null)
const loading = ref(false)
const showList = ref(false)
const showDownload = ref(false)

controlsList.map((item) => {
  item.componentInstance = item.component ? markRaw(defineAsyncComponent(() => import(`./controls/${item.component}.vue`))) : null
})
const optionsModule = useOptionsStore()
const encumbrancesModule = useEncumbrancesStore()
encumbrancesModule.getEncumbrances()

const uprightsModule = useUprightsStore()
const shelvesModule = useShelvesStore()
const casesModule = useCasesStore()
const colorsModule = useColorsStore()
colorsModule.getColors()
const texturesModule = useTexturesStore()
texturesModule.getTextures()

const selectedOption = computed(() => optionsModule.selected)
const isEditingRoom = computed(() => selectedOption.value.id === 2)

const closeRoomSettings = () => {
  optionsModule.resetSelectedOption()
}

const closeElementSettings = () => {
  selectedElement.value = null
  configurator.removeSelection()
}

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
      shelf: computed(() => shelvesModule.index),
      case: computed(() => casesModule.index)
    }
    //console.log(data[type].value)
    if(data[type].value.length) {
      const el = data[type].value.find(p => p.id === id)
      if (!variantId) return el
      console.log(el)
      //location.reload()
      return { ...el.variants.find(v => v.id === variantId), id, variantId }
    }
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

<style>
[canvas-wrapper] canvas {
  width: 100% !important;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
}
</style>