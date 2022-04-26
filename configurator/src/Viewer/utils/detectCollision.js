import * as THREE from 'three'

export const detectCollision = (collider, collidables, scene) => {
  const colliderBox = new THREE.Box3().setFromObject(collider)

  return collidables
    .some(collidable => {
      const collidableBox = new THREE.Box3().setFromObject(collidable)
      return colliderBox.intersectsBox(collidableBox)
    })
}
