<template>
  <div>
    <div v-show="canConfigure">
      <Survey v-if="!showConfigurator && products.length" @start="start"/>
      <Configurator v-if="showConfigurator && config" :config="config" />
      <div v-if="!showConfigurator && devMode" class="fixed right-12 bottom-12 underline text-black cursor-pointer z-3" @click="handleGoToConfigurator">
      Go to configurator
      </div>
    </div>
    <DeviceNotAllowedAlert v-if="!canConfigure" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useProductsStore from '@/stores/products'
import Survey from '@/components/Survey.vue'
import Configurator from '@/components/Configurator.vue'
import DeviceNotAllowedAlert from '@/components/DeviceNotAllowedAlert.vue'

const productsModule = useProductsStore()
productsModule.getProducts()

const config = ref(null)
const showConfigurator = ref(false)
const devMode = ref(import.meta.env.DEV)
const viewportWidth = ref(window.innerWidth)
const orientation = ref(window.screen.orientation.type)
const userAgent = ref(false)
const canConfigure = computed(() => {
  return orientation.value === 'landscape-primary' && viewportWidth.value >= 900
})

const checkDeviceSpecs = () => {
  orientation.value = window.screen.orientation.type
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener("resize", checkDeviceSpecs);
})

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

const fastConfigK1 = {
  step: 4,
    room: {
      composition: "brick",
      type: "classic",
      dimensions: {
        height: 2.8,
        width: 3.5,
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
      id: 1,
      type: "k1",
      inRoomPosition: "wall",
      uprightsPosition: "wall",
      /* shelves: [
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
      ], */
      /* uprights: [
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright_s_tele",
              position: {
                  x: 156.37131855292736,
                  y: 125,
                  z: 200
              },
              scale: {
                  x: 1,
                  y: 1,
                  z: 1
              }
          },
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#FF0000",
                  opacity: 1
              },
              variantId: "upright_s",
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
          }
      ] */
    }
}

const defaultConfigK2 = {
  step: 4,
    room: {
      composition: "brick",
      type: "niche",
      dimensions: {
        height: 2.8,
        width: 3,
        depth: 1,
        leftHeight: 1.6,
        rightHeight: 0.6
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
      id: 1,
      type: "k1",
      inRoomPosition: "wall",
      uprightsPosition: "standalone",
      /* shelves: [
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
      ], */
      /* uprights: [
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#4a4a4a",
                  opacity: 1
              },
              variantId: "upright_s_tele",
              position: {
                  x: 156.37131855292736,
                  y: 125,
                  z: 200
              },
              scale: {
                  x: 1,
                  y: 1,
                  z: 1
              }
          },
          {
              type: "upright",
              id: "upright01",
              material: {
                  color: "#FF0000",
                  opacity: 1
              },
              variantId: "upright_s",
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
          }
      ] */
    }
}

const products = computed(() => productsModule.index)

const setSelectedProduct = (product) => {
  const selectedProduct = product.type ? products.value.find((item) => {
    return item.sku === product.type
  }) : products.value[0]
  config.value.product.id = selectedProduct.id
  productsModule.setSelectedProduct(selectedProduct)
}

const handleGoToConfigurator = () => {
  const selectedConfig = defaultConfigK2 //defaultConfig //fastConfigK1 //defaultConfigK2
  config.value = selectedConfig
  setSelectedProduct(selectedConfig.product)
  showConfigurator.value = true
}

const start = (payload) => {
  config.value = payload
  setSelectedProduct(payload.product)
  showConfigurator.value = true
}
</script>