<template>
  <div question class="font-light w-full h-full flex">
    <div class="w-1/2 h-full flex flex-col items-center justify-center">
      <div class="w-full max-w-[21.875rem]">
        <slot name="progress" />
        <div v-if="slots.question" class="text-xl">
          <slot name="question" />
        </div>
        <div v-if="slots.paragraph" class="mt-10">
          <slot name="paragraph" />
        </div>
      </div>
    </div>
    <div class="w-1/2 h-full bg-yellow flex flex-col items-center justify-center relative">
      <div v-if="slots.options" class="w-full max-w-[21.875rem]">
        <slot name="options" />
      </div>
      <div v-if="slots.nav" class="flex flex-wrap items-center py-4 w-full">
        <slot name="nav"/>
      </div>
      <div v-if="slots.footer" class="w-full">
        <slot name="footer" class="py-12 px-24" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, defineEmits, useSlots } from 'vue'

const slots = useSlots()
console.log(slots)
const emits = defineEmits(['loaded'])

onBeforeMount(() => {
  emits('loaded', true)
})
</script>
<style>
[question] a {
  @apply underline;
}

[question] b {
  @apply font-semi-bold;
}
</style>