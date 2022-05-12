export const initialSetupData = [
  {
    title: 'Benvenuto nel <b>configuratore</b> Kriptonite!',
    paragraph: 'Con il configuratore dei sistemi KRIPTONITE potrai <b>progettare la tua composizione</b> di libreria o guardaroba.<br/><br/>Ricordiamo che non è un software tecnico, per qualsiasi informazione specifica su tagli a misura, consigli progettuali, e RAL speciali, contattare i nostri esperti a: <a href="mailto:my.kriptonite@kriptonite.com">my.kriptonite@kriptonite.com</a> oppure il <a href="#">Rivenditore</a> più vicino a te.<br/><br/><b>Buona progettazione!</b>',
    key: '',
    super: '',
    options: [
      {
        component: 'button',
        label: 'Iniziamo!',
        key: ''
      }
    ]
  },
  {
    title: '<b>Dove</b> vuoi inserire il prodotto?',
    paragraph: 'Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.',
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
        label: 'In mezzo alla stanza',
        key: 'standalone'
      }
    ]
  },
  {
    title: 'In che <b>materiale</b> è costruita la parete?',
    paragraph: 'Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.',
    key: 'composition',
    super: 'room',
    showIf: ['wall'],
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
    title: "<b>Di che tipo</b> è la tua parete?",
    paragraph: 'Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.',
    key: 'type',
    super: 'room',
    options: [
      {
        icon: 'WallClassic',
        component: 'choice',
        label: 'Classica',
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
    title: 'Quali sono le <b>dimensioni</b> della parete?',
    paragraph: 'Eventuale descrizione/approfondimento adipiscing elit. Sollicitudin eu volutpat risus, in ut pharetra neque, morbi pellentesque. In in adipiscing mollis posuere sed porta.',
    key: 'dimensions',
    super: 'room',
    options: [
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '.10',
        min: '1',
        max: '20',
        label: 'Larghezza',
        model: 'width',
        placeholder: "0cm",
        showIf: ['classic', 'attic', 'niche']
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '.10',
        min: '1',
        max: '20',
        label: 'Altezza',
        model: 'height',
        placeholder: "0cm",
        showIf: ['classic', 'niche']
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '.10',
        min: '1',
        max: '20',
        label: 'Profondità',
        model: 'depth',
        placeholder: "0cm",
        showIf: ['niche']
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '.10',
        min: '1',
        max: '20',
        label: 'Altezza sinistra',
        model: 'leftHeight',
        placeholder: "0cm",
        showIf: ['attic']
      },
      {
        component: 'input',
        entity: 'dimension',
        type: 'number',
        step: '.10',
        min: '1',
        max: '20',
        label: 'Altezza destra',
        model: 'rightHeight',
        placeholder: "0cm",
        showIf: ['attic']
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
        image: 'k1.jpeg',
        key: 'k1'
      },
      {
        component: 'card',
        label: 'K2',
        description: 'Eventuale descrizione sit amet, consectetur adipiscing elit. Tellus laoreet et nunc cursus netus.',
        image: 'k2.jpeg',
        key: 'k2'
      }
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
    title: 'Dove vuoi <b>posizionare</b> il prodotto?',
    key: 'uprightsPosition',
    super: 'product',
    options: [
      {
        component: 'choice',
        label: 'A terra',
        key: 'ground'
      },
      {
        component: 'choice',
        label: 'A parete',
        key: 'wall'
      }
    ]
  }
]