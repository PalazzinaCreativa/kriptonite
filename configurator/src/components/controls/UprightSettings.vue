<template>
  <div v-if="!isGroundToTop" element-settings class="flex flex-col justify-center gap-10 mx-auto">
    <div variants class="flex flex-wrap justify-center gap-6">
      <div v-for="(variant, index) in variants" :key="`variant-${index}`" @click="chooseVariant(variant)">
        <div class="border border-light-gray cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400" :class="isSelected(variant.id) ? 'bg-yellow' : 'bg-white'" v-text="variant.height" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, defineProps, defineEmits } from 'vue';
  import { useConfiguratorStore } from '@/stores/configurator'
  import useUprightsStore from '@/stores/uprights'

  const configurator = useConfiguratorStore()
  const uprightsModule = useUprightsStore()
  uprightsModule.getVariants(props.element.id)
  
  const productOptions = computed(() => configurator.options)
  const isGroundToTop = computed(() => productOptions.value.uprightsPosition === 'standalone')
  const variants = computed(() => uprightsModule.variants)
  const props = defineProps(['element'])
  const emits = defineEmits(['update'])

  const isSelected = (variantId) => props.element.variantId === variantId

  const chooseVariant = (variant) => {
    // Se sto modificando un elemento già inserito
    if(props.element.hasOwnProperty('index')) {
      emits('update', { ...variant, id: props.element.id, variantId: variant.id })
    } else {
      // Se sto inserendo un nuovo elemento
      configurator.addElement({ ...variant, id: props.element.id, variantId: variant.id })
    }
  }
</script>