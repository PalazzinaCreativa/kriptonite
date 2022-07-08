<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full z-5">
    <div configuration-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-if="mainElement" v-text="mainElement.name" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div configuration-content class="grow my-16 w-full">
      <div class="py-4 px-6">
        <div v-if="mainElement" class="py-8">
          <img v-if="mainElement.image" :src="mainElement.image.url" :width="mainElement.image.width" :height="mainElement.image.height" :alt="mainElement.image.alternativeText" class="w-[200px] h-full max-h-[180px] object-contain mx-auto my-4" />
          <img v-else src="https://placehold.jp/150x150.png" width="100" height="100" alt="" class="bg-light-gray w-32 h-32 object-cover mx-auto"/>
        </div>
        <div v-if="elementSettingsInstance">
          <div class="flex flex-wrap my-4 w-full">
            <component :is="elementSettingsInstance" :key="`${JSON.stringify(currentElement.config)}`" :element="currentElement" @input="updateDimensions"></component>
          </div>
        </div>
          <Textures v-if="currentElement.config.variantId && textures.length && currentElement.config.texture" :key="`${JSON.stringify(currentElement.config.material)}`" :title="texturesTitle" :element="currentElement" @setTexture="setMaterial"/>
          <Colors v-if="currentElement.config.variantId && colors.length" :key="`${JSON.stringify(currentElement.config.material)}`" :title="colorsTitle" :element="currentElement" @setColor="setMaterial" />
      </div>
      <div class="flex items-center justify-center">
        <span v-if="currentElement.config.variantId" class="bg-black cursor-pointer hover:bg-opacity-80 text-white px-6 py-2 rounded-full mt-4 mx-auto inline-block" @click="addToAll">Applica finitura a tutti</span>
      </div>
    </div>
    <div configuration-actions class="flex fixed bottom-0 left-0 w-full"></div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw, defineAsyncComponent, onMounted } from 'vue';
import { capitalize } from '@/utils/capitalize'
import Close from '@/components/icons/Close.vue'
import { useConfiguratorStore } from '@/stores/configurator';
import useEncumbrancesStore from '@/stores/encumbrances';
import useUprightsStore from '@/stores/uprights';
import useShelvesStore from '@/stores/shelves';
import useCasesStore from '@/stores/cases';
import useColorsStore from '@/stores/colors';
import useTexturesStore from '@/stores/textures';
import Colors from '@/components/Colors.vue'
import Textures from '@/components/Textures.vue'
import Btn from '@/components/forms/Button.vue'

const props = defineProps(['element'])
const emits = defineEmits(['close'])

const configurator = useConfiguratorStore()
const encumbrancesModule = useEncumbrancesStore()
const uprightsModule = useUprightsStore()
const shelvesModule = useShelvesStore()
const casesModule = useCasesStore()
const colorsModule = useColorsStore()
const texturesModule = useTexturesStore()

const elementSettingsInstance = computed(markRaw(() => defineAsyncComponent(() => import(/* @vite-ignore */`./${capitalize(currentElement.value.config.type)}Settings.vue`))))

const encumbrances = encumbrancesModule.index
const uprights = uprightsModule.index
const shelves = shelvesModule.index
const cases = casesModule.index
const colors = colorsModule.index
const textures = texturesModule.index

const data = {
  obstacle: encumbrances,
  upright: uprights,
  shelf: shelves,
  case: cases
}

const textureFinishings = ref([
  { type: 'shelf', nature: ['legno'], label: 'finitura essenza piano' },
  { type: 'case', nature: ['legno'], label: 'finitura essenza contenitore' },
])

const colorFinishings = ref([
  { type: 'shelf', nature: ['metallo'], label: 'finitura piano' },
  { type: 'case', nature: ['metallo'], label: 'finitura contenitore' },
  { type: 'shelf', nature: ['legno'], label: 'finitura supporti / virola' },
  { type: 'case', nature: ['legno'], label: 'finitura supporti / virola / maniglie' }
])

const currentElement = computed(() => props.element)
// Ricavo e stampo il nome del componente e non della variante
const mainElement = computed(() => {
  return currentElement.value.config?.type && data[currentElement.value.config.type].length ? 
  data[currentElement.value.config.type].find((item) => {
    //console.log('currentElement:', currentElement.value.config)
    return (currentElement.value.config.type !== 'obstacle' && item.variants?.length) ?
      item.variants.some((variant) => variant.id === currentElement.value.config.variantId && variant.sku === currentElement.value.config.sku) :
      currentElement.value.config.id === item.id
  }) : null
})

const selectedMaterial = computed(() => {
  return { ...colorsModule.selected, texture: texturesModule.selected, color: colorsModule.selected.code, nature: currentElement.value.config.nature }
})

const texturesTitle = computed(() => {
  let currentFinishing = textureFinishings.value.find((finishing) => {
    return finishing.type === currentElement.value.config.type && finishing.nature.includes(currentElement.value.config.nature)
  })
  return currentFinishing ? currentFinishing.label : null
})

const colorsTitle = computed(() => {
  let currentFinishing = colorFinishings.value.find((finishing) => {
    return finishing.type === currentElement.value.config.type && finishing.nature.includes(currentElement.value.config.nature)
  })
  return currentFinishing ? currentFinishing.label : null
})

const obstacleDimensions = ref({
  width: currentElement.value.getSize().width,
  height: currentElement.value.getSize().height,
  depth: currentElement.value.getSize().depth
})

const setMaterial = (material) => {
  currentElement.value.setMaterial({ ...currentElement.value.config?.material, ...material })
  configurator.updateConfig()
}

const addToAll = () => {
  currentElement.value.setSiblingsMaterial(selectedMaterial.value)
  configurator.updateConfig()
}

const close = () => {
  configurator.removeSelection()
  emits('close')
}

const updateDimensions = (dimensions) => {
  currentElement.value.config = dimensions
  currentElement.value.setSize(currentElement.value.config)
}

const addLabel = currentElement.value.isEdit ? '' : 'Aggiungi'

const destroyLabel = currentElement.value.isEdit ? 'Elimina elemento' : 'Termina inserimento'

const addElement = () => {
  updateDimensions(currentElement.value.config)
  close()
}

const handleCancel = () => {
  if(currentElement.value.isEdit) {
    destroy()
  }
  close()
}

const destroy = () => {
  currentElement.value.destroy()
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
</style>