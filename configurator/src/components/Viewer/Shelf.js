import * as THREE from 'three'
import Object3D from "./Object3D"
import { stringToThreeColor } from "./utils/stringToThreeColor"

export default class Upright extends Object3D {
  constructor (options, product) {
    super(options)

    this.product = product
    this._cantBePositioned = false
  }


  async init () {
    await super.init()
    this.setColor('#4a4a4a')

  }

  setPosition (x, y, z) {
    // Calcolare y in base alla distanza tra i buchi per posizionare tutti i montanti allineati
    const gap = gaps[this.type]
    const gridY = Math.floor(y / gap) * gap
    super.setPosition(x, gridY, z)

    this._checkPosition()
  }

  setColor (color) {
    const normalizeColor = stringToThreeColor(color)
    this.object.traverse(child => {
      if (child.material) {
        child.material.color = new THREE.Color(normalizeColor)
        child.material.transparent = true // Setto a true perchè mi serve l'opacità per gestire gli stati
      }
    })
  }

  _setIndex () {
    if (!this.product.uprights.length) {
      this.index = 0
      this.realIndex = 0
      return
    }

  }

  _checkPosition () {
    if (!this.product.uprights.length) return // Se è il primo posso sicuramente posizionarlo
    // Controllo la posizione x dell'ultimo monetante inserito
    const latestUprightX = Math.floor(this.product.uprights[this.product.uprights.length - 1].getPosition().x)
    const thisX = Math.floor(this.getPosition().x)

    this._cantBePositioned = !currentProductUprightsDistance.some(distance => thisX === latestUprightX + distance)
    this._setState()
  }

  _setState() {
    this.object.traverse(child => {
      if (child.material) child.material.opacity = this._cantBePositioned ? 0.2 : 1
    })
  }
}