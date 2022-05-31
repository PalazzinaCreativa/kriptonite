<template>
  <div v-if="element.config" class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full z-5">
    <div configuration-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-if="mainElement" v-text="mainElement.name" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div configuration-content class="grow my-16 w-full">
      <div class="py-4 px-6">
        <div class="py-8">
          <img v-if="mainElement.image" :src="mainElement.image.url" :width="mainElement.image.width" :height="mainElement.image.height" :alt="mainElement.image.alternativeText" class="w-[200px] h-full object-cover m-auto my-4" />
          <img v-else src="https://placehold.jp/150x150.png" width="100" height="100" alt="" class="bg-light-gray w-32 h-32 object-cover mx-auto"/>
        </div>
        <div v-if="elementSettingsInstance">
          <div class="flex flex-wrap my-4 w-full">
            <component :is="elementSettingsInstance" :element="element" :key="JSON.stringify(element.config)" @update="updateElement" @input="updateDimensions"></component>
          </div>
        </div>
        <Textures v-if="element.config.variantId && textures.length && element.config.texture" :key="`texture-${JSON.stringify(element.config?.material?.texture)}`" :element="element" @setTexture="setMaterial"/>
        <Colors v-if="element.config.variantId && colors.length" :element="element" :key="`color-${JSON.stringify(element.config?.material?.id)}`" @setColor="setMaterial" />
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

const elementSettingsInstance = computed(markRaw(() => defineAsyncComponent(() => import(`./${capitalize(props.element.config.type)}Settings.vue`))))

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

// Ricavo e stampo il nome del componente e non della variante
const mainElement = computed(() => {
  return data[props.element.config.type].length ? data[props.element.config.type].find((item) => {
    return item.id === props.element.config.id
  }) : null
})

const selectedMaterial = computed(() => {
  return { ...colorsModule.selected, texture: texturesModule.selected, color: colorsModule.selected.code, nature: props.element.config.nature }
})

var elementConfig = ref(props.element.config)

const obstacleDimensions = ref({
  width: props.element.getSize().width,
  height: props.element.getSize().height,
  depth: props.element.getSize().depth
})

const setMaterial = (material) => {
  props.element.setMaterial({ ...props.element.config?.material, ...material })
  configurator.updateConfig()
}

const updateElement = (element) => {
  props.element.updateElement(element)
  configurator.updateConfig()
}

const addToAll = () => {
  //const material = materials.value.find(m => m.id === props.element.config.material.id)
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

const addLabel = props.element.isEdit ? '' : ''

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