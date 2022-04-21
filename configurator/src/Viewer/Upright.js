import * as THREE from 'three'
import Object3D from "./Object3D"
import { stringToThreeColor } from "./utils/stringToThreeColor"

const currentGap = 6.4 // Distanza tra i buchi dei montanti divisi per tipi - Da popolare in base al montante

const currentProductUprightsDistance = [ 0, 40, 60, 75.5, 90 ] // Da popolare con le distanze dei montanti per tipo di prodotto

export default class Upright extends Object3D {
  constructor (options, product) {
    super(options)

    this.product = product
    this._cantBePositioned = false
    this.type = 'upright'
    if (typeof options.index !== 'undefined') this.index = options.index
    if (typeof options.realIndex !== 'undefined') this.realIndex = options.realIndex
  }


  async init () {
    await super.init()
    this.setColor('#4a4a4a')
  }

  setPosition ({ x, y, z }) {
    const gridY = Math.floor(y / currentGap) * currentGap // Calcolo y in base alla distanza tra i buchi per allineare tutti i montanti
    const groundY = this.getSize().height / 2
    super.setPosition({ x, y: this.product.uprightsPosition === 'ground' ? groundY : gridY, z })

    this._checkPosition({ x, y, z })
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

    // Imposto l'indice basandomi sul monmtante più a destra. Se l'asse x è lo stesso, allora avranno lo stesso indice
    const latestUpright = this.product.uprights.reduce((prev, current) => (prev.index > current.index) ? prev : current)
    this.index = latestUpright.getPosition().x === this.getPosition().x
      ? latestUpright.index
      : latestUpright.index + 1

    this.realIndex = this.product.uprights.length
  }

  _checkPosition ({ x }) {
    if (!this.product.uprights.length) return // Se è il primo posso sicuramente posizionarlo

    const wireframes = this.product.group.children.find(c => c.name === 'uprights_wireframe').children

    this._cantBePositioned = !wireframes.some((w, i) => {
      // Controllo che sia vicino a un wireframe
      const isIn = x > w.position.x - 12 && x < w.position.x + 12
      // In caso positivo lo metto nella stessa posizione x ed esco dal ciclo
      if (isIn) this.object.position.x = w.position.x
      return isIn
    })

    this._setState()
  }

  _setState() {
    this.object.traverse(child => {
      if (child.material) child.material.opacity = this._cantBePositioned ? 0.2 : 1
    })
  }

  // Genera le guide sulle quali potrà essere posizionato il montante
  _generateSiblingWireframe (roomWidth, roomHeight) {
    if (!this.product.uprights.length) return

    const latestUpright = this.product.uprights.reduce((prev, current) => (prev.index > current.index) ? prev : current)

    const wireframes = new THREE.Group()
    wireframes.name = 'uprights_wireframe'
    this.product.group.add(wireframes)
    // Creo guide per ogni possibile distanza
    // TODO: Numero di guide in base al tipo di montante
    const xPositions = [40, 60, 75.5, 90]
    xPositions
      .forEach(x => {
        // Controllo che il wireframe ci stia all'interno della stanza
        if (latestUpright.object.position.x + x > roomWidth) return

        // Mesh della guida
        const wireframe = new THREE.Mesh(
          new THREE.BoxGeometry(this.getSize().width + 2, roomHeight, this.getSize().depth + 2),
          new THREE.MeshStandardMaterial({ color: 0x707070, transparent: true, opacity: 0.2, roughness: 0 })
        )

        wireframe.position.z = 1
        wireframe.position.y = roomHeight / 2
        wireframe.position.x = latestUpright.object.position.x + x - 1

        wireframes.add(wireframe)
      })
  }

  async destroy () {
    // Se non è l'ultimo montante cancello tutti i montanti più a destra e tutti gli scaffali
    if (this.getSiblings().find(s => s.index > this.index) && !this.product._isDestroying) {
      if (!window.confirm('ocio che cancelli tutto')) return
      this.product._isDestroying = true //Mi serve per evitare maximuum call stack exceeded se distruggo altri elementi
      const index = this.index - 1
      for (const upright of this.product.uprights.filter(u => u.index > index)) {
        await upright.destroy()
      }

      for (const shelf of this.product.shelves.filter(s => s.index > index - 1)) {
        await shelf.destroy()
      }

      this.product._isDestroying = false
      return
    }
    super.destroy()
  }
}