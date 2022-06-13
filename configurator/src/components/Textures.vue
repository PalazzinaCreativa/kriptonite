<template>
  <div v-if="textures.length" class="my-12">
    <div class="uppercase text-center w-full" v-text="title" />
    <div class="flex flex-wrap justify-center gap-12 my-8">
      <div v-for="texture in textures" :key="`texture-${texture.id}`" class="flex flex-col items-center justify-center cursor-pointer max-w-[150px]" @click="setMaterial(texture)">
        <div class="border-2 w-14 h-14 rounded-full" :class="selectedTexture && selectedTexture.id === texture.id ? 'border-2 border-yellow' : 'border-dark-gray'" :style="`background: url('${texture.thumb}') center center / cover`"></div>
        <div class="text-center mt-3 w-full" v-text="texture.label" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import useTexturesStore from '../stores/textures';

const texturesModule = useTexturesStore()
const type = computed(() => props.entity ? `${props.entity}Index` : 'index')
const textures = computed(() => texturesModule[type.value])
const selectedTexture = computed(() => texturesModule.selected)

const props = defineProps(['element', 'title', 'entity'])
const emits = defineEmits(['setTexture'])

const title = computed(() => props.title || 'Essenza')

const setMaterial = (texture) => {
  texturesModule.setSelectedTexture(texture)
  let material = { ...props.element.config.material, texture: texture, nature: props.element.config.nature ?? 'metallo' }
  emits('setTexture', material)
}

if(textures.value && textures.value.length) {
  // Se non ho già impostato una texture
  if(!props.element.config?.material?.texture) {
    // Se ho già dato una texture ad un altro elemento in precedenza
    if(Object.keys(selectedTexture.value).length) {
      setMaterial(selectedTexture.value)
    } else {
      // imposto la texture definita a database
      if(props.element.config?.texture) {
        let startingTexture = textures.value.find((texture) => props.element.config.texture === texture.id)
        setMaterial(startingTexture)
      }
    }
  }
}
</script>