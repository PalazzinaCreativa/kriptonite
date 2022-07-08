<template>
  <div class="border-gray relative duration-400 transform transition-all" :class="isOpen ? 'border-l w-full' : 'border-none translate-x-full'" :style="isOpen ? '' : 'width: 0px;'">
    <div class="h-screen overflow-y-auto pb-12">
      <slot />
      <div class="bg-whiteshadow-md flex flex-col relative" v-if="configurator.isReady">
        <div v-if="controls.length">
          <ControlsSection v-for="(control, index) in controlsList" :key="index" v-bind="control" @activate="setActive($event)" class="z-1">
            <component v-if="control.componentInstance" :is="control.componentInstance"></component>
          </ControlsSection>
        </div>
      </div>
      <div controls-actions class="flex fixed bottom-0 left-0 w-full z-4">
        <!-- <Btn v-if="destroyLabel" class="bg-light-gray w-full" :label="destroyLabel" @click="destroyEverything" /> -->
        <Btn v-if="getProjectShareLabel" class="bg-yellow w-full" :label="getProjectShareLabel" @click="shareProject" />
      </div>
      <div sidebar-trigger class="absolute bottom-[64px] border border-gray bg-white cursor-pointer flex h-8 items-center justify-center rounded-full transform -translate-x-1/2 duration-400 transition-all w-8 hover:border-yellow z-6" :class="isOpen ? '' : 'bg-black border-white text-white -rotate-180 -translate-x-[200%]'" @click="toggleSidebar">
        <Arrow class="text-dark-gray" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import ControlsSection from '@/components/controls/ControlsSection.vue'
import Btn from '@/components/forms/Button.vue'
import Arrow from '@/components/icons/Arrow.vue'
import { useConfiguratorStore } from '../../stores/configurator';

const configurator = useConfiguratorStore()

const props = defineProps(['controls'])
const emits = defineEmits(['share', 'destroy'])
const controlsList = ref(props.controls)

const setActive = (index) => {
  controlsList.value.map((control, i) => {
    control.active = index === i + 1 ? !control.active : false
  })
}

const isOpen = ref(true)

const getProjectShareLabel = 'Condividi'

const destroyLabel = 'Cancella tutto'

const destroyEverything = () => {
  emits('destroy')
}

const shareProject = () => {
  emits('share')
}

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 200)
}
</script>