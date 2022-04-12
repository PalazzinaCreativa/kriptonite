import { defineStore } from "pinia";

export const useInitialSetupStore = defineStore({
  id: "initialSetup",
  state: () => ({
    step: 0,
    layout: undefined, // Prodotto a parete o in mezzo alla stanza -> "Wall" / "StandAlone"
    composition: undefined, // Parete in mattone o cartongesso -> "Brick" / "Drywall" (Se altro settiamo comunque Drywall)
    type: undefined, // Tipologia di parete -> "Classic" / "Attic" / "Niche",
    dimensions: undefined, // Dimensioni della stanza
    product: undefined // Tipo prodotto -> "K1", "K2", "K3", "Krossing"
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  actions: {
    nextStep() {
      this.step++;
    },
    prevStep() {
      this.step--;
    },
  },
});
