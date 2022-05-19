<template>
  <button role="button" class="cursor-pointer w-full py-4 overflow-hidden text-black text-center uppercase group hover:bg-opacity-50 transition-all duration-300">
    <span class="inline-block transform transition-transform duration-300 group-hover:animate-button">
      <slot name="prepend"/>
      {{ props.label }}
      <slot/>
      <slot name="append"/>
    </span>
  </button>
</template>

<script setup>
  const props = defineProps(['label'])
</script>