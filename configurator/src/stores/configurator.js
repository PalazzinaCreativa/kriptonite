import { defineStore } from "pinia"

export const useConfiguratorStore = defineStore({
  id: "configurator",
  state: () => ({
    options: {},
    isReady: false,
    canUndo: false,
    canRedo: false,
    viewerGetter: () => null
  }),
  getters: {
    productList: (state) => {
      if (!state.viewerGetter()) return []
      const { uprights, shelves } = state.viewerGetter().config.product
      return [...uprights, ...shelves]
        .map(_ => ({
          name: _.id,
          scale: _.scale,
          id: _.id
        }))
        .reduce((acc, curr) => ({ ...acc, [curr.id]: { ...curr, quantity: acc && acc[curr.id] ? acc[curr.id].quantity + 1 : 1 }}), {})
    }
  },
  actions: {
    setWallColor (wallColor) {
      this.viewerGetter().room.changeWallColor(wallColor)
    },
    addElement (options, callback) {
      this.viewerGetter().addElement({ ...options }, callback)
    },
    updateConfig () {
      this.viewerGetter().updateConfig()
    },
    removeSelection () {
      this.viewerGetter()._unselectAll(true)
    },
    // Actions
    undo () {
      this.viewerGetter().undo()
    },
    redo () {
      this.viewerGetter().redo()
    },
    togglePan () {
      this.viewerGetter().togglePan()
    },
    toggleHuman () {
      this.viewerGetter().toggleHuman()
    },
    toggleMeasures () {
      this.viewerGetter().product.toggleMeasures()
    },
    toggleProductSelection () {
      this.viewerGetter().toggleProductSelection()
    },
    centerCam () {
      this.viewerGetter().zoomOnTarget()
    }
  },
});
