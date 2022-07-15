import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "cases",
  state: () => ({
    list: [],
    standardList: [],
    woodenList: [],
    variantsList: [],
    selectedElementVariantsList: []
  }),

  getters: {
    index: (state) => {
      return state.list
    },

    standardCases: (state) => {
      return state.standardList
    },

    woodenCases: (state) => {
      return state.woodenList
    },

    variants: (state) => {
      return state.variantsList
    },

    currentElementVariantsList: (state) => {
      return state.selectedElementVariantsList
    }
  },
  
  actions: {
    async getCases(id) {
      await this.getStandardCases(id)
      await this.getWoodenCases(id)
      this.list = [...this.standardList, ...this.woodenList]
    },

    async getStandardCases(id) {
      let response = id ? await c.getCasesByProduct(id) : []
      let completeList = response.length ? response.map((item) => {
        if(item.variants?.length) {
          item.variants.map((variant) => {
            variant.type = 'case'
            variant.nature = 'metallo'
            variant.path = variant.model || ''
          })
        }
        return item
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

    async getWoodenCases(id) {
      let response = id ? await c.getWoodCasesByProduct(id) : []
      let completeList = response.length ? response.map((item) => {
        if(item.variants?.length) {
          item.variants.map((variant) => {
            variant.type = 'case'
            variant.nature = 'legno'
            variant.path = variant.model
          })
        }
        return item
      }) : []

      // Merge variants of models with the same name and unique by it.
      if(completeList.length) {
        completeList.map((element, index) => {
          completeList.reduce((oldList, newList) => {
            if(element.name && (element.name === newList.name)) {
              element.variants = [ ...element.variants, ...newList.variants].filter((variant, i, self) => {
                return self.findIndex(item => item.id === variant.id) === i
              })
            }
            return completeList
          })
        })
      }

      this.woodenList = completeList.filter((list, i, self) => {
        return self.findIndex(item => item.name === list.name) === i
      })
    },

    getVariants(id, hasTexture = false, filters = {}) {
      let list = hasTexture ? this.woodenList : this.standardList
      let item = (list.length && id) ? list.find((item) => {
        return item.id === id
      }) : {}
      let variants = item?.variants ?? []

      console.log(variants, filters)

      
      variants = Object.keys(filters).length && variants ? variants.filter((item) => {
        return Object.entries(filters).find(([ filter, value ]) => {
          return item[filter] === value
        })
      }) : variants

      this.selectedElementVariantsList = variants
      
      // Unique by depth
      this.variantsList = variants.length ? variants.filter((variant, i, self) => {
        return self.findIndex(item => item.depth === variant.depth) === i
      }) : []
    }
  }
});
