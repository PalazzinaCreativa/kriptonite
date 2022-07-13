import * as THREE from 'three'
import Object3D from "./Object3D"
import { stringToThreeColor } from "./utils/stringToThreeColor"

const currentGap = 6.4 // Distanza tra i buchi dei montanti divisi per tipi - Da popolare in base al montante
export default class Case extends Object3D {
  constructor (config, product) {
    super(config)

    this.config.type = 'case'
    this.product = product
    this._cantBePositioned = false

    super.getElementConfig()
  }

  async init () {
    await super.init()
    super.setMaterial(this.config.material || { color: '#a1a1a0', opacity: 1 }, false) // Aggiungo il ricevuto tramite opzioni oppure gli aggiungo un colore nero di default
  }

  setSize (dimensions) {
    const { width, height, depth } = this.getSize()

    const scale = {
      x: dimensions?.width ? (dimensions.width - this.attachPoint) / (width / this.object.scale.x) : 1,
      y: dimensions?.height ? dimensions.height / (height / this.object.scale.y) : 1,
      z: dimensions?.depth ? dimensions.depth / (depth / this.object.scale.z) : 1
    }

    this.object.scale.set(scale.x, scale.y, scale.z)

    // Posizionamento dell'elemento al terreno
    if (this.config.grounded) this.setPosition(this.getPosition())
  }

  setPosition ({ x, y, z }) {
    // Calcolare y in base alla distanza tra i buchi per posizionare tutti i montanti allineati
    const gridY = Math.floor(y / currentGap) * currentGap
    // console.log('Z:', z)
    super.setPosition({ x, y: gridY, z })

    this._checkPosition()
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

    // Prendo il montante più vicino a sinistra basandomi sull'indice
    leftUprights = leftUprights.filter(u => u.index === Math.max.apply(Math, leftUprights.map((v) => v.index)))

    // Controllo che ci siano montanti a destra
    const rightUprights = uprights.filter(upright => upright.index === leftUprights[0].index + 1)
    if (!rightUprights.length) {
      cantPosition()
      return
    }

    // Trovo i due montanti più vicini a sinistra e destra sui quali posso posizionare lo scaffale nell'asse y
    const left = leftUprights.find(u => this.getPosition().y > (u.getPosition().y - u.getSize().height / 2) && this.getPosition().y < (u.getPosition().y + u.getSize().height / 2))
    const right = rightUprights.find(u => this.getPosition().y > (u.getPosition().y - u.getSize().height / 2) && this.getPosition().y < (u.getPosition().y + u.getSize().height / 2))

    if (!left || !right) {
      cantPosition()
      return
    }


    if (this.index !== left.index) {
      this.setSize({ width: right.getPosition().x - left.getPosition().x - this.offset * 2 })
    }

    this.index = left.index
    this._cantBePositioned = false
    this._setState()
    super.setPosition({ x: (left.getPosition().x + this.attachPoint / 2 + this.getSize().width / 2) + this.offset })
  }

  _setState() {
    this.object.traverse(child => {
      if (child.material) {
        child.material.transparent = true
        child.material.opacity = this._cantBePositioned ? 0.2 : 1
      }
    })
  }
}