import { defineStore } from "pinia"

export const useConfiguratorStore = defineStore({
  id: "configurator",
  state: () => ({
    options: {},
    isReady: false,
    viewerGetter: () => null
  }),
  actions: {
    setWallColor (wallColor) {
      this.viewerGetter().room.changeWallColor(wallColor)
    },
    addElement (options, callback) {
      this.viewerGetter().addElement(options, callback)
    }
  },
});
