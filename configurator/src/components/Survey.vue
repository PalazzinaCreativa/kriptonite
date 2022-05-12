<script setup>
import { computed, ref, reactive, defineEmits, defineAsyncComponent } from 'vue'
import { initialSetupData } from '@/dataset/initialSetupData'
import Logo from '@/components/Logo.vue'
import LoadingBar from '@/components/LoadingBar.vue'
import Back from '@/components/icons/Back.vue'
import Question from '@/components/Question.vue'
import QuestionChoice from '@/components/QuestionChoice.vue'
import QuestionInput from '@/components/QuestionInput.vue'
import QuestionButton from '@/components/QuestionButton.vue'
import QuestionCard from '@/components/QuestionCard.vue'

const components = {
  choice: QuestionChoice,
  input: QuestionInput,
  button: QuestionButton,
  card: QuestionCard
}

const dimensions = reactive({})

const emit = defineEmits(['start'])
const step = ref(0)
const current = computed(() => initialSetupData[step.value]) // Dati per lo step corrente
const target = ref({ option: {}, isAnimating: false })
const config = ref({ room: { dimensions: { width: undefined, height: undefined, depth: undefined, leftHeight: undefined, rightHeight: undefined } }, product: {}})

const handleClick = (option, superKey, key, value) => {
  if (option.component !== 'input') {
    target.value = { option: option, isAnimating: true }
    setTimeout(() => {
      handleNextStep(superKey, key, value)
      target.value.isAnimating = false
    }, 500)
  } else {
    return null
  }
}

const handleNextStep = (superKey, key, value) => {
  if (superKey && key && value) config.value[superKey][key] = value
  if (step.value === 1 && config.value.product.inRoomPosition !== 'wall') {
    step.value = 2
    return
  }
  step.value++

  if ((step.value === 5 && config.value.product.type === 'k2') || step.value === 6) {
    emit('start', config.value)
    return
  }
}

const goBack = () => {
  step.value--
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const componentModel = (option) => {
  return option?.model ? config.value.room.dimensions[option.model] : null
}

const isVisible = (question, index) => {
  return step.value === parseInt(index) && (!question.showIf || question.showIf.includes(config.value.product.inRoomPosition))
}
</script>

<template>
  <div class="relative w-full h-screen">
    <Logo class="fixed m-8"/>
    <template v-for="(question, index) in initialSetupData">
      <Question v-if="isVisible(question, index)" :key="`question-${index}`">
        <template #progress>
          <div v-if="step > 0">
            <div class="flex items-center relative w-full">
              <Back v-if="step > 1" class="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-gray" @click="goBack"/>
              <div class="text-black text-[40px] font-regular text-center w-full" v-text="zeroPad(step, 2)" />
            </div>
            <LoadingBar :value="step" :total="initialSetupData.length" class="mt-8 mb-16"/>
          </div>
        </template>
        <template #question>
          <div v-html="question.title"/>
        </template>
        <template #paragraph>
          <p class="text-xs" v-html="question.paragraph"/>
        </template>
        <template #options>
          <div v-for="(option, index) in question.options" :key="index">
            <component :is="components[option.component]" :index="index" :option="option" :config="config" :is-animating="target.option.key === option.key && target.isAnimating" :value="componentModel(option)" @input="config.room.dimensions[option.model] = $event.target.value" @click="handleClick(option, question.super, question.key, option.key)"/>
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