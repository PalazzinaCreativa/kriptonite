<template>
  <div element-settings class="flex flex-col justify-center gap-10 mx-auto">
    <div variants>
      <div class="uppercase text-center mb-6 w-full">Altezza (cm)</div>
      <div v-if="isVisible">
        <div v-if="!element.isEdit" class="flex flex-wrap justify-center gap-6">
          <div v-for="(variant, index) in variants" :key="`variant-${index}`" @click="addElement(variant)">
            <div class="border border-light-gray cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400" :class="isSelected(variant.id) ? 'bg-yellow' : 'bg-white'">
              <div v-text="variant.height" />
            </div>
          </div>
        </div>
        <div v-else class="border border-light-gray bg-yellow cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400">
          <div v-if="element.config.height" v-text="element.config.height" />
        </div>
      </div>
      <div v-else>
        <div v-if="adaptiveHeight" class="border border-light-gray bg-yellow cursor-pointer px-4 py-6 min-w-[90px] text-center hover:border-yellow transform transition-all duration-400">
          <div v-text="adaptiveHeight" />
          <div class="text-xs">Adattato all'altezza della stanza</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, defineProps, defineEmits, watch } from 'vue';
  import { useConfiguratorStore } from '@/stores/configurator'
  import useUprightsStore from '@/stores/uprights'

  const configurator = useConfiguratorStore()
  const uprightsModule = useUprightsStore()
  uprightsModule.getVariants(props.element.id)

  const room = computed(() => props.element?.product?.viewer?.room)
  const productOptions = computed(() => configurator.options)
  const isVisible = computed(() => {
    return productOptions.value.type !== 'k2' || 
    (productOptions.value.type === 'k2' && productOptions.value.uprightsPosition === 'wall')
  })
  const variants = computed(() => uprightsModule.variants)
  const props = defineProps(['element'])
  const emits = defineEmits(['update'])
  const adaptiveHeight = ref(props.element?.config?.adaptiveHeight?.toFixed(2) || room?.value?.config?.dimensions?.height || props.element?.config?.height || 0)

  window.addEventListener('changeAdaptiveHeight', (event) => {
    adaptiveHeight.value = props.element?.config?.adaptiveHeight?.toFixed(2) || room?.value?.config?.dimensions?.height || props.element?.config?.height || 0
  })

  const isSelected = (variantId) => props.element.variantId === variantId

  const addElement = (variant) => {
    configurator.addElement({ ...variant, id: props.element.id, variantId: variant.id })
  }
</script>