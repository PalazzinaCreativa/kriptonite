<template>
  <div element-settings class="flex flex-col justify-center gap-10 w-[300px] mx-auto">
    <NumberField class="w-full" v-model="element.config.width" name="width" label="Larghezza" append="cm"/>
    <NumberField class="w-full" v-model="element.config.height" name="height" label="Altezza" append="cm"/>
    <NumberField class="w-full" v-model="element.config.depth" name="depth" label="Profondità" append="cm"/>
  </div>
</template>

<script setup>
  import { ref, defineProps } from 'vue';
  import NumberField from '@/components/forms/NumberField.vue'

  const props = defineProps(['element'])
</script>