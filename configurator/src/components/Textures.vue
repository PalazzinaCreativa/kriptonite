<template>
  <div v-if="textures.length" class="my-12">
    <div class="uppercase text-center w-full" v-text="title" />
    <div class="flex flex-wrap justify-center gap-12 my-8">
      <div v-for="texture in textures" :key="`texture-${texture.id}`" class="flex flex-col items-center justify-center cursor-pointer max-w-[150px]" @click="setMaterial(texture)">
        <div class="border-2 w-14 h-14 overflow-hidden relative rounded-full" :class="isActive(texture) ? 'border-2 border-yellow' : 'border-dark-gray'">
          <img v-if="texture.thumb" class="absolute top-0 left-0 w-full h-full object-cover" :src="texture.thumb" width="100" height="100" :alt="texture.name" />
        </div>
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
const materialTexture = computed(() => props.element?.config?.material?.texture)

const setMaterial = (texture) => {
  if(props.entity !== 'room') {
    texturesModule.setSelectedTexture(texture)
  }
  let material = props.entity === 'room' ? texture : { ...props.element.config.material, texture: texture, nature: props.element.config.nature || 'metallo' }
  emits('setTexture', material)
}

const isActive = (texture) => {
  return props.entity === 'room' ? props.element.floorType?.id === texture.id : materialTexture?.value.id === texture.id
}

if(textures.value && textures.value.length) {
  if(props.entity !== 'room') {
    // Se non ho già impostato una texture
    if(!materialTexture.value) {
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
}
</script>