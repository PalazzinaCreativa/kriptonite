<template>
    <div>share</div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfiguratorStore } from '@/stores/configurator'

const route = useRoute()
const configurator = useConfiguratorStore()

onMounted(() => {
    //console.log(route)
})
</script>