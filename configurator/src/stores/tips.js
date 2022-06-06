import { defineStore } from "pinia"
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default defineStore({
  id: "tips",
  state: () => ({
    list: [
      {
        name: 'intro',
        items: [
          {
            text: 'Ti consigliamo di <b>lasciare una distanza di almeno 3 cm tra le pareti laterali e i montanti</b>, in modo da facilitare il montaggio.',
            buttonLabel: 'Ho capito',
            isActive: true
          }
        ]
      },
      {
        name: 'uprights',
        items: [
          {
            text: '<b>Posiziona il primo montante a partire da sinistra</b> e prosegui la tua composizione verso destra',
            buttonLabel: '',
            isActive: false,
          },
          {
            text: "Se intendi <b>posizionare più montanti uno sotto l'altro</b>, devi farlo <b>prima di aggiungere</b> un montante alla sua destra",
            buttonLabel: 'Ho capito',
            isActive: false,
          }
        ]
      },
      {
        name: 'shelves',
        items: [
          {
            text: "<ul><li><b class='block w-full'>18cm</b>consigliato per narrativa, cd e oggetti piccoli</li><li><b class='block w-full'>29cm</b>per faldoni, libri d'arte, fotografia.</li><li><b class='block w-full'>36cm</b>ideale per guardaroba, vinili o per oggetti tech</li></ul>",
            buttonLabel: 'Ho capito',
            isActive: false
          }
        ]
      }
    ],
    currentList: [],
    active: {},
    defaultExpiringTime: '15d'
  }),

  getters: {
    index: (state) => {
      return state.list
    },

    currentIndex: (state) => {
      return state.currentList
    },

    activeTip: (state) => {
      return state.active
    }
  },
  
  actions: {
    getCookies() {
      this.currentList = cookies.keys()
    },

    async addTip(tip) {
      this.list.push(tip)
    },

    setActiveTip(name) {
      this.active = !this.currentList.includes(`tip-${name}`) ? this.list.find((tip) => tip.name === name) : {}
    },

    closeTip(tip) {
      cookies.set(`tip-${tip.name}`, tip, this.defaultExpiringTime)
      this.setActiveTip(tip)
    }
  }
});
