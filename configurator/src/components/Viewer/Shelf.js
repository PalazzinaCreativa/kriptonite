import * as THREE from 'three'
import Object3D from "./Object3D"
import { stringToThreeColor } from "./utils/stringToThreeColor"

const currentGap = 6.4 // Distanza tra i buchi dei montanti divisi per tipi - Da popolare in base al montante
export default class Shelf extends Object3D {
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
    const gridY = Math.floor(y / currentGap) * currentGap
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
    this.index = this.product.shelves.length
  }

  _checkPosition () {
    const { uprights } = this.product

    const cantPosition = () => {
      this._cantBePositioned = true
      this._setState()
    }
    // Se non ho almeno 2 montanti in diverso asse x non posso mettere scaffali
    if (!uprights.find(upright => upright.index === 1)) {
      cantPosition()
      return
    }

    // Prendo i montanti a sinistra dello scaffale
    let leftUprights = uprights.filter(u => u.getPosition().x <= this.getPosition().x)
    if (!leftUprights.length) {
      cantPosition()
      return
    }

    // Prendo il montante più vicino a sinistra. Calcolo il punto x più grande tra i montanti a sinistra ( Math.max.apply(Math, leftUprights.map((u) => u.getPosition().x)) ) e mi trovo tutti quelli che sono in quella posizione
    leftUprights = leftUprights.filter(u => u.getPosition().x === Math.max.apply(Math, leftUprights.map((u) => u.getPosition().x)))

    // Controllo che ci siano montanti a destra
    const rightUprights = uprights.filter(upright => upright.index === leftUprights[0].index + 1)
    if (!rightUprights.length) {
      cantPosition()
      return
    }

    // Trovo i due montanti più vicini a sinistra e destra sui quali posso posizionare lo scaffale nell'asse x
    const left = leftUprights.find(u => this.getPosition().y > (u.getPosition().y - u.getSize().height / 2) && this.getPosition().y < (u.getPosition().y + u.getSize().height / 2))
    const right = rightUprights.find(u => this.getPosition().y > (u.getPosition().y - u.getSize().height / 2) && this.getPosition().y < (u.getPosition().y + u.getSize().height / 2))

    if (!left || !right) {
      cantPosition()
      return
    }

    this.setSize({ width: right.getPosition().x - left.getPosition().x })
    this._cantBePositioned = false
    this._setState()
  }

  _setState() {
    this.object.traverse(child => {
      if (child.material) child.material.opacity = this._cantBePositioned ? 0.2 : 1
    })
  }
}