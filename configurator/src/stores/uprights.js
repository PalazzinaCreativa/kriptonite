import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "uprights",
  state: () => ({
    list: [],
    variantsList: []
  }),

  getters: {
    index: (state) => {
      return state.list
    },
    
    variants: (state) => {
      return state.variantsList
    }
  },
  
  actions: {
    async getUprights(id) {
      let response = id ? await c.getUprightsByProduct(id) : []
      // Corretta
      /* this.list = response.length ? response.map((upright) => {
        if(upright.variants?.length) {
          upright.variants.map((variant) => {
            variant.type = 'upright'
            variant.path = variant.model || ''
          })
        }
        return upright
      }) : [] */

      // Filtro i risultati mostrando solo il montante a parete
      this.list = response.length ? response.filter((upright) => {
        // Nascondo i montanti cartongesso al momento
        if(upright.variants?.length) {
          upright.variants = upright.variants.filter((variant) => {
            variant.type = 'upright'
            variant.path = variant.model || ''
            return variant.name.indexOf('gesso') < 0
          })
        }
        return id === 1 ? upright.id === 1 : upright
        //return upright
      }) : []
    },

    getVariants(id) {
      this.variantsList = (this.list.length && id) ? this.list.filter((upright) => {
        return upright.id === id
      })[0].variants : []
    }
  }
});
