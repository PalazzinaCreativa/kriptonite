<template>
  <Transition>
    <div loader v-if="props.visible" class="bg-light-gray absolute flex items-center justify-center top-0 left-0 h-full w-full p-8 z-50">
      <div spinner class="relative animate-rotation-on-axis">
        <LogoCompact spinner-front/>
        <div spinner-back class="bg-white absolute top-0 left-0 w-full h-full"></div>
      </div>
    </div>
  </Transition>
</template>
<script setup>
  import { defineProps } from 'vue'
  import LogoCompact from '@/components/LogoCompact.vue'

  const props = defineProps(['visible'])
</script>
<style scoped>
.v-leave-active {
  transition: opacity 0.5s 0.15s cubic-bezier(.63,.06,.71,.03);
}

.v-enter-from, .v-leave-to {
  opacity: 0;
}

[spinner] {
  transform-style: preserve-3d;
}

[spinner-front], [spinner-back] {
  backface-visibility: hidden;
}

[spinner-front] {
  transform: rotateY(0deg);
}

[spinner-back] {
    transform: rotateY(180deg);
}
</style>
