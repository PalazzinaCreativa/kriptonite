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
    variantsList: []
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
      this.standardList = response.length ? response.map((item) => {
        if(item.variants?.length) {
          item.variants.map((variant) => {
            variant.type = 'case'
            variant.nature = 'metallo'
            variant.path = variant.model || ''
          })
        }
        return item
      }) : []
    },

    async getWoodenCases(id) {
      let response = id ? await c.getWoodCasesByProduct(id) : []
      this.woodenList = response.length ? response.map((item) => {
        if(item.variants?.length) {
          item.variants.map((variant) => {
            variant.type = 'case'
            variant.nature = 'legno'
            variant.path = variant.model || 'https://kriptonite.s3.eu-central-1.amazonaws.com/K1_75_battente_fdbc078e64.gltf'
          })
        }
        return item
      }) : []
    },

    getVariants(id, filters = {}) {
      let variants = (this.list.length && id) ? this.list.filter((item) => {
        return item.id === id
      })[0].variants : []

      
      variants = Object.keys(filters).length && variants ? variants.filter((item) => {
        return Object.entries(filters).map(([ filter, value ]) => {
          return item[filter] === value
        })[0]
      }) : variants
      
      // Unique by depth
      this.variantsList = variants.length ? variants.filter((variant, i, self) => {
        return self.findIndex(item => item.depth === variant.depth) === i
      }) : []
    }
  }
});
