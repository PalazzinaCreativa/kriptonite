<template>

  <form class="flex flex-wrap my-4" @submit.prevent="props.element.setSize(element.config)">
    <TextField v-model="width" name="width" label="Larghezza" placeholder="cm"/>
    
    <div class="m-4">
      Larghezza
      <input type="number" class="border border-gray" v-model="element.config.width">cm
    </div>
    <div class="m-4">
      Altezza
      <input type="number" class="border border-gray" v-model="element.config.height">cm
    </div>
    <div class="m-4">
      Profondità
      <input type="number" class="border border-gray" v-model="element.config.depth">cm
    </div>
    <button type="submit" class="shadow-lg hover:shadow-xl">Imposta</button>
  </form>
</template>

<script setup>
  import { ref, defineProps } from 'vue';
  import TextField from '@/components/forms/TextField.vue'

  const props = defineProps(['element'])

  const width = ref(0)
</script>