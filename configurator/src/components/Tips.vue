<template>
  <div tips v-if="tips.length" :key="JSON.stringify(tipCookies)">
    <div tip v-for="tip in tips" :key="tip.name">
      <Transition name="slide-in">
        <Tip v-if="isActive(tip)" class="fixed bottom-8 left-16 z-5" :tip="tip" @close="closeTip" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";
import useTipsStore from '@/stores/tips'

import Tip from '@/components/Tip.vue'

const tipsModule = useTipsStore()
tipsModule.getCookies()
const tips = computed(() => tipsModule.index)
const tipCookies = computed(() => tipsModule.currentIndex)
const activeTip = computed(() => tipsModule.activeTip)

const isActive = (tip) => {
  return activeTip?.value?.name ? activeTip.value.name === tip.name : false
}

const closeTip = (tip) => {
  tipsModule.closeTip(tip)
}
</script>
<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateY(150%);
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
</style>