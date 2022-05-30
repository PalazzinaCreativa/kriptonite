<template>
  <div class="relative w-full h-screen">
    <a href="/">
      <Logo class="fixed m-8"/>
    </a>
    <template v-for="(question, index) in questions">
      <Question v-if="isVisible(question, index)" :key="`question-${index}`">
        <template #progress>
          <div v-if="step > 0">
            <div class="flex items-center relative w-full">
              <Back v-if="step > 1" class="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-gray" @click="goBack(question)"/>
              <div class="text-black text-[40px] font-regular text-center w-full" v-text="zeroPad(step, 2)" />
            </div>
            <LoadingBar :value="step" :total="questions.length" class="mt-8 mb-16"/>
          </div>
        </template>
        <template #question>
          <div v-html="question.title"/>
        </template>
        <template #paragraph>
          <p class="text-xs" v-html="question.paragraph"/>
        </template>
        <template #options>
          <div v-if="question.showIcon && icon" class="flex flex-wrap items-center justify-center mb-16 w-full">
            <component :is="icon" class="text-white w-14 h-auto" />
          </div>
          <div v-for="(option, index) in question.options" :key="index">
            <component :is="components[option.component]" :index="index" :option="option" :config="config" :is-animating="target.option.key === option.key && target.isAnimating" :value="config.room.dimensions[option.model]" @input="setDimension($event.target.value, option)" @click="handleClick(option, question)"/>
          </div>
        </template>
        <template #footer>
          <div v-if="question.footer && question.footer.options.length" class="flex items-center gap-8 w-full">
            <div v-if="question.footer.text" v-html="question.footer.text" class="min-w-[125px]"/>
            <div v-for="(option, index) in question.footer.options" :key="index" class="flex gap-4 w-full">
              <a :href="option.link" class="inline-block">
                <button role="button" class="bg-white inline-block text-black py-4 px-8" v-html="option.label"/>
              </a>
            </div>
          </div>
        </template>
      </Question>
    </template>
    <!-- <Question v-if="step === 0">
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
          <input class="flex-1 bg-white/40 px-6" type="number" v-model="config.room.dimensions.width">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type !== 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Altezza</div>
          <input class="flex-1 bg-white/40 px-6" type="number" v-model="config.room.dimensions.height">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type === 'niche'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Profondità</div>
          <input class="flex-1 bg-white/40 px-6" type="number" v-model="config.room.dimensions.depth">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type === 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Altezza sinistra</div>
          <input class="flex-1 bg-white/40 px-6" type="number" v-model="config.room.dimensions.leftHeight">
        </div>
        <div class="flex w-full my-4 text-m" v-if="config.room.type === 'attic'">
          <div class="w-[9.25rem] bg-white px-6 py-4 font-semi-bold">Altezza destra</div>
          <input class="flex-1 bg-white/40 px-6" type="number" v-model="config.room.dimensions.rightHeight">
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
    </Question> -->
  </div>
</template>
<script setup>
import { computed, ref, reactive, defineEmits, defineAsyncComponent } from 'vue'
import lget from 'lodash.get'
import { capitalize } from '../utils/capitalize'
import { zeroPad } from '../utils/zeroPad'
import { initialSetupData } from '@/dataset/initialSetupData'
import Logo from '@/components/Logo.vue'
import LoadingBar from '@/components/LoadingBar.vue'
import Back from '@/components/icons/Back.vue'
import Question from '@/components/Question.vue'
import QuestionChoice from '@/components/QuestionChoice.vue'
import QuestionInput from '@/components/QuestionInput.vue'
import QuestionButton from '@/components/QuestionButton.vue'
import QuestionCard from '@/components/QuestionCard.vue'
import { set } from 'pinia/node_modules/vue-demi'
import { getBaseTransformPreset } from '@vue/compiler-core'


const components = {
  choice: QuestionChoice,
  input: QuestionInput,
  button: QuestionButton,
  card: QuestionCard
}

const emit = defineEmits(['start'])
const step = ref(0)
let questions = ref(initialSetupData)
const current = computed(() => questions[step.value]) // Dati per lo step corrente
const target = ref({ option: {}, isAnimating: false })
const config = ref({ room: { dimensions: { width: undefined, height: undefined, depth: undefined, leftHeight: undefined, rightHeight: undefined } }, product: {}})

const iconType = ref(config)
const icon = computed(() => iconType.value.room?.type ? defineAsyncComponent(() => import(`./icons/Wall${capitalize(iconType.value.room.type)}.vue`)) : null)

const handleClick = (option, question) => {
  if (question.super && question.key && option.key) config.value[question.super][question.key] = option.key
  
  updateQuestions(questions, step)

  if (option.component !== 'input') {
    target.value = { option: option, isAnimating: true }
    setTimeout(() => {
      handleNextStep(option, question)
      target.value.isAnimating = false
    }, 500)
  }
  return
}

const handleNextStep = (option, question) => {
  step.value++
  if(step.value === questions.value.length) {
    // Converto le dimensioni da cm a m per la generazione della stanza
    config.value.room.dimensions = convertDimensions(config.value.room?.dimensions)
    // Lancio configuratore
    emit('start', config.value)
    return
  }
}

const updateQuestions = (questions, nextStep) => {
  if(nextStep.value === 1) {
    questions.value = initialSetupData
    questions.value = Object.keys(config.value.product).length ? questions.value.filter((item) => {
      return !item.type || item.type === config.value.product.inRoomPosition
    }) : questions.value
  }
}

const convertDimensions = (dimensions) => {
  return Object.keys(dimensions).reduce((accumulator, key) => {
    let formattedDimension = typeof dimensions[key] !== 'undefined' ? (parseInt(dimensions[key]) / 100).toString() : dimensions[key] 
    return { ...accumulator, [key]: formattedDimension };
  }, {});
}

const goBack = (question) => {
  let nextStep = step.value - 1
  updateQuestions(questions, nextStep)
  step.value--
}

const setDimension = (value, option) => {
  config.value.room.dimensions[option.model] = value
}

const isVisible = (question, index) => {
  return step.value === parseInt(index) && (!question.showIf || question.showIf.values.includes(lget(config.value, question.showIf.entity)))
}
</script>