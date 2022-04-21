<script setup>
import { computed, ref, reactive, defineEmits } from 'vue'
import { initialSetupData } from '@/dataset/initialSetupData'
import Question from '@/components/Question.vue'
import QuestionButton from '@/components/QuestionButton.vue'

const dimensions = reactive({})

const emit = defineEmits(['start'])
const step = ref(0)
const current = computed(() => initialSetupData[step.value]) // Dati per lo step corrente

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
    <Question v-if="step === 0">
      <template #question>
        <strong>Dove</strong> vuoi inserire il prodotto?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <QuestionButton @click="handleNextStep('product', 'inRoomPosition', 'wall')">A parete</QuestionButton>
        <QuestionButton @click="handleNextStep('product', 'inRoomPosition', 'standalone')">In mezzo alla stanza</QuestionButton>
      </template>
    </Question>
    <Question v-if="step === 1 && config.inRoomPosition === 'wall'">
      <template #question>
        In che <strong>materiale</strong> è costruita la parete?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <QuestionButton @click="handleNextStep('room', 'composition', 'brick')">In mattoni</QuestionButton>
        <QuestionButton @click="handleNextStep('room', 'composition', 'drywall')">In Cartongesso</QuestionButton>
        <QuestionButton @click="handleNextStep('room', 'composition', 'drywall')">Altro materiale</QuestionButton>
      </template>
    </Question>
    <Question v-if="step === 2">
      <template #question>
        <strong>Di che tipo</strong> è la tua parete?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <QuestionButton @click="handleNextStep('room', 'type', 'classic')">Classica</QuestionButton>
        <QuestionButton @click="handleNextStep('room', 'type', 'niche')">Nicchia</QuestionButton>
        <QuestionButton @click="handleNextStep('room', 'type', 'attic')">Mansarda</QuestionButton>
      </template>
    </Question>
    <Question v-if="step === 3">
      <template #question>
        Quali sono le <strong>dimensioni</strong> della parete?
      </template>
      <template #paragraph>
        Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.
      </template>
      <template #options>
        <div class="flex w-full my-4 text-m">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Larghezza</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.width">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type !== 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Altezza</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.height">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type === 'niche'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Profondità</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.depth">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type === 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Altezza sinistra</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.leftHeight">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type === 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Altezza destra</div>
          <input class="flex-1 bg-white/40 px-6" type="text" v-model="config.room.dimensions.rightHeight">
        </div>

        <div class="w-full py-4 bg-white text-center uppercase text-m" @click="handleNextStep">
          Procedi
        </div>
      </template>
    </Question>
    <Question v-if="step === 4">
      <template #question>
        Ecco i prodotti perfetti per te. <br> <strong>Quale scegli?</strong>
      </template>
      <template #options>
        <QuestionButton @click="handleNextStep('product', 'type', 'k1')">K1</QuestionButton>
        <QuestionButton @click="handleNextStep('product', 'type', 'k2')">K2</QuestionButton>
      </template>
    </Question>
    <Question v-if="step === 5">
      <template #question>
        Dove vuoi <strong>posizionare</strong> il prodotto?
      </template>
      <template #options>
        <QuestionButton @click="handleNextStep('product', 'uprightsPosition', 'ground')">A terra</QuestionButton>
        <QuestionButton @click="handleNextStep('product', 'uprightsPosition', 'wall')">A parete</QuestionButton>
      </template>
    </Question>
  </div>
</template>