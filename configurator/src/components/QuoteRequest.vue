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
        <form form class="flex flex-wrap items-start gap-8 w-full" :class="loading ? 'opacity-20' : ''" @submit.prevent="sendRequest">
          <div class="flex gap-x-8 w-full">
            <TextField v-model="name" name="name" label="Nome*" class="w-full" :error="getErrorMessage('name')" @input="resetErrors('name')" required/>
            <TextField v-model="surname" name="surname" label="Cognome*" class="w-full" :error="getErrorMessage('surname')" @input="resetErrors('surname')" required/>
          </div>
          <div class="flex gap-x-8 w-full">
            <TextField v-model="email" name="email" label="Email*" class="w-full" :error="getErrorMessage('email')" @input="resetErrors('email')" required/>
            <TextField v-model="town" name="town" label="Città*" class="w-full" :error="getErrorMessage('town')" @input="resetErrors('town')" required/>
          </div>
          <div class="flex gap-x-8 w-full">
            <TextareaField v-model="message" name="message" label="Messaggio*" class="w-full" :error="getErrorMessage('message')" @input="resetErrors('message')" required/>
          </div>
          <div class="flex gap-x-8 w-full">
            <UploadImageField v-model="wall" name="wall" label="Carica foto parete" class="w-full" :error="getErrorMessage('wall')">
              <div v-html="uploadFileDescription"></div>
            </UploadImageField>
          </div>
          <div class="flex gap-x-8 justify-center w-full">
            <CheckboxField v-model="privacy" name="privacy" :label="privacyLabel" class="w-full" :error="getErrorMessage('privacy')" @input="resetErrors('privacy')" required/>
          </div>
          <div request-quote-actions class="flex fixed bottom-0 left-0 w-full">
            <Btn class="bg-light-gray w-full" :label="cancelLabel" @click="close" />
            <Btn class="bg-yellow w-full" type="submit" :label="sendRequestLabel"/>
          </div>
        </form>
        <Loader :visible="loading" class="bg-opacity-80" />
        <Transition name="fade-up">
        <div v-if="sent" :key="sent" class="absolute bg-white flex flex-wrap items-center justify-center font-bold h-full top-0 left-0 w-full text-center text-m z-2">Grazie! La tua richiesta di preventivo è stata inoltrata correttamente.</div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import TextField from '@/components/forms/TextField.vue'
import TextareaField from '@/components/forms/TextareaField.vue'
import UploadImageField from '@/components/forms/UploadImageField.vue'
import CheckboxField from '@/components/forms/CheckboxField.vue'
import Loader from '@/components/Loader.vue'

import Btn from '@/components/forms/Button.vue'
import Close from '@/components/icons/Close.vue'

const emits = defineEmits(['close'])

const baseURL = ref(import.meta.env.VITE_CMS_BASE_URL)
const loading = ref(false)
const validationMessages = ref([])
const isValid = computed(() => {
  return Boolean(wall?.value.length && name.value && surname.value && email.value && town.value && message.value && privacy.value)
})

const name = ref('')
const surname = ref('')
const email = ref('')
const town = ref('')
const message = ref('')
const wall = ref([])
const privacy = ref(false)

const sent = ref(false)
const uploadFileDescription = ref('Carica qui una foto della tua parete, per aiutarci a farci un’idea più precisa della tua situazione e delle tue esigenze.')
const privacyLabel = ref('Accetto i termini e condizioni della <a href="#">privacy</a>')
const cancelLabel = ref('Annulla')
const sendRequestLabel = ref('Invia richiesta')

const quoteData = computed(() => (
  {
    name: name.value,
    surname: surname.value,
    email: email.value,
    town: town.value,
    message: message.value,
    privacy: privacy.value
  }
))

const payload = computed(() => {
  let formData = new FormData()
  formData.append('data', JSON.stringify(quoteData.value))
  formData.append('files.wall', wall.value)
  return formData
})

const sendRequest = async () => {
  validationMessages.value = []
  loading.value = true
  await fetch(`${baseURL.value}/api/contacts`, {
    method: 'POST',
    body: payload.value
  })
  .then(async response => {
    if(response.ok) {
      resetForm()
      sent.value = true
      setTimeout(() => { sent.value = false }, 4000)
    }
    let errors = await response.json()
    validationMessages.value = errors.errors
  })
  .catch(response => {
    console.log('errori', response)
  })
  loading.value = false
}

const resetErrors = (field) => {
  if(validationMessages.value.length) {
    let errorIndex = validationMessages.value.findIndex((item) => item.field === field)
    if(errorIndex >= 0) {
      validationMessages.value.splice(errorIndex, 1)
    }
  }
}

const resetForm = () => {
  name.value = ''
  surname.value = ''
  email.value = ''
  town.value = ''
  message.value = ''
  wall.value = []
  privacy.value = false
}

const getErrorMessage = (key => validationMessages.value?.length ? validationMessages.value.find(error => error.field === key) : '')

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