<template>
    <button role="button" class="border border-gray hover:border-black rounded-full py-1.5 px-3.5 transition" :class="isSelected ? 'bg-black text-white' : 'bg-white text-black'"></button>
</template>
<script setup>
const props = defineProps(['isSelected'])
</script>