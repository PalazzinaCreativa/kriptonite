export const uprightsData = [
  {
    name: 'Montante 1',
    id: 'upright01',
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
      }
    ],
    variants: [
      {
        name: 'Montante 1',
        id: 'upright01',
        type: 'upright',
        path: '/assets/objects/product/uprights/upright_01.gltf',
        dimensions: {
          width: 3.4,
          height: 57,
          depth: 2
        }
      },
      {
        name: 'Montante 2',
        id: 'upright02',
        type: 'upright',
        path: '/assets/objects/product/uprights/upright_02.gltf',
        dimensions: {
          width: 3.4,
          height: 96,
          depth: 2
        }
      },
      {
        name: 'Montante 3',
        id: 'upright03',
        type: 'upright',
        path: '/assets/objects/product/uprights/upright_03.gltf',
        dimensions: {
          width: 3.4,
          height: 146,
          depth: 2
        }
      },
      {
        name: 'Montante 4',
        id: 'upright04',
        type: 'upright',
        path: '/assets/objects/product/uprights/upright_04.gltf',
        dimensions: {
          width: 3.4,
          height: 198,
          depth: 2
        }
      },
      {
        name: 'Montante 5',
        id: 'upright05',
        type: 'upright',
        path: '/assets/objects/product/uprights/upright_05.gltf',
        dimensions: {
          width: 3.4,
          height: 249,
          depth: 2
        }
      }
    ]
  }
]
