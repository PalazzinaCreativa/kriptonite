import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "textures",
  state: () => ({
    list: [],
    selectedTexture: null
  }),

  getters: {
    index: (state) => {
      return state.list
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

    setSelectedTexture(texture) {
      this.selectedTexture = texture
    }
  }
});
