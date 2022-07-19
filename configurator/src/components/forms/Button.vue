<template>
  <button role="button" :type="type" class="bg-white cursor-pointer py-3 px-8 overflow-hidden text-black text-center uppercase group transition-all duration-300">
    <span class="flex items-center gap-4 justify-center transform transition-transform duration-300 group-hover:animate-button">
      <slot name="prepend"/>
      {{ props.label }}
      <slot/>
      <slot name="append"/>
    </span>
  </button>
</template>

<script setup>
  const props = defineProps(
    {
      label: {
        default: '',
        type: String
      },
      type: {
        default: 'button',
        type: String
      }
    }
  )
</script>