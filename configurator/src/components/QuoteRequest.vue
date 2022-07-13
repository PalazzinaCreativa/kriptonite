<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full py-8 px-6 z-5">
    <div quote-request-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-text="'Richiedi preventivo'" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div quote-request-content class="grow my-16 w-full">
      <div class="text-l text-center w-full" v-text="'Richiedi preventivo'" />
      <div class="my-8 text-center w-full" v-text="`Compila il form sottostante per inviare una richiesta di preventivo sulla composizione appena completata.`" />
      <div class="flex flex-wrap items-start gap-8 w-full">
        <div class="flex gap-x-8 items-center w-full">
          <TextField v-model="name" name="name" label="Nome" class="w-full" />
          <TextField v-model="surname" name="surname" label="Cognome" class="w-full" />
        </div>
        <div class="flex gap-x-8 items-center w-full">
          <TextField v-model="emailAddress" name="emailAddress" label="Email" class="w-full" />
          <TextField v-model="town" name="town" label="Città" class="w-full" />
        </div>
        <div class="flex gap-x-8 items-center w-full">
          <TextareaField v-model="message" name="message" label="Messaggio" class="w-full" />
        </div>
        <div class="flex gap-x-8 items-center w-full">
          <UploadImageField v-model="wall" name="wall" label="Carica foto parete" class="w-full" />
        </div>
        <div class="flex gap-x-8 items-center justify-center w-full">
          <CheckboxField v-model="privacy" name="privacy" label="Accetto i termini e condizioni della privacy" class="w-full" />
        </div>
      </div>
    </div>
    <div request-quote-actions class="flex fixed bottom-0 left-0 w-full">
      <Btn class="bg-light-gray w-full" :label="cancelLabel" @click="close" />
      <Btn class="bg-yellow w-full" :label="sendRequestLabel" @click="sendRequest" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
//import { useConfiguratorStore } from '@/stores/configurator'
import TextField from '@/components/forms/TextField.vue'
import TextareaField from '@/components/forms/TextareaField.vue'
import UploadImageField from '@/components/forms/UploadImageField.vue'
import CheckboxField from '@/components/forms/CheckboxField.vue'

import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'

const props = defineProps(['config'])
const emits = defineEmits(['close'])

const name = ref('')
const surname = ref('')
const emailAddress = ref('')
const town = ref('')
const message = ref('')
const wall = ref([])
const privacy = ref(false)



//const configurator = useConfiguratorStore()
//const baseURL = ref(import.meta.env.VITE_BASE_URL)
//const currentConfiguration = computed(() => configurator.currentConfiguration)
//const configurationId = computed(() => currentConfiguration.value?.code || '')
//const shareLink = ref('')
//const projectLink = ref(null)
//const linkWasCopied = ref(false)

const cancelLabel = ref('Annulla')
const sendRequestLabel = ref('Invia richiesta')


/* onMounted(async () => {
  // Se non ho già inizializzato una configurazione la inizializzo
  if(!currentConfiguration.value) {
    await configurator.initConfiguration()
  }
  // Se ho già inizializzato una configurazione la aggiorno
  if(configurationId.value) {
    configurator.updateConfiguration(configurationId.value, { ...props.config, shared: true })
  }

  shareLink.value = `${baseURL.value}/share/${configurationId.value}`
}) */

const sendRequest = () => {
  console.log('Richiesta inviata!')
}

const close = () => {
  emits('close')
}
</script>
<!--<style>
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
</style>-->