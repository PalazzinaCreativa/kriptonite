<template>
  <div class="flex h-screen overflow-hidden w-full">
    <Loader :visible="loading" />
    <div class="relative w-full">
      <Header class="absolute" :config="config" />
      <div canvas-wrapper class="h-full w-full" ref="canvasWrapper" />
      <Transition name="slide-up">
        <Btn v-if="selectedElement" @click="closeElementSettings" class="absolute bg-light-gray overflow-hidden bottom-16 left-1/2 -translate-x-1/2 transform rounded-full">
          <template #prepend>
            <Close class="cursor-pointer"/>
          </template> Termina inserimento
        </Btn>
      </Transition>
      <Tips />
      <Teleport to="body">
        <Alert :visible="isAlerting" message="Eliminando questo montante <b>eliminerai tutti i montanti alla sua destra ed i prodotti ad essi collegati</b>.<br/><br/>Vuoi continuare?" @confirm="confirm" @cancel="closeModal"/>
      </Teleport>
    </div>
    <Actions @toggle-list="showList = !showList" @toggle-download="showDownload = !showDownload" />
    <Controls v-if="canEdit" class="transition-all w-[320px] lg:w-[560px] z-2" :controls="controlsList" @share="shareProject" @destroy="tabulaRasa">
      <Transition name="slide-in">
        <RoomSettings v-if="isEditingRoom" class="absolute z-5" :element="config.room" @close="closeRoomSettings" />
      </Transition>
      <ElementConfiguration v-if="selectedElement" :element="selectedElement" @close="closeElementSettings" />
      <ProductList v-if="showList" @close="showList = false" />
      <DownloadModel v-if="showDownload" :config="config" @close="showDownload = false" />
    </Controls>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, markRaw, computed, defineAsyncComponent } from 'vue'

import Loader from '@/components/Loader.vue'
import Controls from '@/components/controls/Controls.vue'
import Tips from '@/components/Tips.vue'
import RoomSettings from '@/components/controls/RoomSettings.vue'
import ElementConfiguration from '@/components/controls/ElementConfiguration.vue'
import Header from '@/components/Header.vue'
import Actions from '@/components/Actions.vue'
import ProductList from '@/components/ProductList.vue'
import DownloadModel from '@/components/DownloadModel.vue'
import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'
import Alert from '@/components/Alert.vue'

import Viewer from '@/Viewer/Viewer'
import { useConfiguratorStore } from '@/stores/configurator'
import useOptionsStore from '@/stores/options'
import useProductsStore from '@/stores/products'
import useEncumbrancesStore from '@/stores/encumbrances'
import useUprightsStore from '@/stores/uprights'
import useShelvesStore from '@/stores/shelves'
import useCasesStore from '@/stores/cases'
import useTexturesStore from '@/stores/textures'
import useColorsStore from '@/stores/colors'
import useTipsStore from '@/stores/tips'

import { controlsList } from '@/dataset/controls'

const configurator = useConfiguratorStore()

const props = defineProps(['config'])

const canvasWrapper = ref(null)
const selectedElement = ref(null)
const loading = ref(false)
const showList = ref(false)
const showDownload = ref(false)
const tip = ref({})

controlsList.map((item) => {
  item.componentInstance = item.component ? markRaw(defineAsyncComponent(() => import(`./controls/${item.component}.vue`))) : null
})
const optionsModule = useOptionsStore()
const productsModule = useProductsStore()
const selectedProduct = computed(() => productsModule.selectedProduct)
const encumbrancesModule = useEncumbrancesStore()
encumbrancesModule.getEncumbrances()

//console.log(selectedProduct)
const uprightsModule = useUprightsStore()
uprightsModule.getUprights(1)

const shelvesModule = useShelvesStore()
shelvesModule.getShelves(1)

const casesModule = useCasesStore()
casesModule.getCases(1)

const colorsModule = useColorsStore()
colorsModule.getColors()
const texturesModule = useTexturesStore()
texturesModule.getTextures()
const tipsModule = useTipsStore()
tipsModule.getCookies()

const selectedOption = computed(() => optionsModule.selected)
const isEditingRoom = computed(() => selectedOption.value.id === 2)

const canEdit = computed(() => {
  return !props.config.shared || (props.config.shared && import.meta.env.DEV)
})

const closeRoomSettings = () => {
  optionsModule.resetSelectedOption()
}

const closeElementSettings = () => {
  selectedElement.value = null
  configurator.removeSelection()
}

const isAlerting = ref(false)

window.addEventListener('alert', (event) => {
  openModal()
})

const openModal = () => {
  isAlerting.value = true
}

const closeModal = () => {
  isAlerting.value = false
}

const confirm = () => {
  window.dispatchEvent(new Event('confirmModal'))
  isAlerting.value = false
}

const shareProject = async () => {
  showDownload.value = true
}

onMounted(() => {
  configurator.setOptions(props.config.product)
  // Apro il consiglio iniziale
  tipsModule.setActiveTip('intro')

  loading.value = true
  const viewer = new Viewer(
    canvasWrapper.value, // Elemento del dom principale
    props.config,
    () => { // Callback
      configurator.$patch({
        viewerGetter: () => viewer,
        isReady: true
      })
      configurator.$patch({ canShare: !props.config.shared })
      loading.value = false
    }
  )

  //console.log('viewer', viewer)

// Passo i dati al viewer per popolare il configuratore
  viewer.setHook('getData', ({ type, id, variantId }) => {
    const data = {
      obstacle: computed(() => encumbrancesModule.index),
      upright: computed(() => uprightsModule.index),
      shelf: computed(() => shelvesModule.index),
      case: computed(() => casesModule.index)
    }
    //console.log('data hook', data)

    // Ricavo la variante corretta
    if(data[type].value.length) {
      // Ricavo gli elementi con quell'ID
      let elements = data[type].value.filter(p => p.id === id)
      // Se più di un elemento ha lo stesso ID, cerco quelli che hanno una variante con lo stesso ID
      const el = elements.length > 1 ? elements.find((product) => {
        return product.variants.some(variant => variant.id === variantId)
      }) : elements[0]
      // Se non ho nessuna variante ritorno l'elemento stesso
      if (!variantId) return el
      // Altrimenti carico la variante con quell'ID
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

const tabulaRasa = () => {
  //console.log('reset scene')
}

</script>

<style>
[canvas-wrapper] canvas {
  width: 100% !important;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transform: translateX(0);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100px);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
</style>