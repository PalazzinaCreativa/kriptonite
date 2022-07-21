<template>
  <div class="flex items-center justify-center w-full">
    <div v-for="(optionItem, index) in optionItems" :key="index" class="flex items-center">
      <div v-if="index > 0" class="bg-gray h-[1px] w-7"></div>
      <OptionsItem :isSelected="optionItem.id === selectedOption.id" :icon="optionItem.icon" @click="selectOption(optionItem)">
        <span v-text="optionItem.label"></span>
      </OptionsItem>
    </div>
  </div>
</template>
<script setup>
  import { ref, computed } from 'vue'
  import useOptionsStore from '@/stores/options'
  import OptionsItem from '@/components/OptionsItem.vue'

  const optionsModule = useOptionsStore()
  const optionItems = computed(() => optionsModule.index)

  const selectedOption = computed(() => optionsModule.selected)

  const selectOption = (option) => {
    optionsModule.setSelectedOption(option)
  }
</script>