export const initialSetupData = [
  {
    title: 'Benvenuto nel <b>configuratore</b>',
    paragraph: 'Con il configuratore dei nostri sistemi potrai <b>progettare la tua composizione ideale</b>.<br/><br/>Ricordiamo che non è un software tecnico, per qualsiasi informazione specifica su tagli a misura, consigli progettuali, e RAL speciali, contattare i nostri esperti a: <a href="mailto:tecnico@kriptonite.com">tecnico@kriptonite.com</a> oppure il <a href="https://www.kriptonite.com/it/store-locator">Rivenditore</a> più vicino a te.<br/><br/><b>Buona progettazione!</b>',
    key: '',
    super: '',
    options: [
      {
        component: 'button',
        label: 'Iniziamo',
        key: ''
      }
    ]
  },
  {
    title: '<b>Dove</b> vuoi inserire il sistema?',
    paragraph: '',
    key: 'inRoomPosition',
    super: 'product',
    options: [
      {
        component: 'choice',
        label: 'A parete',
        key: 'wall'
      },
      {
        component: 'choice',
        label: 'A centro stanza',
        key: 'standalone'
      }
    ]
  },
  {
    type: 'wall',
    title: 'In che <b>materiale</b> è costruita la parete?',
    paragraph: '',
    key: 'composition',
    super: 'room',
    showIf: {
      entity: 'product.inRoomPosition',
      values: ['wall']
    },
    options: [
      {
        component: 'choice',
        label: 'Mattoni',
        key: 'brick'
      },
      {
        component: 'choice',
        label: 'Cartongesso',
        key: 'drywall'
      },
      {
        component: 'choice',
        label: 'Altro materiale',
        key: 'other'
      }
    ]
  },
  {
    type: 'wall',
    title: "<b>Di che tipo</b> è la tua parete?",
    paragraph: '',
    key: 'type',
    super: 'room',
    options: [
      {
        icon: 'WallClassic',
        component: 'choice',
        label: 'Regolare',
        key: 'classic'
      },
      {
        icon: 'WallNiche',
        component: 'choice',
        label: 'Nicchia',
        key: 'niche'
      },
      {
        icon: 'WallAttic',
        component: 'choice',
        label: 'Mansarda',
        key: 'attic'
      }
    ]
  },
  {
    type: 'standalone',
    title: "<b>Di che tipo</b> è la tua stanza?",
    paragraph: '',
    key: 'type',
    super: 'room',
    showIf: {
      entity: 'product.inRoomPosition',
      values: ['standalone']
    },
    options: [
      {
        icon: 'WallClassic',
        component: 'choice',
        label: 'Regolare',
        key: 'classic'
      },
      {
        icon: 'WallAttic',
        component: 'choice',
        label: 'Mansarda',
        key: 'attic'
      }
    ]
  },
  {
    title: 'Quali sono le <b>dimensioni</b> della parete?',
    paragraph: '',
    key: 'dimensions',
    super: 'room',
    showIcon: true,
    options: [
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '10',
        min: '250',
        max: '1000',
        label: 'Larghezza',
        model: 'width',
        placeholder: "0cm",
        showIf: {
          entity: 'room.type',
          values: ['classic', 'attic', 'niche']
        }
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '10',
        min: '150',
        max: '400',
        label: 'Altezza',
        model: 'height',
        placeholder: "0cm",
        showIf: {
          entity: 'room.type',
          values: ['classic', 'niche']
        }
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '10',
        min: '60',
        max: '600',
        label: 'Profondità',
        model: 'depth',
        placeholder: "0cm",
        showIf: {
          entity: 'room.type',
          values: ['niche']
        }
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '10',
        min: '60',
        max: '300',
        label: 'Altezza sx',
        model: 'leftHeight',
        placeholder: "0cm",
        showIf: {
          entity: 'room.type',
          values: ['attic']
        }
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '10',
        min: '60',
        max: '300',
        label: 'Altezza dx',
        model: 'rightHeight',
        placeholder: "0cm",
        showIf: {
          entity: 'room.type',
          values: ['attic']
        }
      },
      {
        component: 'button',
        label: 'Avanti'
      }
    ]
  },
  {
    title: 'Ecco i prodotti perfetti per te.<br/><b>Quale scegli?</b>',
    key: 'type',
    super: 'product',
    options: [
      {
        component: 'card',
        label: 'K1',
        description: 'Sistema a parete modulabile, composto da montanti a cremagliera, ripiani e contenitori.',
        image: 'assets/images/k1.jpeg',
        key: 'k1',
        showIf: {
          entity: 'product.inRoomPosition',
          values: ['wall']
        }
      },
      {
        component: 'card',
        label: 'K2',
        description: 'Sistema k2 nella versione cielo terra a pressione o a parete. Si compone di montanti, ripiani e diversi tipi di contenitori che permettono di creare soluzioni d’arredo adatte in ogni ambiente della casa, dalla zona giorno alla zona notte, spazi espositivi come negozi e showroom.',
        image: 'assets/images/k2.jpeg',
        key: 'k2',
        showIf: {
          entity: 'product.inRoomPosition',
          values: ['wall']
        }
      },
      {
        component: 'card',
        label: 'K2',
        description: 'Sistema k2 nella versione cielo terra a pressione o a parete. Si compone di montanti, ripiani e diversi tipi di contenitori che permettono di creare soluzioni d’arredo adatte in ogni ambiente della casa, dalla zona giorno alla zona notte, spazi espositivi come negozi e showroom.',
        image: 'assets/images/k2.jpeg',
        key: 'k2',
        showIf: {
          entity: 'product.inRoomPosition',
          values: ['standalone']
        }
      }
      /* {
        component: 'card',
        label: 'K3+',
        description: 'Eventuale descrizione sit amet, consectetur adipiscing elit. Tellus laoreet et nunc cursus netus.',
        image: 'k3.jpeg',
        key: 'k3',
        showIf: {
          entity: 'product.inRoomPosition',
          values: ['standalone']
        }
      } */
    ],
    /* footer: {
      text: 'oppure scegli un altro prodotto:',
      options: [
        {
          label: 'K3+',
          link: '#'
        },
        {
          label: 'Krossing',
          link: '#'
        },
        {
          label: 'Nome prodotto',
          link: '#'
        }
      ]
    } */
  },
  {
    type: 'wall',
    title: 'Dove vuoi <b>posizionare</b> il prodotto?',
    key: 'uprightsPosition',
    super: 'product',
    options: [
      {
        component: 'card',
        label: 'Sospesa',
        description: '',
        image: 'assets/images/k1-floating.jpg',
        key: 'wall',
        showIf: {
          entity: 'product.type',
          values: ['k1']
        }
      },
      {
        component: 'card',
        label: 'A terra',
        description: '',
        image: 'assets/images/k1-ground.jpg',
        key: 'standalone',
        showIf: {
          entity: 'product.type',
          values: ['k1']
        }
      },
      {
        component: 'card',
        label: 'Terra-cielo',
        description: '',
        image: 'assets/images/k2-groundtotop.jpg',
        key: 'standalone',
        showIf: {
          entity: 'product.type',
          values: ['k2']
        }
      },
      {
        component: 'card',
        label: 'Parete-terra',
        description: '',
        image: 'assets/images/k2-walltoground.jpg',
        key: 'wall',
        showIf: {
          entity: 'product.type',
          values: ['k2']
        }
      }
    ]
  },
  {
    type: 'standalone',
    title: 'Come vuoi <b>posizionare</b> il prodotto?',
    key: 'uprightsPosition',
    super: 'product',
    fastForward: true,
    options: [
      {
        component: 'card',
        label: 'Terra-cielo',
        description: '',
        image: 'assets/images/k2-groundtotop.jpg',
        key: 'standalone',
        showIf: {
          entity: 'product.type',
          values: ['k2']
        }
      }
    ]
  }
]