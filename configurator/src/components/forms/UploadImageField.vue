<template>
  <label :for="name" class="relative flex gap-8 group w-full" @dragover.prevent @drop.prevent>
    <div drag-area @drop="dragFile" class="border border-dark-gray border-dashed cursor-pointer p-8 rounded-lg flex flex-wrap items-center w-full hover:border-yellow transition duration-300">
      <div v-if="!hasFiles" class="flex flex-wrap items-center justify-center gap-4">
        <Picture class="mx-auto text-black w-full" />
        <span class="inline-block text-center w-full" v-html="dragAreaCta" />
      </div>
      <div v-else>
        <ul v-for="file in files" :key="file">
          <li v-text="file.name" class="text-xs break-all" />
        </ul>
      </div>
    </div>
    <div class="flex-col gap-x-4 w-full">
      <div v-if="label" label v-text="label" class="text-m font-semibold mb-4" />
      <slot/>
      <input type="file" :id="props.name" :multiple="props.multiple" :name="props.name" :readonly="props.readonly" :disabled="props.disabled" class="sr-only border border-dark-gray rounded-lg text-current px-4 py-3 focus:border-yellow focus:outline-none" @change="uploadFile" @update:modelValue="emitValue($event)"/>
    </div>
    <span v-if="error && errorMessage" class="inline-block text-xxs text-red mt-2 leading-4" v-text="errorMessage" />
  </label>
</template>
<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import Picture from '@/components/icons/Picture.vue'

const props = defineProps({
  label: String,
  name: String,
  modelValue: [Array, File],
  multiple: {
    type: Boolean,
    default: false
  },
  append: String,
  readonly: Boolean,
  disabled: Boolean,
  error: [String, Object]
})

const emits = defineEmits(['update:modelValue'])
const files = ref([]);

onMounted(() => {
  files.value = props.modelValue
})

const hasFiles = computed(() => files.value.length > 0)

const focusOnInput = (event) => {
  if(event.target.nextElementSibling) {
    event.target.nextElementSibling.focus()
  } else {
    event.target.previousElementSibling.focus()
  }
}
const emitValue = (value) => {
  let files = props.multiple ? value : value[0]
  emits('update:modelValue', files)
}

const errorMessage = computed(() => 'Questo campo è obbligatorio.') //props.error?.message

const uploadFile = (event) => {
  files.value = event.target.files
  emitValue(Array.from(files.value))
}

const dragFile = (event) => {
  files.value = props.multiple ? event.dataTransfer.files : event.dataTransfer.files?.length ? [event.dataTransfer.files[0]] : event.dataTransfer.files
  emitValue(files.value)
}

const dragAreaCta = computed(() => 'Carica foto')
</script>