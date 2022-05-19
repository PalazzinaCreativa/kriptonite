import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "textures",
  state: () => ({
    list: [],
  }),

  getters: {
    index: (state) => {
      return state.list
    }
  },
  
  actions: {
    async getTextures() {
      let response = await c.getTextures()
      this.list = response
    }
  }
});
