<template>
  <div class="glide" ref="slider">
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides items-center" ref="slidesList">
        <slot/>
      </ul>
    </div>
    <div v-if="arrows" class="glide__arrows" data-glide-el="controls">
      <slot v-if="slots.arrows" name="arrows" />
      <template v-else>
        <div class="absolute flex justify-between top-1/2 left-0 w-full transform -translate-y-1/2">
          <button class="glide__arrow glide__arrow--left text-gray transform -rotate-180" @click="moveTo('<')">
            <svg class="w-3 h-auto" width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6.5 6.5L1 12" stroke="currentColor"/>
            </svg>
          </button>
          <button class="glide__arrow glide__arrow--right text-gray" @click="moveTo('>')">
            <svg class="w-3 h-auto" width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6.5 6.5L1 12" stroke="currentColor"/>
            </svg>
          </button>
        </div>
      </template>
    </div>
    <div v-if="dots" class="glide__bullets flex gap-1 items-center justify-center mt-8 w-full" data-glide-el="controls[nav]">
      <slot v-if="slots.dots" name="dots" />
      <template v-else>
        <button type="button" v-for="(slide, index) in slides" :key="`dot-${index}`" class="glide__bullet inline-block w-2 h-2 rounded-full" :class="index === activeSlide ? 'bg-yellow' : 'bg-gray'" :data-glide-dir="`=${index}`" @click="moveTo(`=${index}`)"></button>
      </template>
    </div>  
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, useSlots } from 'vue'
import Glide from '@glidejs/glide'

const props = defineProps(['options', 'dots', 'arrows'])
const slots = useSlots()

const glide = ref(null)
const slider = ref(null)
const slidesList = ref(null)
const slides = ref([])
const slideCount = ref(0)
const activeSlide = ref(glide.value ? glide.value.index : 0)

const moveTo = (index) => {
  glide.value.go(index)
}

onMounted(() => {
  slideCount.value = slidesList.value.children.length
  slides.value = [...slidesList.value?.children]
  slides.value.map((slide) => {
    slide.classList.add('glide__slide')
  })
  glide.value = new Glide(slider.value, props.options).mount()

  glide.value.on('run', function(e) {
    activeSlide.value = glide.value.index
  })
})
</script>

<style>
  @import '@glidejs/glide/dist/css/glide.core.min.css';
</style>