<script setup>
import { ref, computed, onMounted, defineProps, defineAsyncComponent } from 'vue'
  
const icon = computed(() => defineAsyncComponent(() => import(`./icons/${capitalize(props.option.icon)}.vue`)))

const props = defineProps(['index', 'option', 'config'])
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<template>
  <div class="flex gap-12 items-center">
    <div class="flex w-full bg-white group relative my-4 cursor-pointer" ref="button">
      <div v-if="props.option.image" class="w-full">
        <img class="h-full object-cover w-full" :src="`/assets/images/${props.option.image}`" width="200" height="200" :alt="props.option.image"/>
      </div>
      <div class="flex flex-wrap py-10 px-6 w-full">
        <div class="font-regular text-black text-m mb-4 w-full">{{ props.option.label }}<slot /></div>
        <div v-if="props.option.description" class="text-xs font-light w-full" v-html="props.option.description" />
      </div>
    </div>
  </div>
</template>