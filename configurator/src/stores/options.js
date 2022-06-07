import { defineStore } from "pinia"

export default defineStore({
  id: "options",
  state: () => ({
    list: [
      { id: 1, label: 'Opzioni' },
      { id: 2, label: 'Opzioni stanza' }
    ],
    selectedOption: { id: 1, label: 'Opzioni' }
  }),

  getters: {
    index: (state) => {
      return state.list
    },

    selected: (state) => {
      return state.selectedOption
    }
  },
  
  actions: {
    setSelectedOption(option) {
      this.selectedOption = option
    },

    resetSelectedOption() {
      this.selectedOption = this.list[0]
    }
  }
});
