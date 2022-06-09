<template>
    <div v-if="route?.params?.id" v-text="route.params.id" />
</template>
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfiguratorStore } from '@/stores/configurator'

const route = useRoute()
const configurator = useConfiguratorStore()

onMounted(() => {
    console.log(route)
})
</script>