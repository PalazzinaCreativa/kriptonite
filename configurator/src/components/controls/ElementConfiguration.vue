<template>
  <div v-if="element.config" class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full z-5">
    <div configuration-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-if="mainElement" v-text="mainElement.name" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div v-if="elementIsMounted" configuration-content class="grow my-16 w-full">
      <div class="py-4 px-6">
        <div v-if="mainElement" class="py-8">
          <img v-if="mainElement.image" :src="mainElement.image.url" :width="mainElement.image.width" :height="mainElement.image.height" :alt="mainElement.image.alternativeText" class="w-[200px] h-full max-h-[180px] object-contain mx-auto my-4" />
          <img v-else src="https://placehold.jp/150x150.png" width="100" height="100" alt="" class="bg-light-gray w-32 h-32 object-cover mx-auto"/>
        </div>
        <div v-if="elementSettingsInstance">
          <div class="flex flex-wrap my-4 w-full">
            <component :is="elementSettingsInstance" :element="element" @input="updateDimensions"></component>
          </div>
        </div>
        <Textures v-if="element.config.variantId && textures.length && element.config.texture" :key="`${JSON.stringify(element.config)}`" :element="element" @setTexture="setMaterial"/>
        <Colors v-if="element.config.variantId && colors.length" :element="element" :key="`${JSON.stringify(element.config)}`" @setColor="setMaterial" />
      </div>
      <div class="flex items-center justify-center">
        <span v-if="element.config.variantId" class="bg-black cursor-pointer hover:bg-opacity-80 text-white px-6 py-2 rounded-full mt-4 mx-auto inline-block" @click="addToAll">Applica finitura a tutti</span>
      </div>
    </div>
    <div configuration-actions class="flex fixed bottom-0 left-0 w-full">
      <Btn v-if="destroyLabel" class="bg-light-gray w-full" :label="destroyLabel" @click="handleCancel" />
      <Btn v-if="addLabel" class="bg-yellow w-full" :label="addLabel" @click="addElement" />
    </div>
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

const elementSettingsInstance = computed(markRaw(() => defineAsyncComponent(() => import(/* @vite-ignore */`./${capitalize(props.element.config.type)}Settings.vue`))))

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

const elementIsMounted = ref(false)

const elementConfig = ref(props.element.config)

// Ricavo e stampo il nome del componente e non della variante
const mainElement = computed(() => {
  return data[elementConfig.value.type].length ? data[elementConfig.value.type].find((item) => {
    return elementConfig.value.type !== 'obstacle' && item.variants?.length ?
      item.variants.some((variant) => variant.id === elementConfig.value.variantId && variant.sku === elementConfig.value.sku) :
      elementConfig.value.id === item.id
  }) : null
})

const selectedMaterial = computed(() => {
  return { ...colorsModule.selected, texture: texturesModule.selected, color: colorsModule.selected.code, nature: props.element.config.nature }
})

const obstacleDimensions = ref({
  width: props.element.getSize().width,
  height: props.element.getSize().height,
  depth: props.element.getSize().depth
})

const setMaterial = (material) => {
  props.element.setMaterial({ ...props.element.config?.material, ...material })
  configurator.updateConfig()
}

onMounted(() => {
  elementIsMounted.value = true
})

const updateElement = (element) => {
  /* props.element.updateElement(element)
  configurator.updateConfig() */
}

/* if(props.element.config.texture && textures.length) {
  let startingTexture = textures.find((texture) => {
    return props.element.config.texture === texture.id
  })
  setMaterial(startingTexture)
} */

const addToAll = () => {
  props.element.setSiblingsMaterial(selectedMaterial.value)
  configurator.updateConfig()
}

const close = () => {
  configurator.removeSelection()
  emits('close')
}

const updateDimensions = (dimensions) => {
  elementConfig.value = dimensions
  props.element.setSize(elementConfig.value)
}

const addLabel = props.element.isEdit ? '' : 'Aggiungi'

const destroyLabel = props.element.isEdit ? 'Elimina elemento' : 'Termina inserimento'

const addElement = () => {
  updateDimensions(elementConfig.value)
  close()
}

const handleCancel = () => {
  if(props.element.isEdit) {
    destroy()
  }
  close()
}

const destroy = () => {
  props.element.destroy()
}
</script>