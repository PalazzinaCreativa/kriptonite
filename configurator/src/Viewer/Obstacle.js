import * as THREE from 'three'
import Object3D from "./Object3D"

export default class Obstacle extends Object3D {
  constructor (options, room) {
    //console.log('construct Obstacle', options)
    super(options)
    this.room = room
    this.config.type = 'obstacle'
  }

  async init () {
    await super.init()
    //console.log(this.object)

    this.object.traverse(child => {
      if (child.material) {
        child.material = new THREE.MeshStandardMaterial({ color: 0xcacaca, roughness: 1 })
        child.material.map = null
        child.material.side = THREE.DoubleSide
      }
    })

    /* if(this.object.name == 2) {
      //console.log('sto inserendo una porta')
      this.setPosition({ x: this.getPosition().x, y: this.getPosition().y, z: -10 })
      this.setMaterial({ texture : {
        name: 'bamboo',
        isStatic: true,
        repeat: 16,
        maps: ['map', 'aoMap', 'bumpMap', 'alphaMap', 'normalMap', 'metalnessMap']
      }})
    } */
  }
}