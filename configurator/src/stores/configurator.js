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
    addObstacle (options) {
      this.viewerGetter().addObstacle(options)
    },
    addUpright (options) {
      this.viewerGetter().addUpright(options)
    },
    addShelf (options) {
      this.viewerGetter().addShelf(options)
    }
  },
});
