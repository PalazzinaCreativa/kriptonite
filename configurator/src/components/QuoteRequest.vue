<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full py-8 px-6 z-5">
    <div quote-request-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-text="'Richiedi preventivo'" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div quote-request-content class="grow my-16 w-full">
      <div class="text-l text-center w-full" v-text="'Richiedi preventivo'" />
      <div class="my-8 text-center w-full" v-text="`Compila il form sottostante per inviare una richiesta di preventivo sulla composizione appena completata.`" />
      <div class="relative w-full" >
        <div form class="flex flex-wrap items-start gap-8 w-full" :class="loading ? 'opacity-20' : ''">
          <div class="flex gap-x-8 w-full">
            <TextField v-model="name" name="name" label="Nome*" class="w-full" :error="getErrorMessage('name')" @input="resetErrors('name')" required/>
            <TextField v-model="surname" name="surname" label="Cognome*" class="w-full" :error="getErrorMessage('surname')" @input="resetErrors('surname')" required/>
          </div>
          <div class="flex gap-x-8 w-full">
            <TextField v-model="email" name="emailAddress" label="Email*" class="w-full" :error="getErrorMessage('email')" required/>
            <TextField v-model="town" name="town" label="Città*" class="w-full" :error="getErrorMessage('town')" required/>
          </div>
          <div class="flex gap-x-8 w-full">
            <TextareaField v-model="message" name="message" label="Messaggio*" class="w-full" :error="getErrorMessage('message')" required/>
          </div>
          <div class="flex gap-x-8 w-full">
            <UploadImageField v-model="wall" name="wall" label="Carica foto parete" class="w-full" :error="getErrorMessage('wall')">
              <div v-html="uploadFileDescription"></div>
            </UploadImageField>
          </div>
          <div class="flex gap-x-8 justify-center w-full">
            <CheckboxField v-model="privacy" name="privacy" :label="privacyLabel" class="w-full" :error="getErrorMessage('privacy')" required/>
          </div>
        </div>
        <Loader :visible="loading" class="bg-opacity-30"/>
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
import Loader from '@/components/Loader.vue'

import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'

const props = defineProps(['config'])
const emits = defineEmits(['close'])

const baseURL = ref(import.meta.env.VITE_CMS_BASE_URL)
const loading = ref(false)
const validationMessages = ref([])
const isValid = computed(() => {
  return Boolean(wall?.value.length && name.value && surname.value && emailAddress.value && town.value && message.value && privacy.value)
})

const name = ref(null)
const surname = ref(null)
const email = ref(null)
const town = ref(null)
const message = ref(null)
const wall = ref([])
const privacy = ref('')



//const configurator = useConfiguratorStore()
//const baseURL = ref(import.meta.env.VITE_BASE_URL)
//const currentConfiguration = computed(() => configurator.currentConfiguration)
//const configurationId = computed(() => currentConfiguration.value?.code || '')
//const shareLink = ref('')
//const projectLink = ref(null)
//const linkWasCopied = ref(false)
const uploadFileDescription = ref('Carica qui una foto della tua parete, per aiutarci a farci un’idea più precisa della tua situazione e delle tue esigenze.')
const privacyLabel = ref('Accetto i termini e condizioni della <a href="#">privacy</a>')
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

const quoteData = computed(() => {
  return {
    name: name.value !== '' ? name.value : null, // avvisare Davide di validare anche le stringhe vuote
    surname: surname.value,
    email: email.value,
    town: town.value,
    message: message.value,
    wall: wall.value,
    privacy: privacy.value
  }
})

const payload = computed(() => {
  let formData = new FormData()
  console.log(quoteData.value, JSON.stringify(quoteData.value))
  formData.append('data', JSON.stringify(quoteData.value))
  /* if(Object.keys(formData).length) {
    Object.entries(formdata).map(([key, value]) => {
      formData.append(key, value)
    })
  } */
  return formData
})

const sendRequest = async () => {
  validationMessages.value = []
  loading.value = true
  const response = await fetch(`${baseURL.value}/api/contacts`, {
    method: 'POST',
    //headers: { 'Content-Type': 'multipart/form-data' },
    body: payload.value
  }).then(response => response.json())
  .catch(error => { console.log('errori:', error) })

  validationMessages.value = response.error?.details?.errors
  loading.value = false
  return response
}

const resetErrors = (field) => {
  if(validationMessages.value.length) {
    let errorIndex = validationMessages.value.findIndex((item) => item.path[0] === field)
    if(errorIndex > 0) {
      validationMessages.value.splice(errorIndex, 1)
    }
  }
}

const getErrorMessage = (key => validationMessages.value?.length ? validationMessages.value.find(error => error.path.find(field => field === key)) : '')

const close = () => {
  emits('close')
}
</script>