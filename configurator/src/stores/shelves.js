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
      this.list = [...this.standardList, ...this.woodenList]
    },

    async getStandardShelves(id) {
      let response = id ? await c.getShelvesByProduct(id) : []
      let completeList = response.length ? response.map((shelf) => {
        if(shelf.variants?.length) {
          shelf.variants.map((variant) => {
            variant.type = 'shelf'
            variant.nature = 'metallo'
            variant.path = variant.model || ''
          })
        }
        return shelf
      }) : []

      // Merge variants of models with the same name and unique by it.
      if(completeList.length) {
        completeList.reduce((oldList, newList) => {
          if(oldList.name && (oldList.name === newList.name)) {
            oldList.variants = [ ...oldList.variants, ...newList.variants]
          }
          return oldList
        })
      }

      this.standardList = completeList.filter((list, i, self) => {
        return self.findIndex(item => item.name === list.name) === i
      })
    },

    async getWoodenShelves(id) {
      let response = id ? await c.getWoodShelvesByProduct(id) : []
      let completeList = response.length ? response.map((shelf) => {
        if(shelf.variants?.length) {
          shelf.variants.map((variant) => {
            variant.type = 'shelf'
            variant.nature = 'legno'
            variant.path = variant.model || ''
          })
        }
        return shelf
      }) : []

      // Merge variants of models with the same name and unique by it.
      if(completeList.length) {
        completeList.reduce((oldList, newList) => {
          if(oldList.name && (oldList.name === newList.name)) {
            oldList.variants = [ ...oldList.variants, ...newList.variants]
          }
          return oldList
        })
      }

      this.woodenList = completeList.filter((list, i, self) => {
        return self.findIndex(item => item.name === list.name) === i
      })
    },

    getVariants(id, hasTexture = false, filters = {}) {
      let list = hasTexture ? this.woodenList : this.standardList
      let item = (list.length && id) ? list.find((shelf) => {
        return shelf.id === id
      }) : {}
      let variants = item?.variants ?? []

      variants = Object.keys(filters).length && variants ? variants.filter((shelf) => {
        return Object.entries(filters).find(([ filter, value ]) => {
          return shelf[filter] === value
        })
      }) : variants

      // Unique by depth
      this.variantsList = variants.length ? variants.filter((variant, i, self) => {
        return self.findIndex(item => item.depth === variant.depth) === i
      }) : []
    }
  }
});
