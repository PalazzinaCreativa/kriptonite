<template>
  <div v-if="element.config" class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full z-5">
    <div configuration-header class="bg-light-gray flex items-center justify-between py-4 px-6 w-full">
      <div v-if="mainElement" v-text="mainElement.name" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div configuration-content class="grow w-full">
      <div class="py-4 px-6">
        <img v-if="element.config.image" :src="element.config.image.url" :width="element.config.image.width" :height="element.config.image.height" :alt="element.config.image.alternativeText" class="w-[200px] h-full object-cover m-auto my-4" />
        <div v-if="elementSettingsInstance">
          <div class="flex flex-wrap my-4 w-full">
            <component :is="elementSettingsInstance" :element="element" :key="`texture${props.element.config?.material?.image}`"></component>
          </div>
        </div>
        <Textures v-if="element.config.texture" :element="element" @setTexture="setMaterial"/>
        <Colors :element="element" @setColor="setMaterial" />
      </div>
      <div class="flex items-center justify-center">
        <span v-if="element.config.material" class="bg-black cursor-pointer hover:bg-opacity-80 text-white px-6 py-2 rounded-full mt-4 mx-auto inline-block" @click="addToAll">Applica finitura a tutti</span>
      </div>
    </div>
    <div configuration-actions class="flex w-full">
      <Btn class="bg-light-gray" label="Elimina elemento" @click="destroy" />
      <Btn class="bg-yellow" label="Aggiorna elemento" @click="addElement" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw, defineAsyncComponent } from 'vue';
import { capitalize } from '@/utils/capitalize'
import Close from '@/components/icons/Close.vue'
import { useConfiguratorStore } from '@/stores/configurator';
import useEncumbrancesStore from '@/stores/encumbrances';
import useUprightsStore from '@/stores/uprights';
import useShelvesStore from '@/stores/shelves';
import useCasesStore from '@/stores/cases';
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

const elementSettingsInstance = computed(markRaw(() => defineAsyncComponent(() => import(`./${capitalize(props.element.config.type)}Settings.vue`))))

const encumbrances = encumbrancesModule.index
const uprights = uprightsModule.index
const shelves = shelvesModule.index
const cases = casesModule.index

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

const materials = ref(data[props.element.config?.type][0]?.material)

const obstacleDimensions = ref({
  width: props.element.getSize().width,
  height: props.element.getSize().height,
  depth: props.element.getSize().depth
})

const setMaterial = (material) => {
  props.element.setMaterial({ ...props.element.config?.material, ...material })
  configurator.updateConfig()
}

const addToAll = () => {
  const material = materials.value.find(m => m.id === props.element.config.material.id)
  props.element.setSiblingsMaterial(material)
  configurator.updateConfig()
}

const close = () => {
  configurator.removeSelection()
  emits('close')
}

const addElement = () => {
  props.element.setSize(props.element.config)
  emits('close')
}

const destroy = () => {
  props.element.destroy()
  close()
}
</script>