<template>
  <div class="relative w-full h-screen" :key="JSON.stringify(questions)">
    <a href="/">
      <Logo class="fixed m-8"/>
    </a>
    <template v-for="(question, index) in questions">
      <Question v-if="isVisible(question, index)" :key="`question-${index}`" v-show="!question.fastForward" @loaded="checkFastForward(question)">
        <template #progress>
          <div v-if="step > 0">
            <div class="flex items-center relative w-full">
              <!-- <Back v-if="step > 1" class="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-gray" @click="goBack(question)"/> -->
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
            <component :is="components[option.component]" :index="index" :option="option" :config="config" :is-animating="target.option.key === option.key && target.isAnimating" :value="config.room.dimensions[option.model]" @input="setDimension($event, option)" @click="handleClick(option, question)"/>
          </div>
        </template>
        <template #nav>
          <Back v-if="step > 1" class="absolute left-16 top-1/2 -translate-y-1/2 cursor-pointer text-white" @click="goBack(question)"/>
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
  </div>
</template>
<script setup>
import { computed, ref, onMounted, defineEmits, defineAsyncComponent } from 'vue'
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
import useProductsStore from '@/stores/products'

const productsModule = useProductsStore()

const components = {
  choice: QuestionChoice,
  input: QuestionInput,
  button: QuestionButton,
  card: QuestionCard
}

const emit = defineEmits(['start'])
const step = ref(0)
let questions = ref(initialSetupData)
// Dati per lo step corrente
const current = computed(() => questions[step.value])
const products = productsModule.index
const target = ref({ option: {}, isAnimating: false })
const config = ref({ room: { dimensions: { width: 400, height: 270, depth: 60, leftHeight: 60, rightHeight: 60 } }, product: {}})

const iconType = ref(config)
const icon = computed(() => iconType.value.room?.type ? defineAsyncComponent(() => import(`./icons/Wall${capitalize(iconType.value.room.type)}.vue`)) : null)

onMounted(() => {
  // Inserimento contenuti dal CMS
  let productChoiceQuestion = questions.value.length ? questions.value.find(question => (question.key === 'type' && question.super === 'product')) : null
  if(products.length && productChoiceQuestion?.options?.length) {
    productChoiceQuestion.options.map((option) => {
      let product = products.find(product => product.sku === option.key)
      option.image = product?.image?.url || option.image
      option.description = product?.description || option.description
    })
  }
})

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

const checkFastForward = (question) => {
  if(question.fastForward && question.options.length === 1) {
    handleClick(question.options[0], question)
  }
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