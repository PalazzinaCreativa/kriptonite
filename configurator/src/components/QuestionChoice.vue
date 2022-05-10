<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['index', 'option', 'config'])
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
</script>

<template>
  <div class="w-full bg-white/40 group relative my-4 cursor-pointer" ref="button">
    <div class="h-full w-1 absolute bg-white transform left-0 top-0 origin-left group-hover:w-3 group-focus:w-2 transition-all duration-300 ease-power-out"></div>
    <div class="flex py-4 pl-6 text-m font-regular">
      <div class="text-black/40" v-if="alphabet[props.index]" v-text="alphabet[props.index]"/>
      <div class="ml-8 text-black">{{ props.option.label }}<slot /></div>
    </div>
  </div>
</template>