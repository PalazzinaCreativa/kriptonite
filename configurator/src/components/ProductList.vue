<template>
  <div class="absolute bg-white flex-col flex h-screen overflow-y-auto w-full py-8 px-6 z-5">
    <div products-list-header class="bg-light-gray flex fixed top-0 left-0 items-center justify-between py-4 px-6 w-full">
      <div v-text="'Lista prodotti usati'" />
      <Close class="cursor-pointer" @click="close" />
    </div>
    <div products-list-content class="grow my-16 w-full">
      <div v-if="productList.length">
        <div v-for="(item, name) in productList" :key="name">
        <strong>{{ name }} x{{ item.quantity }}</strong> <br>
        {{ item.id }} <br>
        {{ item.scale.x }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits } from "vue";
import { useConfiguratorStore } from "@/stores/configurator"
import Close from '@/components/icons/Close.vue'

const emits = defineEmits(['close'])

const configurator = useConfiguratorStore()

const productList = computed(() => configurator.productList)

const close = () => {
  emits('close')
}
</script>