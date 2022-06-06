<template>
  <div tip class="bg-white border-2 border-yellow rounded-lg py-8 px-12 max-w-[300] lg:max-w-[500px]">
    <div tip-content class="flex gap-4 w-full">
      <div class="mt-1 w-6 h-auto">
        <Lamp class="text-dark-gray w-full h-auto" />
      </div>
      <div v-if="tip.text" tip-text class="text-black mb-8 w-full" v-html="tip.text" />
    </div>
    <div v-if="btnLabel" tip-action class="flex items-center justify-center w-full">
      <Btn class="bg-yellow rounded-full" :label="btnLabel" @click="close" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

import Lamp from '@/components/icons/Lamp.vue'
import Btn from '@/components/forms/Button.vue'

const props = defineProps(['tip'])
const emits = defineEmits(['close'])

const btnLabel = computed(() => props.tip.buttonLabel || 'Ho capito')

const close = () => {
  emits('close', props.tip)
}
</script>