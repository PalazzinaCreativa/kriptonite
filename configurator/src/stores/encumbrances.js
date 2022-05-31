import { defineStore } from "pinia"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

export default defineStore({
  id: "encumbrances",
  state: () => ({
    list: [
      {
        name: 'Altro',
        type: 'obstacle',
        id: 'generic',
        path: '/assets/objects/obstacles/generic/generic.gltf',
        image: {
          url: '/assets/objects/obstacles/generic/generic.png',
          width: 150,
          height: 150,
          alt: 'generic obstacle'
        },
        width: 90,
        height: 70,
        depth: 50
      }
    ]
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
