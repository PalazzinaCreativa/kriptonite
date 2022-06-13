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
      this.list = response.length ? response.map((upright) => {
        if(upright.variants?.length) {
          upright.variants.map((variant) => {
            variant.grounded = upright.grounded
            variant.attachedToWall = upright.type === 'wall'
            variant.type = 'upright'
            variant.path = variant.model || ''
          })
        }
        return upright
      }) : []

      // Filtro i risultati mostrando solo il montante a parete
      /* this.list = response.length ? response.filter((upright) => {
        // Nascondo i montanti cartongesso al momento
        if(upright.variants?.length) {
          upright.variants = upright.variants.filter((variant) => {
            variant.grounded = upright.grounded
            variant.attachedToWall = upright.type === 'wall'
            variant.type = 'upright'
            variant.path = variant.model || ''
            return variant
          })
        }
        return id === 1 ? upright.id === 1 : upright
        //return upright
      }) : [] */
    },

    getVariants(id) {
      let item = (this.list.length && id) ? this.list.find((upright) => {
        return upright.id === id
      }) : []
      let fullVariantsList = item.variants ?? []

      // Unique by height
      // Se i montanti hanno delle varianti "Sinistra Centro Destra", prendo le varianti di centro
      if(fullVariantsList.length) {
        if(fullVariantsList.some((variant) => variant.sku?.slice(-1) === 'C')) {
          this.variantsList = fullVariantsList.filter((variant, i) => {
            return variant.sku?.slice(-1) === 'C'
          })
        } else {
          this.variantsList = fullVariantsList.filter((variant, i, self) => {
            return self.findIndex(item => item.height === variant.height) === i
          })
        }
      }
    }
  }
});
