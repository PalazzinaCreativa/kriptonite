import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "colors",
  state: () => ({
    list: [],
    selectedColor: null
  }),

  getters: {
    index: (state) => {
      return state.list
    },

    selected: (state) => {
      return state.selectedColor
    }
  },
  
  actions: {
    async getColors() {
      let response = await c.getColors()
      this.list = response
    },

    setSelectedColor(color) {
      this.selectedColor = color
    }
  }
});
