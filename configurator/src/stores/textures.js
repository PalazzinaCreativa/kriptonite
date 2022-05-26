import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "textures",
  state: () => ({
    list: [],
    roomList: [],
    roomTextures: [
      {
        id: 1,
        name: 'parquet',
        image: '/assets/textures/parquet/parquet_map.jpg',
        thumb: '/assets/textures/parquet/parquet_map.jpg',
        repeat: 10,
        ext: 'jpg',
        maps: ['map', 'aoMap', 'normalMap', 'bumpMap', 'roughnessMap', 'metalnessMap']
      },
      {
        id: 2,
        name: 'bamboo',
        image: '/assets/textures/bamboo/bamboo_map.jpg',
        thumb: '/assets/textures/bamboo/bamboo_map.jpg',
        repeat: [7, 9],
        ext: 'jpg',
        maps: ['map', 'aoMap', 'normalMap', 'bumpMap', 'roughnessMap', 'metalnessMap']
      },
      {
        id: 3,
        name: 'gres_tiles',
        image: '/assets/textures/gres_tiles/gres_tiles_map.jpg',
        thumb: '/assets/textures/gres_tiles/gres_tiles_map.jpg',
        repeat: [1, 2],
        ext: 'jpg',
        maps: ['map', 'aoMap', 'normalMap', 'bumpMap', 'roughnessMap', 'metalnessMap']
      }
    ],
    selectedTexture: null
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
      this.list = response
    },

    async getRoomTextures() {
      this.roomList = this.roomTextures
    },

    setSelectedTexture(texture) {
      this.selectedTexture = texture
    }
  }
});
