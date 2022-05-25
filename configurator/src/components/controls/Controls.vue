<template>
  <div class="relative duration-400 transform transition-all" :class="isOpen ? 'w-full' : 'w-0 translate-x-full'">
    <slot />
    <div class="h-full bg-whiteshadow-md flex flex-col relative" v-if="configurator.isReady">
      <SetWallColor @changeColor="color => $emit('changeColor', color)" />
      <div v-if="controls.length">
        <ControlsSection v-for="(control, index) in controlsList" :key="index" v-bind="control" @activate="setActive($event)" class="z-1">
          <component v-if="control.componentInstance" :is="control.componentInstance"></component>
        </ControlsSection>
      </div>
    </div>
    <div sidebar-trigger class="absolute bottom-[50px] border border-gray bg-white cursor-pointer flex h-8 items-center justify-center rounded-full transform -translate-x-1/2 duration-400 transition-all w-8 hover:border-yellow z-3" :class="isOpen ? '' : 'bg-black border-white text-white -rotate-180 -translate-x-[200%]'" @click="toggleSidebar">
      <Arrow class="text-dark-gray" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
//import { controlsList } from '../../dataset/controls'
import ControlsSection from '@/components/controls/ControlsSection.vue'
import SetWallColor from '@/components/controls/SetWallColor.vue'
import Arrow from '@/components/icons/Arrow.vue'
import { useConfiguratorStore } from '../../stores/configurator';

const configurator = useConfiguratorStore()

const props = defineProps(['controls'])

const controlsList = ref(props.controls)

const setActive = (index) => {
  controlsList.value.map((control, i) => {
    control.active = index === i + 1
  })
}

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<style>
.hu-color-picker canvas {
  max-width: 100%;
}
</style>