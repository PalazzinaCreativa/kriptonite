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
        key: 'drywall'
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
        component: 'choice',
        label: 'Classica',
        key: 'classic'
      },
      {
        component: 'choice',
        label: 'Nicchia',
        key: 'niche'
      },
      {
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
    inputs: [
      {
        component: 'input',
        type: 'number',
        step: '.01',
        max: '20',
        label: 'Larghezza (m)',
        model: 'width',
        placeholder: "0.00 m",
        showIf: ['classic', 'attic', 'niche']
      },
      {
        component: 'input',
        type: 'number',
        step: '.01',
        max: '20',
        label: 'Altezza (m)',
        model: 'height',
        placeholder: "0.00 m",
        showIf: ['classic', 'niche']
      },
      {
        component: 'input',
        type: 'number',
        step: '.01',
        max: '20',
        label: 'Profondità (m)',
        model: 'depth',
        placeholder: "0.00 m",
        showIf: ['niche']
      },
      {
        component: 'input',
        type: 'number',
        step: '.01',
        max: '20',
        label: 'Altezza sinistra (m)',
        model: 'leftHeight',
        placeholder: "0.00 m",
        showIf: ['attic']
      },
      {
        component: 'input',
        type: 'number',
        step: '.01',
        max: '20',
        label: 'Altezza destra (m)',
        model: 'rightHeight',
        placeholder: "0.00 m",
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
        component: 'choice',
        label: 'A terra',
        key: 'k1'
      },
      {
        component: 'choice',
        label: 'A parete',
        key: 'k2'
      }
    ]
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