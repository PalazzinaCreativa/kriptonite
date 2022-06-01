<template>
  <Transition>
    <div loader v-if="props.visible" class="bg-white fixed flex items-center justify-center top-0 left-0 h-screen w-screen p-8 z-50">
      <Logo class="animate-flickering"/>
    </div>
  </Transition>
</template>
<script setup>
  import { defineProps } from 'vue'
  import Logo from '@/components/Logo.vue'

  const props = defineProps(['visible'])
</script>
<style scoped>
.v-leave-active {
  transition: opacity 0.5s 0.15s cubic-bezier(.63,.06,.71,.03);
}

.v-enter-from, .v-leave-to {
  opacity: 0;
}
</style>
