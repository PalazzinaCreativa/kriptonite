import { defineStore } from "pinia"

export const useConfiguratorStore = defineStore({
  id: "configurator",
  state: () => ({
    options: {},
    isReady: false,
    canUndo: false,
    canRedo: false,
    isPanning: false,
    isShowingMeasures: false,
    isShowingHuman: false,
    viewerGetter: () => null
  }),
  getters: {
    productList: (state) => {
      if (!state.viewerGetter()) return []
      const { uprights, shelves, cases } = state.viewerGetter().config.product
      return [...uprights, ...shelves, ...cases]
        .map(_ => ({
          name: _.id,
          scale: _.scale,
          id: _.id
        }))
        .reduce((acc, curr) => ({ ...acc, [curr.id]: { ...curr, quantity: acc && acc[curr.id] ? acc[curr.id].quantity + 1 : 1 }}), {})
    },
    // isPanning: (state) => state.viewerGetter()?._isPanning,
    // isShowingMeasures: (state) => state.viewerGetter()?.product?._visibleMeasures,
    // isShowingHuman: (state) => state.viewerGetter()?.human?.visible
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
      this.isPanning = !this.isPanning
    },
    toggleHuman () {
      this.viewerGetter().toggleHuman()
      this.isShowingHuman = !this.isShowingHuman
    },
    toggleMeasures () {
      this.viewerGetter().product.toggleMeasures()
      this.isShowingMeasures = !this.isShowingMeasures
    },
    toggleProductSelection () {
      this.viewerGetter().toggleProductSelection()
    },
    centerCam () {
      this.viewerGetter().zoomOnTarget()
    }
  },
});
