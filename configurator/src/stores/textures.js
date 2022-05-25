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
        name: 'parquet',
        image: '/assets/textures/parquet/parquet_map.jpg',
        thumb: '/assets/textures/parquet/parquet_map.jpg',
        repeat: 20,
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
