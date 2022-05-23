export const controlsList = [
  {
    id: 1,
    name: 'Ostacoli',
    description: 'Seleziona e posiziona eventuali ostacoli presenti sulla parete su cui intendi montare la libreria.',
    component: 'AddObstacle',
    active: true
  },
  {
    id: 2,
    name: 'Montanti',
    component: 'AddUpright',
    active: false
  },
  {
    id: 3,
    name: 'Ripiani',
    component: 'AddShelf',
    active: false
  },
  {
    id: 4,
    name: 'Contenitori',
    component: 'AddContainer',
    active: false
  },
  /*{
    id: 5,
    name: 'Decorazioni',
    component: null,
    active: false
  }, */
]