<script setup>
import { useConfiguratorStore } from "@/stores/configurator"
import { computed } from "vue";

const configurator = useConfiguratorStore()

</script>

<template>
  <div class="w-full h-full bg-white p-5 absolute inset-0 z-20">
    <div class="mb-5" @click="$emit('close')">&lt; Chiudi</div>
    <div v-for="(item, name) of configurator.productList" :key="name">
      <strong>{{ name }} x{{ item.quantity }}</strong> <br>
      {{ item.id }} <br>
      {{ item.scale.x }}
    </div>
  </div>
</template>