<template>
  <div class="border-l border-gray relative duration-400 transform transition-all" :class="isOpen ? 'w-full' : 'w-0 translate-x-full'">
    <slot />
    <div class="h-full bg-whiteshadow-md flex flex-col relative" v-if="configurator.isReady">
      <div v-if="controls.length">
        <ControlsSection v-for="(control, index) in controlsList" :key="index" v-bind="control" @activate="setActive($event)" class="z-1">
          <component v-if="control.componentInstance" :is="control.componentInstance"></component>
        </ControlsSection>
      </div>
    </div>
    <div sidebar-trigger class="absolute bottom-[64px] border border-gray bg-white cursor-pointer flex h-8 items-center justify-center rounded-full transform -translate-x-1/2 duration-400 transition-all w-8 hover:border-yellow z-5" :class="isOpen ? '' : 'bg-black border-white text-white -rotate-180 -translate-x-[200%]'" @click="toggleSidebar">
      <Arrow class="text-dark-gray" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import ControlsSection from '@/components/controls/ControlsSection.vue'
import Arrow from '@/components/icons/Arrow.vue'
import { useConfiguratorStore } from '../../stores/configurator';

const configurator = useConfiguratorStore()

const props = defineProps(['controls'])
const controlsList = ref(props.controls)

const setActive = (index) => {
  controlsList.value.map((control, i) => {
    control.active = index === i + 1 ? !control.active : false
  })
}

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 150)
}
</script>