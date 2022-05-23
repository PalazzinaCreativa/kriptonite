import * as THREE from 'three'
import Object3D from "./Object3D"
import { RESTING_ON_THE_GROUND } from '@/dataset/defaultConfiguratorValues'

export default class Obstacle extends Object3D {
  constructor (options, room) {
    super(options)
    this.room = room
    this.config.type = 'obstacle'
  }

  async init () {
    await super.init()
    this.object.traverse(child => {
      if (child.material) {
        child.material = new THREE.MeshStandardMaterial({ color: 0xadadad, roughness: 1 })
        child.material.map = null
      }
    })
  }
}