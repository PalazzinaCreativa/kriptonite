import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export const useUprightsStore = defineStore({
  id: "uprights",
  state: () => ({
    list: []
  }),

  getters: {
    index: (state) => {
      return state.list
    }
  },
  
  actions: {
    async getUprights(id) {
      let response = await c.getUprightsByProduct(id)
      this.list = response.data
    }
  }
});
