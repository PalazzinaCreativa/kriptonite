export const shelvesData = [
  {
    name: 'Scaffale 1',
    id: 'shelf01',
    products: ['k1'],
    layout: ['wall'],
    materials: [
      {
        name: 'Alluminio',
        color: "#c8c8c8",
        id: 0,
        roughness: 0.1
      },
      {
        name: 'Bianco lucido',
        color: "#ffffff",
        id: 1,
        roughness: 0.1
      },
      {
        name: 'Bianco opaco',
        color: "#ffffff",
        id: 2,
        roughness: 0.8
      },
      {
        name: 'Nero opaco',
        color: "#4a4a4a",
        id: 3,
        roughness: 0.8,
        default: true
      },
      {
        name: 'Verde semi lucido',
        color: "#50533c",
        id: 4,
        roughness: 0.5
      },
      {
        name: 'Arancione opaco',
        color: "#bf3922",
        id: 5,
        roughness: 0.8
      },
    ],
    variants: [
      {
        name: 'Scaffale 1',
        id: 'shelf_01',
        type: 'shelf',
        path: '/assets/objects/product/shelves/shelf.gltf',
        dimensions: {
          width: 40,
          height: 14.1,
          depth: 18.5
        }
      }
    ]
  }
]
