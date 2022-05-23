import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "shelves",
  state: () => ({
    list: [],
    standardList: [],
    woodenList: [],
    variantsList: []
  }),

  getters: {
    index: (state) => {
      return state.list
    },

    standardShelves: (state) => {
      return state.standardList
    },

    woodenShelves: (state) => {
      return state.woodenList
    },

    variants: (state) => {
      return state.variantsList
    }
  },
  
  actions: {
    async getShelves(id) {
      await this.getStandardShelves(id)
      await this.getWoodenShelves(id)
      console.log(this.standardList, this.woodenList)
      this.list = [...this.standardList, ...this.woodenList]
    },

    async getStandardShelves(id) {
      let response = id ? await c.getShelvesByProduct(id) : []
      this.standardList = response.length ? response.map((shelf) => {
        if(shelf.variants?.length) {
          shelf.variants.map((variant) => {
            variant.type = 'shelf'
            variant.material = 'metal'
            variant.path = variant.model || ''
          })
        }
        return shelf
      }) : []
    },

    async getWoodenShelves(id) {
      let response = id ? await c.getWoodShelvesByProduct(id) : []
      this.woodenList = response.length ? response.map((shelf) => {
        if(shelf.variants?.length) {
          shelf.variants.map((variant) => {
            variant.type = 'shelf'
            variant.material = 'wood'
            variant.path = variant.model || ''
          })
        }
        return shelf
      }) : []
    },

    getVariants(id) {
      let fullVariantList = (this.list.length && id) ? this.list.filter((shelf) => {
        return shelf.id === id
      })[0].variants : []

      // Unique by depth
      this.variantsList = fullVariantList.length ? fullVariantList.filter((variant, i, self) => {
        return self.findIndex(item => item.depth === variant.depth) === i
      }) : []
    }
  }
});
