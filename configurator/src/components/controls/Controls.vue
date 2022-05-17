<template>
  <div class="relative duration-400 transform transition-all" :class="isOpen ? 'w-full' : 'w-0 translate-x-full'">
    <slot />
    <div class="h-full bg-whiteshadow-md flex flex-col relative" v-if="configurator.isReady">
      <SetWallColor @changeColor="color => $emit('changeColor', color)" />
      <div v-if="controls.length">
        <ControlsSection v-for="(control, index) in controls" :key="index" v-bind="control" @activate="setActive($event)" class="z-1">
          <component :is="control.componentInstance"></component>
        </ControlsSection>
      </div>
    </div>
    <div sidebar-trigger class="absolute bottom-[50px] border border-gray bg-white cursor-pointer flex h-8 items-center justify-center rounded-full transform -translate-x-1/2 duration-400 transition-all w-8 hover:border-yellow" :class="isOpen ? '' : 'bg-black border-white text-white -rotate-180 -translate-x-[200%]'" @click="toggleSidebar">
      <Arrow class="text-dark-gray" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import ControlsSection from '@/components/controls/ControlsSection.vue'
import SetWallColor from '@/components/controls/SetWallColor.vue'
import AddObstacles from '@/components/controls/AddObstacles.vue'
import AddUpright from '@/components/controls/AddUpright.vue'
import AddShelf from '@/components/controls/AddShelf.vue'
import Arrow from '@/components/icons/Arrow.vue'
import { useConfiguratorStore } from '../../stores/configurator';
import { controlsList } from '../../dataset/controls'

const configurator = useConfiguratorStore()

controlsList.map((item) => {
  if(item.component) {
    item.componentInstance = computed(() => { return defineAsyncComponent(() => import(`./${item.component}.vue`)) })
  }
})

const controls = ref(controlsList)

const setActive = (index) => {
  controls.value.map((control, i) => {
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