<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full py-8 px-6 z-5">
    <div download-model-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-text="'Condividi progetto'" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div donwload-model-content class="grow my-16 w-full">
      <div class="text-l text-center w-full" v-text="'Link di condivisione'" />
      <div class="my-8 text-center w-full" v-text="`Copia il link qui sotto per condividere o riprendere la configurazione da dove l'hai lasciata`" />
      <div class="flex items-center gap-4 w-full">
        <TextField v-if="props.shareLink" ref="projectLink" v-model="props.shareLink" readonly class="text-cyan"/>
        <Btn v-if="props.shareLink" class="bg-light-gray w-full" label="Copia" @click="copyLink" />
      </div>
      <Transition name="fade-up">
        <div v-if="linkWasCopied" class="border-2 border-yellow rounded-lg text-s text-center p-4 my-4 w-full" v-text="`Link copiato`"></div>
      </Transition>
    </div>
    <div v-if="requestQuoteLabel" configuration-actions class="flex fixed bottom-0 left-0 w-full">
      <Btn class="bg-yellow w-full" :label="requestQuoteLabel" @click="requestQuote" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import TextField from '@/components/forms/TextField.vue'
import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'

const props = defineProps(['share-link'])
const emits = defineEmits(['close'])

const projectLink = ref(null)
const linkWasCopied = ref(false)

const requestQuoteLabel = '' //'Richiedi preventivo'

const requestQuote = () => {
  //console.log('Richiedi preventivo')
}

const copyLink = () => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    linkWasCopied.value = true
    navigator.clipboard.writeText(props.shareLink);
  } else {
    linkWasCopied.value = true
    projectLink.value.focus();
    document.execCommand('copy');
  }
  setTimeout(() => { linkWasCopied.value = false }, 1000)
}

const close = () => {
  emits('close')
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