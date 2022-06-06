<template>
  <Transition name="fade-up">
    <div alert-container v-if="visible" class="bg-light-gray bg-opacity-50 fixed top-0 left-0 flex items-center justify-center h-screen w-screen z-50">
      <div alert class="bg-white border-2 border-yellow rounded-lg py-8 px-12">
        <slot v-if="slots.default"/>
        <div v-else>
          <div alert-text class="text-black text-center" v-html="message" />
          <slot v-if="slots.actions" name="actions" />
          <div v-else alert-actions class="flex items-center justify-center gap-8 mt-6 w-full">
            <Btn class="bg-light-gray rounded-full" :label="cancelLabel" @click="cancel" />
            <Btn class="bg-yellow rounded-full" :label="confirmLabel" @click="confirm" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, defineProps, defineEmits, useSlots } from "vue";
import Btn from '@/components/forms/Button.vue'

const props = defineProps(['visible', 'message', 'cancelLabel', 'confirmLabel'])
const emits = defineEmits(['cancel', 'confirm'])
const slots = useSlots()


const cancelLabel = computed(() => props.cancelLabel || 'Annulla')
const confirmLabel = computed(() => props.confirmLabel || 'OK')

const cancel = () => {
  emits('cancel')
}

const confirm = () => {
  emits('confirm')
}
</script>
<style>
.fade-up-enter-active,
.fade-up-leave-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(3rem);
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
</style>