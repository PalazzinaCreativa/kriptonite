import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { createLine } from './createLine'

export const createMeasure = (layout, size, gutter = 0, fontSize = 5, measureEdgeLength = 2.5) => {
  return new Promise((resolve) => {
    const measure = new THREE.Group()
    measure.name = 'Measure'
    const textSize = fontSize

    const to = layout === 'horizontal'
      ? [size - gutter * 2, 0, 0]
      : [0, size - gutter * 2, 0]
    const line = createLine({
      from: [0, 0, 0],
      to,
      linewidth: 0.75,
      color: 0x8e8e8e
    })
    line.name = 'Line'
    measure.add(line)

    // Estremi della quota
    const startingEdge = createLine({
      from: layout === 'horizontal'
      ? [0, -measureEdgeLength, 0]
      : [-measureEdgeLength, 0, 0],
      to: layout === 'horizontal'
      ? [0, measureEdgeLength, 0]
      : [measureEdgeLength, 0, 0],
      linewidth: 0.75,
      color: 0x8e8e8e
    })
    measure.add(startingEdge)

    const endingEdge = createLine({
      from: layout === 'horizontal'
      ? [size - gutter * 2, -measureEdgeLength, 0]
      : [-measureEdgeLength, size - gutter * 2, 0],
      to: layout === 'horizontal'
      ? [size - gutter * 2, measureEdgeLength, 0]
      : [measureEdgeLength, size - gutter * 2, 0],
      linewidth: 0.75,
      color: 0x8e8e8e
    })
    measure.add(endingEdge)

    const loader = new FontLoader()
    loader.load('/assets/fonts/helvetiker_regular.typeface.json', (font) => {
      const material = new THREE.MeshStandardMaterial({ color: 0x8e8e8e })
      const message = `${Math.round(size * 100) / 100} cm`
      const shape = font.generateShapes(message, textSize)
      const geometry = new THREE.ShapeGeometry(shape)
      geometry.computeBoundingBox()
      geometry.translate((geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2, 0, 0)
      const label = new THREE.Mesh(geometry, material)
      label.name = 'Label'

      if (layout === 'horizontal') {
        label.position.x = size / 2 - (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
        label.position.y = 5
        line.position.x = gutter
      }

      if (layout === 'vertical') {
        label.position.x = -5
        label.position.y = size / 2 - (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
        label.rotation.z = Math.PI / 2
        line.position.y = gutter

      }

      measure.add(label)
      resolve(measure)
    })
  })
}