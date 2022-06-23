import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "encumbrances",
  state: () => ({
    list: []
  }),

  getters: {
    index: (state) => {
      return state.list
    }
  },
  
  actions: {
    async getEncumbrances() {
      let encumbrancesList = this.list
      let response = await c.getEncumbrances()
      let encumbrances = response.data?.length ? response.data.map((encumbrace) => {
        encumbrace.type = 'obstacle'
        encumbrace.path = encumbrace.model ? encumbrace.model.url : ''
        return encumbrace
      }) : []

      this.list = [ ...encumbrances, ...this.list ]
    }
  }
});
