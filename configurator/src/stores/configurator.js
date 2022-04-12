import { defineStore } from "pinia"

export const useConfiguratorStore = defineStore({
  id: "configurator",
  state: () => ({
    options: {},
    viewerGetter: () => {}
  }),
  // getters: {
  //   viewer: (state) => state.viewer,
  //   options: (state) => state.options
  // },
  actions: {
    setWallColor (wallColor) {
      this.$patch({
        options: {
          wallColor
        }
      })
      this.viewerGetter().changeWallColor(wallColor)
    },
    pickUpObject (object) {
      this.viewerGetter().pickUp(object)
    }
  },
});
