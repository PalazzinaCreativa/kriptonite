<template>
  <div class="relative z-1">
    <div class="uppercase text-center w-full">Colore pareti</div>
    <div room-color class="my-4" ref="pickerWrapper">
      <ColorPicker theme="light" :color="wallColor" :sucker-hide="true" :colors-default="colorSuggestions" @changeColor="handleChangeColor" class="color-picker" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const configurator = useConfiguratorStore()

const wallColor = ref('#efefef')
const colorSuggestions = ref(['#efefef', '#d9d9d9', '#415956', '#005580', '#cdbbae', '#c5654a', '#c38841'])
let wallColorTimeout

const handleChangeColor = ({ hex }) => {
  wallColor.value = hex
  configurator.setWallColor(hex)
  clearTimeout(wallColorTimeout)
  wallColorTimeout = setTimeout(() => {
    configurator.updateConfig()
  }, 500)
}
</script>

<style>
[room-color] .hu-color-picker {
  background-color: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: column-reverse;
  margin: 0;
  width: 100% !important;
}

[room-color] .color-set {
  justify-content: center;
}

[room-color] .hu-color-picker .hue canvas {
  border: 2px solid #AEAEAE;
  border-radius: 0.33rem;
  height: 100%;
}

[room-color] .hu-color-picker .saturation canvas {
  border: 2px solid #AEAEAE;
  border-radius: 0.33rem;
  overflow: hidden;
}

[room-color] .hu-color-picker .saturation {
  margin-right: 1rem;
}

[room-color] .hu-color-picker .color-alpha,
[room-color] .hu-color-picker .color-show,
[room-color] .hu-color-picker .color-type {
  display: none;
}

[room-color] .colors {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

[room-color] .colors .item {
  border-radius: 100%;
  overflow: hidden;
  height: 2rem;
  margin-left: 0;
  margin-top: 0;
  overflow: hidden;
  width: 2rem;
}

[room-color] .colors .item:hover {
  transform: scale(1.05);
}

[room-color] .colors .item .color {
  border: 2px solid #AEAEAE;
  border-radius: 100%;
  overflow: hidden;
  transition: all .4s;
}

[room-color] .colors .item .color:hover {
  border-color: #FFCC67;
  transition: all .4s;
}
</style>