<template>
  <button role="button" class="bg-white cursor-pointer py-4 px-8 overflow-hidden text-black text-center uppercase group transition-all duration-300">
    <span class="flex items-center gap-4 justify-center transform transition-transform duration-300 group-hover:animate-button">
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