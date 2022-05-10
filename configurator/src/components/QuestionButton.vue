<template>
  <button role="button" class="cursor-pointer w-full py-4 bg-white text-center uppercase text-m">{{ props.option.label }}<slot/></button>
</template>

<script setup>
  const props = defineProps(['option', 'config'])
</script>