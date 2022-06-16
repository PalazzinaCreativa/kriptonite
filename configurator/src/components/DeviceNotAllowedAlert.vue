<template>
  <div class="h-screen flex flex-col items-center justify-center p-8 w-full">
    <DeviceOrientation/>
    <div class="text-center my-16 text-l font-light" v-html="'<b>Ruota</b> il tuo dispositivo <b>in orizzontale</b><br/>per la migliore esperienza'" />
  </div>
</template>
<script setup>
import DeviceOrientation from '@/components/icons/DeviceOrientation.vue'
</script>