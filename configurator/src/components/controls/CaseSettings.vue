<template>
  <div element-settings class="flex flex-col justify-center gap-10 mx-auto">
    <div variants>
      <div class="uppercase text-center mb-6 w-full">Profondità (cm)</div>
      <div v-if="isVisible" class="flex flex-wrap justify-center gap-6">
        <div v-for="(variant, index) in variants" :key="`variant-${index}`" @click="addElement(variant)">
          <div class="border border-light-gray cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400" :class="isSelected(variant.id) ? 'bg-yellow' : 'bg-white'" v-text="variant.depth" />
        </div>
      </div>
      <div v-else class="border border-light-gray bg-yellow cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400">
        <div v-if="element.config.depth" v-text="element.config.depth" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, defineProps } from 'vue';
  import { useConfiguratorStore } from '@/stores/configurator'
  import useTexturesStore from '@/stores/textures';
  import useCasesStore from '@/stores/cases'

  const configurator = useConfiguratorStore()
  const texturesModule = useTexturesStore()
  const casesModule = useCasesStore()

  const textures = computed(() => texturesModule.index)
  const selectedTexture = computed(() => texturesModule.selected)

  const props = defineProps(['element'])
  
  const variants = computed(() => casesModule.variants)

  const getVariants = () => {
    casesModule.getVariants(props.element.id, props.element.config.texture)
  }

  const isVisible = computed(() => {
    return !props.element.isEdit
  })

  const setRelativeProduct = () => {
    // Se l'elemento ha una texture assegnata nel CMS
    if(props.element.config.texture) {
      // Al cambio delle opzioni dell'elemento, imposto la texture già impostata in precedenza
      let textureRelativeProduct = variants.value.length ? variants.value.find((variant) => {
        return variant.depth === props.element.config.depth
      }) : null

      if(textureRelativeProduct) {
        configurator.addElement({ ...textureRelativeProduct, id: props.element.id, material: { ...props.element.config.material, ...{ texture: selectedTexture.value } }, variantId: textureRelativeProduct.id })
      }
    }
  }

  const addElement = (variant) => {
    let material = props.element.config.texture ? { ...props.element.config.material, texture: { id: props.element.config.material.texture.id } } : props.element.config.material
    configurator.addElement({ ...variant, id: props.element.id, material, variantId: variant.id })
  }

  getVariants()

  if(!props.element.isEdit) {
    setRelativeProduct()
  }

  const isSelected = (variantId) => props.element.variantId === variantId
</script>