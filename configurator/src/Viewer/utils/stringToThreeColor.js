import * as THREE from 'three'

export const stringToThreeColor = (color) => {
  const threeColor = new THREE.Color(color)
  return threeColor.getHex()
}