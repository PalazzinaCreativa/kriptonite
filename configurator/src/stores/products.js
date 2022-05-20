import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "products",
  state: () => ({
    list: [],
    selected: null
  }),

  getters: {
    index: (state) => {
      return state.list
    },

    selectedProduct: (state) => {
      return state.selected
    }
  },
  
  actions: {
    async getProducts() {
      let response = await c.getProducts()
      this.list = response.data
    },

    setSelectedProduct(product) {
      this.selected = product
    }
  }
});
