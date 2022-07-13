<template>
  <div element-settings class="flex flex-col justify-center gap-10 w-[300px] mx-auto">
    <NumberField class="w-full" :model-value="obstacle.config.width" name="width" label="Larghezza" append="cm" :readonly="isReadonly" @update:model-value="updateSize({ width: $event })"/>
    <NumberField class="w-full" :model-value="obstacle.config.height" name="height" label="Altezza" append="cm" :readonly="isReadonly" @update:model-value="updateSize({ height: $event })"/>
    <NumberField class="w-full" :model-value="obstacle.config.depth" name="depth" label="Profondità" append="cm" :readonly="isReadonly" @update:model-value="updateSize({ depth: $event })"/>
  </div>
</template>

<script setup>
  import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
  import NumberField from '@/components/forms/NumberField.vue'

  const props = defineProps(['element'])
  const emits = defineEmits(['input'])

  const obstacle = ref(props.element)

  const updateSize = (dimension) => {
    obstacle.value.config = { ...obstacle.value.config, ...dimension }
    console.log({ ...obstacle.value.config, ...dimension })
    emits('input', obstacle.value.config)
  }

  const isReadonly = computed(() => {
    return props.element.isEdit
  })

  onMounted(() => {
    if(props.element.config) {
      props.element.setSize(props.element.config)
    }
  })
</script>