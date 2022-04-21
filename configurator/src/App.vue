<script setup>
import Survey from '@/components/Survey.vue'
import Configurator from '@/components/Configurator.vue'
import { ref } from 'vue'

const config = ref(null)
const showConfigurator = ref(false)

const defaultConfig = {
  step: 4,
    room: {
      composition: "brick",
      type: "classic",
      dimensions: {
        height: 2.8,
        width: 6.2
      },
      obstacles: [
        // {
        //   id: "sofa",
        //   position: {
        //     x: 168.30695858833244,
        //     y: 55,
        //     z: 40
        //   },
        //   scale: {
        //     x: 140,
        //     y: 166.83451038953075,
        //     z: 95.38593681553574
        //   }
        // },
        // {
        //   id: "window",
        //   position: {
        //     x: 478.53036376672526,
        //     y: 141.74309580024732,
        //     z: 2.499999999999999
        //   },
        //   scale: {
        //     x: 48.07692484037417,
        //     y: 77.46479316912608,
        //     z: 39.05582413475731
        //   }
        // }
      ]
    },
    product: {
      type: "k1",
      inRoomPosition: "standalone",
      uprightsPosition: 'ground',
      shelves: [],
      uprights: [
        // {
        //   id: "upright01",
        //   variantId: "upright03",
        //   index: 0,
        //   realIndex: 0,
        //   position: {
        //     x: 64.83417138641065,
        //     y: 192,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7000000000012272,
        //     y: 1.0000000310996449,
        //     z: 0.5882319039324431
        //   }
        // },
        // {
        //   id: "upright01",
        //   variantId: "upright03",
        //   index: 1,
        //   realIndex: 1,
        //   position: {
        //     x: 124.59074768708271,
        //     y: 192,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7000000000012272,
        //     y: 1.0000000310996449,
        //     z: 0.5882319039324431
        //   }
        // },
        // {
        //   id: "upright01",
        //   variantId: "upright03",
        //   index: 2,
        //   realIndex: 2,
        //   position: {
        //     x: 214.80687880273885,
        //     y: 192,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7000000000012272,
        //     y: 1.0000000310996449,
        //     z: 0.5882319039324431
        //   }
        // },
        // {
        //   id: "upright01",
        //   variantId: "upright01",
        //   index: 3,
        //   realIndex: 3,
        //   position: {
        //     x: 254.65272348088376,
        //     y: 192,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7000000000012272,
        //     y: 1.0000000310996449,
        //     z: 0.5882319039324431
        //   }
        // },
        // {
        //   id: "upright01",
        //   variantId: "upright05",
        //   index: 4,
        //   realIndex: 4,
        //   position: {
        //     x: 344.89143854677707,
        //     y: 134.4,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7,
        //     y: 1.000000032393931,
        //     z: 0.5882295096856646
        //   }
        // },
        // {
        //   id: "upright01",
        //   variantId: "upright05",
        //   index: 5,
        //   realIndex: 5,
        //   position: {
        //     x: 404.8200365084119,
        //     y: 134.4,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7,
        //     y: 1.000000032393931,
        //     z: 0.5882295096856646
        //   }
        // },
        // {
        //   id: "upright01",
        //   variantId: "upright01",
        //   index: 6,
        //   realIndex: 6,
        //   position: {
        //     x: 494.2650443252532,
        //     y: 230.4,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7000000000017181,
        //     y: 1.0000000262141615,
        //     z: 0.5882339727633173
        //   }
        // },
        // {
        //   id: "upright01",
        //   variantId: "upright01",
        //   index: 6,
        //   realIndex: 7,
        //   position: {
        //     x: 494.5986891114002,
        //     y: 44.800000000000004,
        //     z: 1
        //   },
        //   scale: {
        //     x: 1.7000000000017181,
        //     y: 1.0000000262141615,
        //     z: 0.5882339727633173
        //   }
        // }
      ]
    }
}

const handleGoToConfigurator = () => {
  config.value = defaultConfig
  showConfigurator.value = true
}

const start = (payload) => {
  config.value = payload
  showConfigurator.value = true
}
</script>

<template>
  <div>
    <div class="fixed right-12 bottom-12 underline text-black cursor-pointer z-50" @click="handleGoToConfigurator">
      Go to configurator
    </div>
    <Survey @start="start" v-if="!showConfigurator" />
    <Configurator :config="config" v-else />
  </div>
</template>

<style>
body {
  font-family: 'din-2014', sans-serif;
  @apply text-black;
}

strong {
  @apply font-semi-bold;
}
</style>