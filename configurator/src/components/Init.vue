<script setup>
import { useInitialSetupStore } from '../stores/initialSetup'
import { computed, reactive } from 'vue'
import { initialSetupData } from '@/dataset/initialSetupData'

const initialSetup = useInitialSetupStore()

const dimensions = reactive({})

const current = computed(() => initialSetupData[initialSetup.step]) // Dati per lo step corrente

const currentInputs = computed(() => { // Lista di input da mostrare in base allo step corrente
  return current.value.type === 'options'
    ? []
    : current.value.inputs.filter(input => input.showIf.includes(initialSetup.room.type))
})

const handleNextStep = (key) => {
  initialSetup.$patch({
    room: {
    [current.value.key]: key
  }}) // Assegna le scelte della configurazione nelo store
 if (current === 0 && key !== 'Wall') {
   initialSetup.$patch({
     step: 2
   }) // Se si sceglie di gestire il prodotto in mezzo alla stanza non c'è bisogno di scegliere il tipo di parete
   return
 }
  initialSetup.nextStep()
}
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div>
      <div class="text-center">
        {{ current.question }}
      </div>
      <div class="flex mt-10" v-if="current.type === 'options'">
        <div class="mx-12 px-8 py-4 shadow-md hover:shadow-lg cursor-pointer" v-for="option of current.options" :key="option.label+option.key" @click="handleNextStep(option.key)">
          {{ option.label }}
        </div>
      </div>
      <form @submit.prevent="handleNextStep(dimensions)" v-else>
        <div class="flex items-center justify-center">
          <div class="flex justify-center mx-4 py-4 " v-for="input of currentInputs" :key="input.model" >
            <div class="flex flex-col">
              <label :for="input.model" class="font-bold mb-4">
                {{ input.label }}
              </label>
              <div class="flex items-baseline">
                <input :name="input.model" type="number" class="w-20 border border-black px-3 py-2" v-model="dimensions[input.model]" :placeholder="input.placeholder" step=".01">
                <span class="ml-2 text-black">m</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center"><button type="submit" class="px-8 py-4 shadow-md hover:shadow-lg cursor-pointer mt-12 mx-auto">Submit</button></div>
      </form>
    </div>
  </div>
</template>