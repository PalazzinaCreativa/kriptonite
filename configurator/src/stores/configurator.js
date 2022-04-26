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
      this.viewerGetter().selectedElement = null
      this.viewerGetter().outlinePass.select.selectedObjects = []
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
  },
});
