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
        <TextField v-if="shareLink" ref="projectLink" v-model="shareLink" readonly class="text-cyan w-full"/>
        <Btn v-if="shareLink" class="bg-light-gray" label="Copia" @click="copyLink" />
      </div>
      <Transition name="fade-up">
        <div v-if="linkWasCopied" class="bg-black rounded-md text-white text-s text-center py-2 px-4 my-4 w-full" v-text="`Link copiato negli appunti`"></div>
      </Transition>
    </div>
    <div v-if="requestQuoteLabel" configuration-actions class="flex fixed bottom-0 left-0 w-full">
      <Btn class="bg-yellow w-full" :label="requestQuoteLabel" @click="requestQuote" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import { useConfiguratorStore } from '@/stores/configurator'
import TextField from '@/components/forms/TextField.vue'
import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'

const props = defineProps(['config'])
const emits = defineEmits(['close', 'request-quote'])

const configurator = useConfiguratorStore()
const baseURL = ref(import.meta.env.VITE_BASE_URL)
const currentConfiguration = computed(() => configurator.currentConfiguration)
const configurationId = computed(() => currentConfiguration.value?.code || '')
const shareLink = ref('')
const projectLink = ref(null)
const linkWasCopied = ref(false)

const requestQuoteLabel = 'Richiedi preventivo'

onMounted(async () => {
  // Se non ho già inizializzato una configurazione la inizializzo
  if(!currentConfiguration.value) {
    await configurator.initConfiguration()
  }
  // Se ho già inizializzato una configurazione la aggiorno
  if(configurationId.value) {
    configurator.updateConfiguration(configurationId.value, { ...props.config, shared: true })
  }

  shareLink.value = `${baseURL.value}/share/${configurationId.value}`
})

const requestQuote = () => {
  emits('request-quote')
}

const copyLink = () => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    linkWasCopied.value = true
    navigator.clipboard.writeText(shareLink.value);
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