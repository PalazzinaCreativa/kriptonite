import * as THREE from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

export const createLine = ({ from, to, color = 0x4a4a4a, linewidth = 1 }) => {
  const points = [...from, ...to]
  const geometry = new LineGeometry()
  geometry.setPositions(points)
  const material = new LineMaterial({ color, linewidth, resolution: new THREE.Vector2(640, 480) })
  return new Line2(geometry, material)
}