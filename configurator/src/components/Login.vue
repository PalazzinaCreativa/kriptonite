<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full">
    <div login-header class="bg-light-gray flex items-center justify-between py-4 px-6 w-full">
      <div v-text="title" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div login-content class="grow my-16 px-6 w-full">
      <div class="text-l text-center w-full" v-text="'Login'" />
      <div class="flex flex-wrap items-start gap-4 mt-8 w-full">
        <TextField v-model="email" name="email" label="E-mail" class="w-full" :error="getErrorMessage('email')" @input="resetErrors('email')" required/>
        <PasswordField v-model="password" name="password" label="Password" class="w-full" :error="getErrorMessage('password')" @input="resetErrors('password')" required/>
        <div class="flex items-center gap-8 justify-between w-full">
          <CheckboxField v-model="remember" name="remember" :label="rememberLabel" class="w-full" />
          <span class="cursor-pointer inline-block underline font-semibold text-xs hover:text-yellow transition duration-300 w-full" v-text="passwordRecoveryLabel" />
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center mt-16 w-full">
        <Btn label="Accedi" class="bg-yellow w-full" @click="login" />
      </div>
      <div login-actions class="flex items-center justify-center gap-4 fixed bottom-0 left-0 py-4 w-full">
        <span v-text="registerCta"></span>
        <span class="cursor-pointer underline font-semibold text-xs hover:text-yellow transition duration-300" v-text="registerLabel" @click="register"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
//import { useConfiguratorStore } from '@/stores/configurator'
import Btn from '@/components/forms/Button.vue'
import TextField from '@/components/forms/TextField.vue'
import PasswordField from '@/components/forms/PasswordField.vue'
import CheckboxField from '@/components/forms/CheckboxField.vue'

import Close from '@/components/icons/Close.vue'

//const props = defineProps(['element'])
const emits = defineEmits(['register', 'close'])

const title = ref('Accedi')
const email = ref('')
const password = ref('')
const remember = ref(false)
const rememberLabel = ref('Ricordami')
const passwordRecoveryLabel = ref('Recupera la password')
const registerCta = ref('Non hai ancora un account?')
const registerLabel = ref('Registrati')
const validationMessages = ref([])

//const configurator = useConfiguratorStore()

const getErrorMessage = (key => validationMessages.value?.length ? validationMessages.value.find(error => error.field === key) : '')

const login = () => {
  console.log('Login')
}

const register = () => {
  emits('register')
}

const close = () => {
  emits('close')
}
</script>