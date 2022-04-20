<script setup>
import { useInitialSetupStore } from '../stores/initialSetup'
import { computed, ref, reactive, defineEmits } from 'vue'
import { initialSetupData } from '@/dataset/initialSetupData'
import InitialQuestion from './InitialQuestion.vue'

const dimensions = reactive({})

const emit = defineEmits(['start'])
const step = ref(0)
const current = computed(() => initialSetupData[step.value]) // Dati per lo step corrente

const currentInputs = computed(() => { // Lista di input da mostrare in base allo step corrente
  return current.value.type === 'options'
    ? []
    : current.value.inputs.filter(input => input.showIf.includes(config.value.room.type))
})

const config = ref({ room: { dimensions: { width: undefined, height: undefined, depth: undefined, leftHeight: undefined, rightHeight: undefined } }, product: {}})

const handleNextStep = (superKey, key, value) => {
  if (superKey && key && value) config.value[superKey][key] = value
  if (step.value === 0 && config.inRoomPosition !== 'wall') {
    step.value = 2
    return
  }
  step.value++

  if ((step.value === 5 && config.value.product.type === 'k2') || step.value === 6) {
    emit('start', config.value)
    return
  }
}
</script>

<template>
  <div class="relative w-full h-screen">
    <InitialQuestion v-if="step === 0">
      <template #question>
        <strong>Dove</strong> vuoi inserire il prodotto?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('product', 'inRoomPosition', 'wall')">A parete</div>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('product', 'inRoomPosition', 'standalone')">In mezzo alla stanza</div>
      </template>
    </InitialQuestion>
    <InitialQuestion v-if="step === 1 && config.inRoomPosition === 'wall'">
      <template #question>
        In che <strong>materiale</strong> è costruita la parete?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('room', 'composition', 'brick')">In mattoni</div>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('room', 'composition', 'drywall')">In Cartongesso</div>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('room', 'composition', 'drywall')">Altro materiale</div>
      </template>
    </InitialQuestion>
    <InitialQuestion v-if="step === 2">
      <template #question>
        <strong>Di che tipo</strong> è la tua parete?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('room', 'type', 'classic')">Classica</div>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('room', 'type', 'niche')">Nicchia</div>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('room', 'type', 'attic')">Mansarda</div>
      </template>
    </InitialQuestion>
    <InitialQuestion v-if="step === 3">
      <template #question>
        Quali sono le <strong>dimensioni</strong> della parete?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <div class="flex w-full">
          <div class="w-[9.25rem] bg-white px-6 py-4">Larghezza</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.width">
        </div>
        <div class="flex w-full" v-if="config.room.type !== 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4">Altezza</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.height">
        </div>
        <div class="flex w-full" v-if="config.room.type === 'niche'">
          <div class="w-[9.25rem] bg-white px-6 py-4">Profondità</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.depth">
        </div>
        <div class="flex w-full" v-if="config.room.type === 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4">Altezza sinistra</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.leftHeight">
        </div>
        <div class="flex w-full" v-if="config.room.type === 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4">Altezza destra</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.rightHeight">
        </div>

        <div class="w-full py-4 bg-white" @click="handleNextStep">
          Procedi
        </div>
      </template>
    </InitialQuestion>
    <InitialQuestion v-if="step === 4">
      <template #question>
        Ecco i prodotti perfetti per te. <br> <strong>Quale scegli?</strong>
      </template>
      <template #options>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('product', 'type', 'k1')">K1</div>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('product', 'type', 'k2')">K2</div>
      </template>
    </InitialQuestion>
    <InitialQuestion v-if="step === 5">
      <template #question>
        Dove vuoi <strong>posizionare</strong> il prodotto?
      </template>
      <template #options>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('product', 'uprightsPosition', 'ground')">A terra</div>
        <div class="py-4 bg-white/40 w-full my-8" @click="handleNextStep('product', 'uprightsPosition', 'wall')">A parete</div>
      </template>
    </InitialQuestion>
  </div>
</template>