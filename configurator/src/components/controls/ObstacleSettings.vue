<template>
  <div element-settings class="flex flex-col justify-center gap-10 w-[300px] mx-auto">
    <NumberField class="w-full" :model-value="element.config.width" name="width" label="Larghezza" append="cm" @update:model-value="updateSize({ width: $event })"/>
    <NumberField class="w-full" :model-value="element.config.height" name="height" label="Altezza" append="cm" @update:model-value="updateSize({ height: $event })"/>
    <NumberField class="w-full" :model-value="element.config.depth" name="depth" label="Profondità" append="cm" @update:model-value="updateSize({ depth: $event })"/>
  </div>
</template>

<script setup>
  import { ref, defineProps, defineEmits, onMounted } from 'vue';
  import NumberField from '@/components/forms/NumberField.vue'

  const props = defineProps(['element'])
  const emits = defineEmits(['input'])

  const updateSize = (dimension) => {
    emits('input', { ...props.element.config, ...dimension })
  }

  onMounted(() => {
    if(props.element.config) {
      props.element.setSize(props.element.config)
    }
  })
</script>