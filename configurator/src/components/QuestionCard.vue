<template>
  <div class="flex gap-12 items-center" v-if="isVisible">
    <div class="flex w-full bg-white group relative my-4 min-h-[200px] cursor-pointer" :class="props.option.description ? 'flex-nowrap' : 'flex-wrap'" ref="button">
      <div v-if="props.option.image" class="w-full">
        <img class="h-full object-cover w-full" :class="props.option.description ? '' : 'max-h-[200px]'" :src="props.option.image" width="200" height="200" :alt="props.option.key"/>
      </div>
      <div class="flex flex-wrap px-6 gap-4 w-full" :class="props.option.description ? 'py-10' : 'py-6'">
        <div class="font-regular text-black text-m w-full">{{ props.option.label }}<slot /></div>
        <div v-if="props.option.description" class="text-xs font-light w-full" v-html="props.option.description" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineAsyncComponent } from 'vue'
import { capitalize } from '../utils/capitalize'
import lget from 'lodash.get'
  
const icon = computed(() => defineAsyncComponent(() => import(`./icons/${capitalize(props.option.icon)}.vue`)))

const props = defineProps(['index', 'option', 'config', 'fastForward'])

const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

const isVisible = computed(() => {
  return !props.option.showIf || props.option.showIf.values.includes(lget(props.config, props.option.showIf.entity))
})
</script>