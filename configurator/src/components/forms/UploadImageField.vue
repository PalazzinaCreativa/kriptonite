<template>
  <label :for="name" class="relative flex gap-8 group w-full" @dragover.prevent @drop.prevent>
    <div drag-area @drop="uploadFile($event, 'drag')" class="border border-dark-gray border-dashed cursor-pointer rounded-lg overflow-hidden flex flex-wrap items-center w-full hover:border-yellow transition duration-300" :class="filePreview ? '' : 'p-8'">
      <div v-if="!hasFiles" class="flex flex-wrap items-center justify-center gap-4 w-full">
        <Picture class="mx-auto text-black w-full" />
        <span class="inline-block text-center w-full" v-html="dragAreaCta" />
      </div>
      <div v-else class="flex h-full w-full">
        <ul v-for="file in files" :key="file" class="flex justify-center w-full">
          <li>
            <img preview v-if="filePreview" :src="filePreview" :key="filePreview" class="w-full h-full object-cover" width="200" height="100" alt="wall" />
            <span v-else class="text-xs break-all" v-text="file.name" />
          </li>
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
const filePreview = ref('')

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
const emitValue = async (value) => {
  if(value.length) {
    let uploadedFiles = props.multiple ? value : value[0]
    filePreview.value = await getBase64(value[0])
    emits('update:modelValue', uploadedFiles)
  }
}

const errorMessage = computed(() => 'Questo campo è obbligatorio.') //props.error?.message

const uploadFile = (event, type = 'default') => {
  let uploadedFiles = type === 'default' ? Array.from(event.target.files) : Array.from(event.dataTransfer.files)
  if(uploadedFiles.length) {
    files.value = uploadedFiles
    emitValue(files.value)
  }
}

const dragAreaCta = computed(() => 'Carica foto')

const getBase64 = (file) => {
  return file ? new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject('Error:', error)
  }) : ''
}
</script>