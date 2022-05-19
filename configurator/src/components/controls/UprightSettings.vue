<template>
  <div element-settings class="flex flex-col justify-center gap-10 mx-auto">
    <div class="text-center w-full">
      <img src="http://placehold.jp/150x150.png" width="100" height="100" alt="" class="bg-light-gray w-32 h-32 object-cover mx-auto"/>
    </div>
    <div variants class="flex flex-wrap justify-center gap-6">
      <div v-for="(variant, index) in variants" :key="`variant-${index}`" @click="configurator.addElement({ ...variant, id: props.element.id, variantId: variant.id })">
        <div class="border border-light-gray cursor-pointer px-8 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400" :class="isSelected(variant.id) ? 'bg-yellow' : 'bg-white'" v-text="variant.height" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, defineProps } from 'vue';
  import { useConfiguratorStore } from '@/stores/configurator'
  import useUprightsStore from '@/stores/uprights'

  const configurator = useConfiguratorStore()
  const uprightsModule = useUprightsStore()
  uprightsModule.getVariants(props.element.id)
  
  const variants = computed(() => uprightsModule.variants)
  const props = defineProps(['element'])

  const isSelected = (variantId) => props.element.variantId === variantId
</script>