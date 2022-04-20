export const initialSetupData = [
  {
    question: 'Dove vuoi inserire il prodotto?',
    key: 'inRooomPosition',
    type: 'options',
    super: 'product',
    options: [
      {
        label: 'A parete',
        key: 'wall'
      },
      {
        label: 'In mezzo alla stanza',
        key: 'standalone'
      }
    ]
  },
  {
    question: 'Che tipo di parete è',
    key: 'composition',
    type: 'options',
    super: 'room',
    options: [
      {
        label: 'Cartongesso',
        key: 'drywall'
      },
      {
        label: 'Mattoni',
        key: 'brick'
      },
      {
        label: 'Altro',
        key: 'drywall'
      }
    ]
  },
  {
    question: "Com'è la stanza",
    key: 'type',
    super: 'room',
    type: 'options',
    options: [
      {
        label: 'Classica',
        key: 'classic'
      },
      {
        label: 'Mansarda',
        key: 'attic'
      },
      {
        label: 'Nicchia',
        key: 'niche'
      }
    ]
  },
  {
    question: 'Quali sono le dimensioni?',
    key: 'dimensions',
    super: 'room',
    type: 'inputs',
    inputs: [
      {
        label: 'Altezza (metri)',
        model: 'height',
        placeholder: "0.00",
        showIf: ['classic', 'niche']
      },
      {
        label: 'Larghezza (metri)',
        model: 'width',
        placeholder: "0.00",
        showIf: ['classic', 'attic', 'niche']
      },
      {
        label: 'Profondità (metri)',
        model: 'depth',
        placeholder: "0.00",
        showIf: ['niche']
      },
      {
        label: 'Altezza sinistra (metri)',
        model: 'leftHeight',
        placeholder: "0.00",
        showIf: ['attic']
      },
      {
        label: 'Altezza destra (metri)',
        model: 'rightHeight',
        placeholder: "0.00",
        showIf: ['attic']
      }
    ]
  },
  {
    question: 'Dove vuoi posizionare i montanti?',
    key: 'uprightsPosition',
    type: 'options',
    super: 'product',
    options: [
      {
        label: 'A terra',
        key: 'ground'
      },
      {
        label: 'A parete',
        key: 'wall'
      }
    ]
  }
]