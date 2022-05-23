<template>
  <div element-settings class="flex flex-col justify-center gap-10 mx-auto">
    <div class="text-center w-full">
      <img src="https://placehold.jp/150x150.png" width="100" height="100" alt="" class="bg-light-gray w-32 h-32 object-cover mx-auto"/>
    </div>
    <div variants class="flex flex-wrap justify-center gap-6">
      <div v-for="(variant, index) in variants" :key="`variant-${index}`" @click="configurator.addElement({ ...variant, id: props.element.id, material: { ...element.config.material, id: element.config.texture }, variantId: variant.id })">
        <div class="border border-light-gray cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400" :class="isSelected(variant.id) ? 'bg-yellow' : 'bg-white'" v-text="variant.depth" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, watch, defineProps } from 'vue';
  import { useConfiguratorStore } from '@/stores/configurator'
  import useCasesStore from '@/stores/cases'

  const configurator = useConfiguratorStore()
  const casesModule = useCasesStore()
  const getVariants = () => {
    casesModule.getVariants(props.element.id, { texture: props.element.config.material.id })
  }
  getVariants()
  
  const props = defineProps(['element'])

  const variants = computed(() => casesModule.variants)

  //const material = { ...element.config.material, id: element.config.texture }

  watch(props.element, async (newValue, oldValue) => {
    getVariants()

    // Controllo il valore
    let textureRelativeProduct = variants.value.length ? variants.value.find((variant) => {
      return variant.depth === props.element.config.depth
    }) : null

    if(textureRelativeProduct) {
      configurator.addElement({ ...textureRelativeProduct, id: props.element.id, variantId: textureRelativeProduct.id })
    }
  })

  const isSelected = (variantId) => props.element.variantId === variantId
</script>