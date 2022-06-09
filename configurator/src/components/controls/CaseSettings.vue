<template>
  <div element-settings class="flex flex-col justify-center gap-10 mx-auto">
    <div variants class="flex flex-wrap justify-center gap-6">
      <div v-for="(variant, index) in variants" :key="`variant-${index}`" @click="configurator.addElement({ ...variant, id: props.element.id, material: { ...element.config.material, id: element.config.texture }, variantId: variant.id })">
        <div class="border border-light-gray cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400" :class="isSelected(variant.id) ? 'bg-yellow' : 'bg-white'" v-text="variant.depth" />
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

  const getVariants = () => {
    if(selectedTexture?.value?.id) {
      casesModule.getVariants(props.element.id, { texture: selectedTexture.value.id })
    }
  }

  //const material = { ...element.config.material, id: element.config.texture }

  const setRelativeProduct = () => {
    // Cambiando la texture imposto il prodotto con la stessa profondità che ha la nuova texture
    let textureRelativeProduct = variants.value.length ? variants.value.find((variant) => {
      return variant.depth === props.element.config.depth
    }) : null

    if(textureRelativeProduct) {
      configurator.addElement({ ...textureRelativeProduct, material: { ...props.element.config.material, ...selectedTexture.value }, id: props.element.id, variantId: textureRelativeProduct.id })
    }
  }

  const variants = computed(() => casesModule.variants)

  getVariants()
  //setRelativeProduct()

  const isSelected = (variantId) => props.element.variantId === variantId
</script>