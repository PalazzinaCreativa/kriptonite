<template>
  <label :for="props.name" class="relative group" @dragover.prevent @drop.prevent>
    <span v-if="props.label" label v-text="props.label" class="absolute flex items-center left-4 transform transition-all duration-300 px-1 group-focus-within:bg-white group-focus-within:text-xxs group-focus-within:-translate-y-1/2 group-focus-within:h-auto z-2" :class="files ? 'bg-white text-xxs -translate-y-1/2 h-auto' : 'h-full'" @click="focusOnInput($event)"/>
    <input type="file" :id="props.name" :multiple="props.multiple" :name="props.name" :readonly="props.readonly" :disabled="props.disabled" class="border border-dark-gray rounded-lg text-current px-4 py-3 focus:border-yellow focus:outline-none" @change="uploadFile" @update:modelValue="emitValue($event)"/>
    <div @drop="dragFile" style="background-color:green;margin-bottom:10px;padding:10px;">
        Or drag the file here
        <div v-if="hasFiles">
          <ul v-for="file in files" :key="file">
            <li>{{file.name}}</li>
          </ul>
        </div>
      </div>
    <span v-if="props.append" append v-text="props.append" class="absolute bg-white right-4 top-1/2 inline-block flex pl-4 transform -translate-y-1/2 items-center" @click="focusOnInput($event)"/>
  </label>
</template>
<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
const props = defineProps({
  label: String,
  name: String,
  modelValue: Array,
  multiple: {
    type: Boolean,
    default: false
  },
  append: String,
  readonly: Boolean,
  disabled: Boolean
})
const emits = defineEmits(['update:modelValue'])
const files = ref([]);
/* const files = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    return newValue
  }
}) */

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
const emitValue = (value) => emits('update:modelValue', value)

const uploadFile = (event) => {
  files.value = event.target.files
  emitValue(Array.from(files.value))
  console.log(Array.isArray(Array.from(files.value)))
}

const dragFile = (event) => {
  files.value = props.multiple ? event.dataTransfer.files : event.dataTransfer.files?.length ? [event.dataTransfer.files[0]] : event.dataTransfer.files
  emitValue(files.value)
  console.log(Array.isArray(files.value))
}
</script>