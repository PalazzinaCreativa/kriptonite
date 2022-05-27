<template>
  <div v-if="textures.length" class="my-12">
    <div class="uppercase text-center w-full" v-text="title" />
    <div class="flex flex-wrap justify-center gap-12 my-8">
      <div v-for="texture in textures" :key="`texture-${texture.id}`" class="flex flex-col items-center justify-center cursor-pointer max-w-[150px]" @click="setMaterial(texture)">
        <div class="border-2 w-14 h-14 rounded-full" :class="selectedTexture && selectedTexture.id === texture.id ? 'border-2 border-yellow' : 'border-dark-gray'" :style="`background: url('${texture.thumb}') center center / cover`"></div>
        <div class="text-center mt-3 w-full" v-text="texture.name" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import useTexturesStore from '../stores/textures';

const texturesModule = useTexturesStore()
const type = computed(() => props.entity ? `${props.entity}Index` : 'index')
const textures = texturesModule[type.value]
const selectedTexture = computed(() => texturesModule.selected)

const props = defineProps(['element', 'title', 'entity'])
const emits = defineEmits(['setTexture'])

const title = computed(() => props.title || 'Finitura')


const setMaterial = (texture) => {
  texturesModule.setSelectedTexture(texture)
  if(props.element.config?.nature) {
    emits('setTexture', { texture: texture, nature: props.element.config.nature })
  } else {
    emits('setTexture', texture)
  }
}

// Se non ho già impostato una texture
if(!props.element.config.material?.texture) {
  // imposto la texture di default del modello a database
  if(props.element.config?.texture && textures && textures.length) {
    let startingTexture = textures.find((texture) => props.element.config.texture === texture.id)
    setMaterial(startingTexture)
  }
} else {
  // altrimenti imposto quella assegnata al modello in precedenza
  texturesModule.setSelectedTexture(props.element.config.material.texture)
}
</script>