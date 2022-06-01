<template>
  <div tip class="bg-white border-2 border-yellow rounded-lg py-8 px-16 max-w-[500px]">
    <div tip-content class="flex gap-4 w-full">
      <Lamp class="text-gray mt-2 w-60" />
      <div tip-text class="text-black mb-8" v-text="'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Cras ultricies ligula sed magna dictum porta. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Donec sollicitudin molestie malesuada.'" />
    </div>
    <div tip-action class="flex items-center justify-center w-full">
      <Btn class="bg-yellow w-full rounded-full" label="Ho capito" @click="close" />
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

import Lamp from '@/components/icons/Lamp.vue'
import Btn from '@/components/forms/Button.vue'

const emits = defineEmits(['close'])

const close = () => {
  emits('close')
}
</script>