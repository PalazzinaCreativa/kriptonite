<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full py-8 px-6 z-5">
    <div download-model-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-text="'Termina configurazione'" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div donwload-model-content class="grow my-16 w-full">
      <div class="text-l text-center w-full" v-text="'Link di condivisione'" />
      <div class="my-8 text-center w-full" v-text="`Copia il link qui sotto per condividere o riprendere la configurazione da dove l'hai lasciata`" />
      <div class="flex items-center gap-4 w-full">
        <TextField v-if="sharedLink" ref="projectLink" v-model="sharedLink" readonly class="text-cyan"/>
        <Btn v-if="sharedLink" class="bg-light-gray w-full" label="Copia" @click="copyLink" />
      </div>
    </div>
    <div v-if="requestQuoteLabel" configuration-actions class="flex fixed bottom-0 left-0 w-full">
      <Btn class="bg-yellow w-full" :label="requestQuoteLabel" @click="requestQuote" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import TextField from '@/components/forms/TextField.vue'
import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'

const emits = defineEmits(['close'])

const projectLink = ref(null)

const sharedLink = 'https://www.kriptonite.com/configuratortestlink'
const requestQuoteLabel = '' //'Richiedi preventivo'

const requestQuote = () => {
  console.log('Richiedi preventivo')
}

const copyLink = () => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(sharedLink);
  } else {
    projectLink.value.focus();
    document.execCommand('copy');
  }
}

const close = () => {
  emits('close')
}
</script>