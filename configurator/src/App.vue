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
        width: 6.2,
        depth: 1,
        leftHeight: 1.2,
        rightHeight: 2.8
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
      inRoomPosition: "wall",
      uprightsPosition: "wall",
      shelves: [
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 176.37131855292736,
                  y: 102.4,
                  z: 9.25002383344283
              },
              scale: {
                  x: 0.9994999999999497,
                  y: 1,
                  z: 1
              },
              index: 0
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 176.37131855292733,
                  y: 147.20000000000002,
                  z: 9.25002383344283
              },
              scale: {
                  x: 0.9994999999999495,
                  y: 1,
                  z: 1
              },
              index: 0
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 176.37131855292733,
                  y: 204.8,
                  z: 9.25002383344283
              },
              scale: {
                  x: 0.9994999999999495,
                  y: 1,
                  z: 1
              },
              index: 0
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 216.37131855292733,
                  y: 185.60000000000002,
                  z: 9.25002383344283
              },
              scale: {
                  x: 0.9994999999999497,
                  y: 1,
                  z: 1
              },
              index: 1
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 256.3713185529274,
                  y: 153.60000000000002,
                  z: 9.25002383344283
              },
              scale: {
                  x: 0.9994999999999504,
                  y: 1,
                  z: 1
              },
              index: 2
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 256.3713185529274,
                  y: 121.60000000000001,
                  z: 9.25002383344283
              },
              scale: {
                  x: 0.9994999999999509,
                  y: 1,
                  z: 1
              },
              index: 2
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 296.3713185529274,
                  y: 185.60000000000002,
                  z: 9.25002383344283
              },
              scale: {
                  x: 0.999499999999949,
                  y: 1,
                  z: 1
              },
              index: 3
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 346.3713185529274,
                  y: 128,
                  z: 9.25002383344283
              },
              scale: {
                  x: 1.4994999999999234,
                  y: 1,
                  z: 1
              },
              index: 4
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 346.3713185529274,
                  y: 153.60000000000002,
                  z: 9.25002383344283
              },
              scale: {
                  x: 1.4994999999999243,
                  y: 1,
                  z: 1
              },
              index: 4
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 346.3713185529274,
                  y: 172.8,
                  z: 9.25002383344283
              },
              scale: {
                  x: 1.4994999999999243,
                  y: 1,
                  z: 1
              },
              index: 4
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 346.37131855292733,
                  y: 198.4,
                  z: 9.25002383344283
              },
              scale: {
                  x: 1.4994999999999221,
                  y: 1,
                  z: 1
              },
              index: 4
          },
          {
              type: "shelf",
              id: "shelf01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "shelf_01",
              position: {
                  x: 346.37131855292733,
                  y: 217.60000000000002,
                  z: 9.25002383344283
              },
              scale: {
                  x: 1.4994999999999221,
                  y: 1,
                  z: 1
              },
              index: 4
          }
      ],
      uprights: [
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright03",
              position: {
                  x: 156.37131855292736,
                  y: 153.60000000000002,
                  z: 1
              },
              scale: {
                  x: 1.7000000000012272,
                  y: 1.0000000310996449,
                  z: 0.5882319039324431
              }
          },
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright03",
              position: {
                  x: 196.37131855292736,
                  y: 153.60000000000002,
                  z: 1
              },
              scale: {
                  x: 1.7000000000012272,
                  y: 1.0000000310996449,
                  z: 0.5882319039324431
              }
          },
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright03",
              position: {
                  x: 236.37131855292736,
                  y: 153.60000000000002,
                  z: 1
              },
              scale: {
                  x: 1.7000000000012272,
                  y: 1.0000000310996449,
                  z: 0.5882319039324431
              }
          },
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright03",
              position: {
                  x: 276.3713185529274,
                  y: 153.60000000000002,
                  z: 1
              },
              scale: {
                  x: 1.7000000000012272,
                  y: 1.0000000310996449,
                  z: 0.5882319039324431
              }
          },
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright03",
              position: {
                  x: 316.3713185529274,
                  y: 153.60000000000002,
                  z: 1
              },
              scale: {
                  x: 1.7000000000012272,
                  y: 1.0000000310996449,
                  z: 0.5882319039324431
              }
          },
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright03",
              position: {
                  x: 376.3713185529274,
                  y: 153.60000000000002,
                  z: 1
              },
              scale: {
                  x: 1.7000000000012272,
                  y: 1.0000000310996449,
                  z: 0.5882319039324431
              }
          }
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
