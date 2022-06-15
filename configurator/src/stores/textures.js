import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "textures",
  state: () => ({
    list: [
      /* {
        id: 3,
        name: "wood-light",
        label: 'Rovere',
        createdAt:"2022-05-10T08:57:13.477Z",
        updatedAt:"2022-05-10T08:57:14.405Z",
        publishedAt:"2022-05-10T08:57:14.401Z",
        ext: 'jpg',
        maps: [
          'map',
          'normalMap',
          'bumpMap',
          'roughnessMap',
          'metalnessMap'
        ],
        repeat: 2,
        thumb:'/assets/textures/wood-light/wood-light_map.jpg'
      },
      {
        id: 4,
        name: "wood-light-2",
        label: 'Rovere dark',
        createdAt:"2022-05-10T08:57:13.477Z",
        updatedAt:"2022-05-10T08:57:14.405Z",
        publishedAt:"2022-05-10T08:57:14.401Z",
        ext: 'jpg',
        maps: ['map', 'aoMap', 'normalMap', 'bumpMap', 'roughnessMap', 'metalnessMap'],
        repeat: 2,
        thumb:'/assets/textures/wood-light-2/wood-light-2_map.jpg'
      },
      {
        id: 5,
        name: "wood-dark-2",
        label: 'Canaletto',
        createdAt:"2022-05-10T08:57:13.477Z",
        updatedAt:"2022-05-10T08:57:14.405Z",
        publishedAt:"2022-05-10T08:57:14.401Z",
        ext: 'jpg',
        maps: [
          'map',
          'normalMap',
          'bumpMap',
          'roughnessMap',
          'metalnessMap'
        ],
        repeat: 2,
        thumb:'/assets/textures/wood-dark-2/wood-dark-2_map.jpg'
      },
      {
        id: 6,
        name: "wood-dark",
        label: 'Canaletto dark',
        createdAt:"2022-05-10T08:57:13.477Z",
        updatedAt:"2022-05-10T08:57:14.405Z",
        publishedAt:"2022-05-10T08:57:14.401Z",
        ext: 'jpg',
        maps: [
          'map',
          'normalMap',
          'bumpMap',
          'roughnessMap',
          'metalnessMap'
        ],
        repeat: 2,
        thumb:'/assets/textures/wood-dark/wood-dark_map.jpg'
      } */
    ],
    roomList: [],
    roomTextures: [
      /* {
        id: 1,
        name: 'parquet',
        thumb: '/assets/textures/parquet/parquet_map.jpg',
        repeat: 10,
        ext: 'jpg',
        maps: [
          'map',
          'aoMap',
          'normalMap',
          'bumpMap',
          'roughnessMap',
          'metalnessMap'
        ]
      }, */
      {
        id: 2,
        name: 'bamboo',
        thumb: '/assets/textures/bamboo/bamboo_map.jpg',
        repeat: [7, 9],
        ext: 'jpg',
        isStatic: true,
        maps: [
          'map',
          'aoMap',
          'normalMap',
          'bumpMap',
          'roughnessMap',
          'metalnessMap'
        ]
      },
      /* {
        id: 3,
        name: 'gres_tiles',
        thumb: '/assets/textures/gres_tiles/gres_tiles_map.jpg',
        repeat: [1, 2],
        ext: 'jpg',
        maps: [
          'map',
          //'aoMap',
          //'normalMap',
          //'bumpMap',
          //'roughnessMap',
          'metalnessMap'
        ]
      }, */
      {
        id: 4,
        name: 'tiles',
        thumb: '/assets/textures/tiles/tiles_map.jpg',
        repeat: [2, 3.5],
        ext: 'jpg',
        isStatic: true,
        maps: [
          'map',
          'aoMap',
          'normalMap',
          'bumpMap',
          'roughnessMap',
          'metalnessMap'
        ]
      }
    ],
    selectedTexture: {}
  }),

  getters: {
    index: (state) => {
      return state.list
    },

    roomIndex: (state) => {
      return state.roomList
    },

    selected: (state) => {
      return state.selectedTexture
    }
  },
  
  actions: {
    async getTextures() {
      let response = await c.getTextures()
      this.list = response.length ? response.map((texture) => {
        texture.thumb = texture.map?.url || ''
        texture.label = typeof texture.label !== 'undefined' ? texture.label : texture.name
        texture.ext = 'jpg'
        return texture
      }).sort((a, b) => a.id - b.id) : this.list
    },

    async getRoomTextures() {
      this.roomList = this.roomTextures
    },

    setSelectedTexture(texture) {
      this.selectedTexture = texture
    }
  }
});
