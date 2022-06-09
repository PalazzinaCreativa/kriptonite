<template>
  <div header class="flex items-center w-full z-1">
    <a href="/">
      <LogoCompact/>
    </a>
    <OptionsList v-if="!config.shared"/>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import LogoCompact from '@/components/LogoCompact.vue'
import OptionsList from '@/components/OptionsList.vue'

const props = defineProps(['config'])
</script>
