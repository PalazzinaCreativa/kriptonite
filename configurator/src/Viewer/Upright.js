import * as THREE from 'three'
import { STANDALONE_Z, GUTTER, RESTING_ON_THE_GROUND } from '@/dataset/defaultConfiguratorValues'
import Object3D from "./Object3D"
import { stringToThreeColor } from "./utils/stringToThreeColor"
import { createText } from "./utils/createText"
import Client from '../utils/client';

const c = new Client({
  baseURL: 'https://kriptonite-cms-i6snh.ondigitalocean.app'
})

// Ricavo le finiture dal Database
const getColors = async() => await c.getColors()
var colors = getColors()
colors = colors.length ? colors.sort((a, b) => a.id - b.id) : colors

// Distanza tra i montanti
const defaultGap = 6.4

const currentProductUprightsDistance = [ 0, 40, 60, 75.5, 90 ] // TODO: Da popolare con le distanze dei montanti per tipo di prodotto

export default class Upright extends Object3D {

  constructor (config, product) {
    super(config)
    this.product = product
    this._cantBePositioned = false
    this.config.type = 'upright'

    // "index" è il numero delle colonne dei montanti sull'asse X, se ci sono 2 montanti uno sotto l'altro avranno lo stesso "index", ma diversi "realIndex"
    if (typeof config.index !== 'undefined') this.index = config.index
    // "realIndex" è l'indice di immissione, ovvero il numero del montante in ordine di inserimento
    if (typeof config.realIndex !== 'undefined') this.realIndex = config.realIndex
  }

  async init () {
    await super.init()
    this.setSize()
    // Settaggio della prima finitura dell'elemento in fase di inserimento:
    // Verrà scelta la finitura impostata dall'utente oppure il primo risultato proveniente dal Database.
    let firstColor = colors.length ? colors[0] : { color: '#a1a1a1' }
    super.setMaterial(this.config.material || { color: '#a1a1a0', opacity: 1 }, false)
  }

  multipleDeletionAlert(state) {
    window.dispatchEvent(new Event('alert'))
    // Ascolto dell'evento di conferma per l'alert per l'eliminazione di più elementi relativi al montante in fase di eliminazione
    window.addEventListener('confirmModal', (event) => {
      this.confirmDestroy()
    })
  }

  // test per non stretchare l'oggetto su asse x e z
  setSize (dimensions) {

    const { width, height, depth } = this.getSize()

    //console.log('montante K2', this.product, this.config, this.product.viewer?.room, this.product.viewer?.room?.config?.dimensions?.height, height)

    const scale = { //ERO QUI
      x: 1,
      y: this.product.uprightsPosition === 'standalone' && this.product.type === 'k2' && height > this.product.viewer?.room?.config?.dimensions?.height ? this.product.viewer?.room?.config?.dimensions?.height / height : 1,
      z: 1,
      //y: 1
    }

    this.object.scale.set(scale.x, scale.y, scale.z)
    if (this.config.grounded) this.setPosition(this.getPosition()) // Lo appoggia al terreno se richiesto
  }

  setPosition ({ x, y, z }) {
    const currentGap = this.product?.slot_space || defaultGap
    const gridY = Math.floor(y / currentGap) * currentGap // Calcolo y in base alla distanza tra i buchi per allineare tutti i montanti
    const groundY = this.getSize().height / 2
    const zPos = this.object.attachedToWall ? 0.1 : z
    //console.log(this.object.attachedToWall, zPos)
    super.setPosition({ x, y: this.object.grounded ? groundY : gridY, z: zPos })

    this._checkPosition({ x, y, z })
  }

  _setIndex () {
    // Indicazione del montante come "in fase di inserimento"
    this.isPlaced = true
    // Se è il primo montante in fase di inserimento setto gli indici a 0
    if (!this.product.uprights.length) {
      this.index = 0
      this.realIndex = 0
      return
    }
    // Impostazione dell'indice dei montanti in base al montante più a destra.
    // Se ci sono più montanti in colonna avranno lo stesso "index"
    const latestUpright = this.product.uprights.reduce((prev, current) => (prev.index > current.index) ? prev : current)
    this.index = latestUpright.getPosition().x === this.getPosition().x ? latestUpright.index : latestUpright.index + 1
    this.realIndex = this.product.uprights.length
  }

  _checkPosition ({ x, y }) {
    let cantBePositioned = false
    const wireframes = this.product.object.children.find(c => c.name === 'uprights_wireframe')?.children
    if (wireframes) {
      cantBePositioned = !wireframes.some((w, i) => {
        // Controllo che sia vicino a un wireframe
        const isIn = x > w.position.x - 12 && x < w.position.x + 12
        // In caso positivo lo metto nella stessa posizione x ed esco dal ciclo
        if (isIn) this.object.position.x = w.position.x
        return isIn
      })
    }

    if (this.product.viewer.config.room.type === 'attic' && !cantBePositioned) {
      // Controllo la posizione e altezza del montante rispetto all'altezza della parete. Per farlo uso la formula per calcolare la dimensione di un cateto dati un cateto e un angolo del triangolo rettangolo.
      const sideWidth = this.product.viewer.config.room.leftHeight > this.product.viewer.config.room.rightHeight // Larghezza del cateto inferiore
        ? this.product.viewer.config.room.width - x
        : x

      const unkownSideWidth = sideWidth * Math.tan(this.product.viewer.config.room.atticAngle)
      const availableYSpace = unkownSideWidth + Math.min(this.product.viewer.config.room.dimensions.leftHeight, this.product.viewer.config.room.dimensions.rightHeight) // Altezza della mansarda al punto x richiesto

      cantBePositioned = (y + this.getSize().height / 2) > (availableYSpace - GUTTER)
    }

    this._cantBePositioned = cantBePositioned
    this._setState()

    setTimeout(() => {
      const extensibleGroup = new THREE.Group();
      //extensibleGroup.add()

      let topExtensibleNodes = [
        "2c3f3b2f-3524-428a-bdef-7c7bdec0809e",
        "f1fee69c-217e-4d12-9d70-20e143095452",
        "96e5c1e9-c28d-47e8-85e6-6f0321851e7a",
        "b9eaf16e-577d-41ba-b517-370ea6152d67",
        "8078a7ef-f074-4839-b5cd-904c1306517f"
      ]
      let bottomExtensibleNodes = [
        "528a80f9-89cf-4936-85e4-13cc380872e6",
        "d88781bb-3fbc-458d-9ab1-aadbbba0ed0b",
        "da26f6aa-6fb5-4e05-9b8d-0d41a5462616",
        "983a1035-22ed-44de-a3b4-f0d995d7c3cd",
        "8dbee752-dc2c-4ef1-8437-8701bc065cae"
      ]

      // Se è un montante terra-cielo, adatto l'altezza del montante all'altezza della stanza
      if(this.config.variantId === 'upright_s_tele') {
        this.product?.object?.children[0].children[0].children.length ? this.product.object.children[0].children[0].children.map((node) => {
            //console.log(node, node.uuid)
            /* if(topExtensibleNodes.includes(node.uuid)) {
              node.position.y = -50
            } */
        }) : []
      }
    }, 1500)
  }

  _setState() {
    this.object.traverse(child => {
      if (child.material) {
        child.material.transparent = true
        child.material.opacity = this._cantBePositioned ? 0.2 : 1
      }
    })
  }

  // Genera le guide sulle quali potrà essere posizionato il montante
  _generateSiblingWireframe (roomWidth, roomHeight) {
    if (!this.product.uprights.length) return

    const latestUpright = this.product.uprights.reduce((prev, current) => (prev.index > current.index) ? prev : current)

    const wireframes = new THREE.Group()
    wireframes.name = 'uprights_wireframe'
    this.product.object.add(wireframes)
    // Creo guide per ogni possibile distanza

    currentProductUprightsDistance
      .forEach(async x => {
        // Controllo che il wireframe ci stia all'interno della stanza
        if (latestUpright.object.position.x + x > roomWidth) return

        // Mesh della guida
        const wireframe = new THREE.Mesh(
          new THREE.BoxGeometry(this.getSize().width + 2, roomHeight, this.getSize().depth + 2),
          new THREE.MeshStandardMaterial({ color: 0x707070, transparent: true, opacity: 0.2, roughness: 0 }),
        )

        // AGGIUNGO LE DISTANZE
        /* const distance = new THREE.Mesh(
          await createText(`${Math.round(this.getSize().width)}`, { size: 8 }),
          new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: false, opacity: 1, roughness: 0 })
        ) */
          
        wireframe.position.z = this.product.inRoomPosition === 'standalone' ? STANDALONE_Z : 0.1
        wireframe.position.y = roomHeight / 2
        wireframe.position.x = latestUpright.object.position.x + x
        wireframes.add(wireframe)

        /* distance.position.z = this.product.inRoomPosition === 'standalone' ? STANDALONE_Z : 0.1
        distance.position.y = roomHeight / 2
        distance.position.x = latestUpright.object.position.x + x
        wireframes.add(distance) */
      })
  }

  destroy(isDestroying = false) {
    // Cancello tutti i montanti alla sua destra e tutti i ripiani ad esso collegati
    if (this.getSiblings().some(sibling => sibling.index > this.index) && !isDestroying) {
      // Se ci sono montanti alla sua destra, viene sollevato un evento di alert per avvisare l'utente dell'eliminazione multipla
      this.multipleDeletionAlert()
    } else {
      // Elimino l'elemento
      super.destroy()
    }
  }

  async confirmDestroy() {
    // Variabile per evitare "Maximuum call stack exceeded" nella funzione ricorsiva, se si stanno eliminando altri elementi
    // this.product._isDestroying = true
    
    // Chiamata alla funzione ricorsiva di eliminazione
    const uprightsToDelete = this.product.uprights.filter(u => u.index >= this.index && u.realIndex >= this.realIndex)
    
    if(uprightsToDelete.length) {
      uprightsToDelete.map(async (upright) => {
        await upright.destroy(true)
      })
    }

    // Eliminazione dei ripiani e dei contenitori associati
    // Partenza dal montante alla sinistra di quello in fase di eliminazione per verificare che ci siano ripiani o contenitori attaccati a quest'ultimo
    const nearestUpright = this.product.uprights.find(p => p.index === this.index - 1) || null

    // Eliminazione di eventuali elementi attaccati ai ripiani in fase di eliminazione
    const elementsOnTheRoom = [...this.product.shelves, ...this.product.cases]

    const elementsToDelete = nearestUpright ? elementsOnTheRoom.filter((item) => {
      return item.getPosition().x >= nearestUpright.getPosition().x
    }) : elementsOnTheRoom

    if(elementsToDelete.length) {
      elementsToDelete.map(async (element) =>  await element.destroy())
    }
    //this.product._isDestroying = false
    return
  }
}