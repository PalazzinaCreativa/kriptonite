<template>
  <div class="flex h-screen overflow-hidden w-full">
    <Loader :visible="loading" />
    <div class="relative w-full">
      <Header class="absolute" :config="config" />
      <div canvas-wrapper class="h-full w-full" ref="canvasWrapper" />
      <Transition name="slide-up">
        <div v-if="selectedElement" @click="destroyElement" class="absolute bottom-16 left-1/2 -translate-x-1/2">
          <Btn v-if="selectedElement.isEdit" class="bg-light-gray overflow-hidden transform rounded-full">
            <span v-text="mainButtonLabel" />
          </Btn>
          <Btn v-else @click="closeElementSettings" class="bg-light-gray overflow-hidden transform rounded-full">
            <template #prepend>
              <Close class="cursor-pointer"/>
            </template>
            <span v-text="mainButtonLabel" />
          </Btn>
        </div>
      </Transition>
      <Tips />
      <Teleport to="body">
        <Alert :visible="isAlerting" message="Eliminando questo montante <b>eliminerai tutti i montanti alla sua destra ed i prodotti ad essi collegati</b>.<br/><br/>Vuoi continuare?" @confirm="confirm" @cancel="closeModal"/>
      </Teleport>
    </div>
    <Actions @toggle-list="showList = !showList" @toggle-download="showDownload = !showDownload" />
    <Controls v-if="canEdit" class="transition-all w-[320px] lg:w-[560px] z-2" :controls="controlsList" @share="shareProject" @destroy="tabulaRasa">
      <Transition name="slide-in">
        <RoomSettings v-if="isEditingRoom" class="absolute z-6" :element="config.room" @close="closeRoomSettings" />
      </Transition>
      <Transition name="slide-in">
        <ElementConfiguration v-if="selectedElement" :element="selectedElement" @close="closeElementSettings" />
      </Transition>
      <Transition name="slide-in">
        <ProductList v-if="showList" @close="showList = false" />
      </Transition>
      <Transition name="slide-in">
        <DownloadModel v-if="showDownload" :config="config" @close="showDownload = false" @request-quote="openRequestQuoteForm"/>
      </Transition>
      <Transition name="slide-in">
        <QuoteRequest v-if="requestingQuote" @close="closeRequestQuoteForm"/>
      </Transition>
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
import QuoteRequest from '@/components/QuoteRequest.vue'
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

// Menu degli "Elementi"
import { controlsList } from '@/dataset/controls'

const props = defineProps(['config'])

const canvasWrapper = ref(null)
const selectedElement = ref(null)
const fittingElement = ref({})
const loading = ref(false)
const showList = ref(false)
const showDownload = ref(false)
const requestingQuote = ref(false)
const tip = ref({})

controlsList.map((item) => {
  item.componentInstance = item.component ? markRaw(defineAsyncComponent(() => import(`./controls/${item.component}.vue`))) : null
})
// Caricamento dello store "Configuratore"
const configurator = useConfiguratorStore()
// Caricamento dello store "Opzioni della stanza"
const optionsModule = useOptionsStore()
// Caricamento dello store "Prodotti"
const productsModule = useProductsStore()
// Caricamento dello store "Ostacoli"
const encumbrancesModule = useEncumbrancesStore()
// Caricamento dello store "Montanti"
const uprightsModule = useUprightsStore()
// Caricamento dello store "Ripiani"
const shelvesModule = useShelvesStore()
// Caricamento dello store "Contenitori"
const casesModule = useCasesStore()
// Caricamento dello store "Colori"
const colorsModule = useColorsStore()
// Caricamento dello store "Textures"
const texturesModule = useTexturesStore()
// Caricamento dello store "Consigli"
const tipsModule = useTipsStore()

// Chiamata per ricavare gli "Ostacoli"
encumbrancesModule.getEncumbrances()

if(props.config?.product?.id) {
  // Chiamata per ricavare i "Montanti"
  uprightsModule.getUprights(props.config.product.id)
  // Chiamata per ricavare i "Ripiani"
  shelvesModule.getShelves(props.config.product.id)
  // Chiamata per ricavare i "Contenitori"
  casesModule.getCases(props.config.product.id)
}
// Chiamata per ricavare i "Colori"
colorsModule.getColors()
// Chiamata per ricavare le "Texture"
texturesModule.getTextures()
// Chiamata per ricavare i "Consigli" già letti
tipsModule.getCookies()

const shelves = computed(() => shelvesModule.currentElementVariantsList )

const cases = computed(() => casesModule.currentElementVariantsList )

const attachableVariants = computed(() => {
  return {
    shelf: shelves.value,
    case: cases.value
  }
})

const selectedProduct = computed(() => productsModule.selectedProduct)

const selectedOption = computed(() => optionsModule.selected)

const isEditingRoom = computed(() => selectedOption.value.id === 2)

const canEdit = computed(() => {
  return !props.config.shared || (props.config.shared && import.meta.env.DEV)
})

const mainButtonLabel = computed(() => {
  return selectedElement.value.isEdit ? 'Elimina elemento' : 'Termina inserimento'
})

const closeRoomSettings = () => {
  optionsModule.resetSelectedOption()
}

const closeElementSettings = () => {
  selectedElement.value = null
  configurator.removeSelection()
}

const destroyElement = () => {
  selectedElement.value.destroy()
  closeElementSettings()
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

const shareProject = () => {
  showDownload.value = true
}

const openRequestQuoteForm = () => {
  requestingQuote.value = true
}

const closeRequestQuoteForm = () => {
  requestingQuote.value = false
  showDownload.value = true
}

onMounted(() => {
  // Set del prodotto selezionato in fase iniziale
  configurator.setOptions(props.config.product)
  // Apertura del consiglio iniziale
  tipsModule.setActiveTip('intro')
  // Inizializzazione del loader
  loading.value = true
  // Inizializzazione della scena
  const viewer = new Viewer(
    canvasWrapper.value,
    props.config,
    () => {
      configurator.$patch({
        viewerGetter: () => viewer,
        isReady: true,
        canShare: !props.config.shared
      })
      loading.value = false
    }
  )

  // Feed del configuratore
  viewer.setHook('getData', ({ type, id, variantId, nature }) => {
    const data = {
      obstacle: computed(() => encumbrancesModule.index),
      upright: computed(() => uprightsModule.index),
      shelf: computed(() => shelvesModule.index),
      case: computed(() => casesModule.index)
    }

    // Caricamento della variante corretta dell'elemento inserito
    if(data[type].value.length) {
      // Ricavo gli elementi con quell'ID
      let elements = data[type].value.filter(p => p.id === id)
      // Se più di un elemento ha lo stesso ID, cerco quelli che hanno una variante con lo stesso ID
      const el = elements.length > 1 ? elements.find((product) => {
        return product.variants.some(variant => variant.id === variantId)
      }) : elements[0]
      // Se non ho nessuna variante ritorno l'elemento stesso
      // console.log('variantId:', variantId, 'element:', el, 'nature:', nature)
      if (!variantId) return el
      // Altrimenti carico la variante con quell'ID
      return { ...el.variants.find(v => v.id === variantId && v.nature === nature), id, variantId }
    }
  })

  viewer.setHook('selectElement', (element) => {
    //console.log("selezione dell'elemento:", element)
    selectedElement.value = element
    optionsModule.resetSelectedOption()
  })

  viewer.setHook('removeSelectedElement', () => {
    selectedElement.value = null
  })

  viewer.setHook('searchForElementVariant', ({ id, type, width, isChanged }) => {
    // L'elemento può essere posizionato in quanto la variante per la larghezza in questione non esiste a Database.
    let variantExists = false

    fittingElement.value = ref(selectedElement.value).value

    if(fittingElement.value.config.nature === 'metallo') {
      selectedElement.value.config.material.texture = null
    }
    // Se sono già stati caricati elementi di questa tipologia
    if(attachableVariants.value[type]?.length) {
      // Ricerca della variante dell'elemento che ha larghezza pari alla distanza tra i montanti in questione e profondità decisa dall'utente
      if(attachableVariants.value[type].some((variant) => selectedElement.value && variant.width === parseInt(width) && variant.depth === selectedElement.value.config?.depth && (selectedElement.value.config.texture ? variant.texture === selectedElement.value.config.texture : true))) {
        let elementId = selectedElement.value.id
        var foundElement = attachableVariants.value[type].find((variant) => variant.width === parseInt(width) && variant.depth === selectedElement.value.config.depth && (selectedElement.value.config.texture ? variant.texture === selectedElement.value.config.texture : true))
        if(foundElement) {
          //console.log('width between uprights:', width, 'foundElement:', foundElement, 'isChanged:', isChanged)
          // Evita l'aggiornamento del componente se non è cambiata la distanza tra i montanti
          if(isChanged) {
            fittingElement.value.variantId = foundElement.id
            fittingElement.value.config = { ...selectedElement.value.config, ...foundElement, id: elementId, variantId: foundElement.id }
            
            fittingElement.value.config.material = selectedElement.value.config.material
            //console.log('è cambiata la distanza tra i montanti', fittingElement.value, selectedElement.value)
          }
          variantExists = true
        }
      } else {
        variantExists = false
      }
    }
    return variantExists
  })

  viewer.setHook('checkUndoRedo', ({ canUndo, canRedo }) => {
    configurator.$patch({ canUndo, canRedo })
  })
})

// Funzione per svuotare la stanza
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