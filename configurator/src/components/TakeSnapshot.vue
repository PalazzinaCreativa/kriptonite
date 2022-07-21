<template>
  <div snapshot>
    <Btn v-if="label" :label="label" @click="takeSnapshot" class="bg-light-gray text-current" />
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import Btn from '@/components/forms/Button.vue'

import { useConfiguratorStore } from '@/stores/configurator'

// Caricamento dello store "Configuratore"
const configurator = useConfiguratorStore()

const props = defineProps(
 {
  config: {
    type: Object,
    required: true
  },
  label: {
    //default: 'Scatta foto alla configurazione',
    type: String
  },
  mimeType: {
    default: 'image/jpeg',
    type: String
  },
  immediate: {
    default: false,
    type: Boolean
  },
  download: {
    default: false,
    type: Boolean
  }
 }
)
const emits = defineEmits(['snapshot-taken'])

const renderer = ref(configurator.viewerGetter().composer.renderer)

const scene = ref(configurator.viewerGetter().scene)

const camera = ref(configurator.viewerGetter().camera)

const controls = ref(configurator.viewerGetter().controls)

const canvas = ref(null)

const image = ref(null)

onMounted(() => {
  if(props.immediate) {
    takeSnapshot()
  }
})

const takeSnapshot = async () => {
  try {
    // Dimensioni della stanza
    const { width, height, depth } = props.config.room.dimensions
    // Orientamento della camera per lo snapshot con animazione gsap
     gsap.to(
      [ camera.value.position, controls.value.target ],
      {
        ...{ x: width / 3.5, y: height / 2, z: depth * 8 },
        ease: 'power4.out',
        duration: 1.5,
        onUpdate: () => {
          controls.value.target.set(width / 2.75, height / 2, 0)
          controls.value.update()
        }
      }
    )
    // Scatto dello snapshot e conversione in Base64
    window.requestAnimationFrame(async () => {
      image.value = await renderer.value.domElement.toDataURL(props.mimeType);
      if(props.download){
        downloadFile(image.value, `${configurator.configuration?.code}.jpg`);
      }
      emits('snapshot-taken', image.value)
    })
  } catch (e) {
    console.log(e)
    return
  }
}

const downloadFile = (data, filename) => {
  var link = document.createElement('a')
  if (typeof link.download === 'string') {
    document.body.appendChild(link);
    link.download = filename;
    link.href = data;
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(data.replace('image/octet-stream', 'application/octet-stream'));
  }
}
</script>