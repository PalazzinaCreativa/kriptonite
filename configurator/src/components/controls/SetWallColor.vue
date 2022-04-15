<script setup>
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import { useConfiguratorStore } from '../../stores/configurator'

const configurator = useConfiguratorStore()
const wallColor = ref('#ffffff')
const showPicker = ref(false)
const pickerWrapper = ref(null)
const toggle = ref(null)
// const debounce = (fn, delay = 500) => {
//   let timer
//   return (...args) => {
//     clearTimeout(timer)
//     timer = setTimeout(() => { fn.apply(this, args) }, delay)
//   }
// }

const handleChangeColor = ({ hex }) => {
  wallColor.value = hex
  configurator.setWallColor(hex)
}

const hidePickerOnClickOutside = (e)=> {
  if (!showPicker.value) return
  nextTick(() => {
    if (!pickerWrapper.value || toggle.value.contains(e.target) || pickerWrapper.value.contains(e.target)) return
    showPicker.value = false
  })
}

// Nascondi il picker al click al di fuori del picker
onMounted(() => {
  window.addEventListener('click', hidePickerOnClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', hidePickerOnClickOutside)
})

</script>

<template>
  <div class="relative z-20">
    <h2>Seleziona il colore della parete</h2>
    <div class="block w-6 h-6 mt-2 rounded-md shadow-md hover:shadow-lg cursor-pointer" :style="{ backgroundColor: wallColor }" @click="showPicker = !showPicker" ref="toggle">
    </div>
    <div class="absolute" v-if="showPicker" ref="pickerWrapper">
      <ColorPicker
        theme="light"
        :color="wallColor"
        :sucker-hide="true"
        :colors-default="['#ffffff', '#d1d1d1', '#bb0220', '#0244bb']"
        @changeColor="handleChangeColor"
        class="color-picker"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.color-picker .color-alpha),
:deep(.color-picker .color-show),
:deep(.color-picker .color-type ) {
  display: none;
}

:deep(.color-picker) {
  z-index: 51;
}
</style>