<template>
  <div class="flex items-center justify-center w-full">
    <div v-for="(optionItem, index) in optionItems" :key="index" class="flex items-center">
      <div v-if="index > 0" class="bg-gray h-[1px] w-7"></div>
      <OptionsItem v-text="optionItem.label" :isSelected="optionItem === selectedOption" @click="selectOption(optionItem)"/>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import OptionsItem from '@/components/OptionsItem.vue'

  const optionItems = [
    { label: 'Opzioni' },
    { label: 'Opzioni stanza' }
  ]

  const selectedOption = ref(optionItems[0])

  const selectOption = (option) => {
    selectedOption.value = option
  }
</script>