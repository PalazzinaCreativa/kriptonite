<script setup>
import { computed, defineProps, defineAsyncComponent } from 'vue'
import { capitalize } from '../utils/capitalize'
  
const icon = computed(() => defineAsyncComponent(() => import(`./icons/${capitalize(props.option.icon)}.vue`)))

const props = defineProps(['index', 'option', 'config', 'is-animating'])
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
</script>

<template>
  <div class="flex gap-12 items-center">
    <component v-if="props.option.icon && icon" :is="icon" class="text-white w-14 h-auto" />
    <div class="w-full bg-white/40 group relative my-4 cursor-pointer" ref="button">
      <div :class="props.isAnimating ? 'w-full' : 'group-hover:w-2 w-1'" class="h-full absolute bg-white transform left-0 top-0 origin-left group-focus:w-full transition-all duration-300 ease-power-out z-1"></div>
      <div class="flex py-4 pl-6 text-m font-regular relative z-2">
        <div class="text-black/40" v-if="alphabet[props.index]" v-text="alphabet[props.index]"/>
        <div class="ml-8 text-black">{{ props.option.label }}<slot /></div>
      </div>
    </div>
  </div>
</template>