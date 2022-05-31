import * as THREE from 'three'
import { loadObject } from "./utils/loadObject"
import { stringToThreeColor } from './utils/stringToThreeColor'
import { addTexture } from "./utils/addTexture";
//import { RESTING_ON_THE_GROUND } from '@/dataset/defaultConfiguratorValues'
export default class Object3D {
  constructor (config) {
    this.config = config
    this.id = config.id
    this.variantId = config.variantId
  }

  async init () {
    if(!this.config.path) return
    this.object = await loadObject(this.config.path)
    this.object.name = this.config.id || this.config.type
    if (!this.config.dimensions) return
    this.setSize(this.config.dimensions, false)
    this.setPosition(this.getPosition())
    this._uid = `${this.config.type}_${String(this.getSiblings().length).padStart(3, '0')}` // TODO
  }

  getSize () {
    const boundingBox = new THREE.Box3().setFromObject(this.object)
    return {
      width: boundingBox.max.x - boundingBox.min.x,
      height: boundingBox.max.y - boundingBox.min.y,
      depth: boundingBox.max.z - boundingBox.min.z
    }
  }

  getPosition () {
    return this.object.position
  }

  getSiblings () {
    if (this.config.type === 'obstacle') return this.room.obstacles
    if (this.config.type === 'upright') return this.product.uprights
    if (this.config.type === 'shelf') return this.product.shelves
    if (this.config.type === 'case') return this.product.cases
  }

  setPosition ({ x, y, z }) {
    // Calcolo la posizione negli assi in base ai parametri ricevuti
    const normalizeX = !x
      ? this.getPosition().x
      : x

    const normalizeY = !y
      ? this.getPosition().y
      : this.config.grounded
        ? this.getSize().height / 2
        : y

    const normalizeZ = !z
      ? this.getPosition().z
      : z

    this.object.position.set(normalizeX, normalizeY, normalizeZ)
  }

  setSize (dimensions) {
    const { width, height, depth } = this.getSize()

    const scale = {
      x: dimensions.width ? dimensions.width / (width / this.object.scale.x) : 1,
      y: dimensions.height ? dimensions.height / (height / this.object.scale.y) : 1,
      z: dimensions.depth ? dimensions.depth / (depth / this.object.scale.z) : 1
    }

    this.object.scale.set(scale.x, scale.y, scale.z)
    if (this.config.grounded) this.setPosition(this.getPosition()) // Lo appoggia al terreno se richiesto
  }

  // Test per vedere se si può modificare
  updateElement(element) {
    this.config = element
    this.variantId = element.variantId
    this.id = element.id
    // Riesco a modificarlo, ma non ad aggiornare la scena
  }

  setMaterial ({ texture = null, nature = 'metallo', color = "#FFFFFF", roughness = 0.5, opacity = 1, id }) {
    if(!this.object) return
    //console.log('setMaterial', texture, nature, color, roughness, opacity, id)
    this.object.traverse(async child => {
      if (child.material) {
        child.material.transparent = false
        if (opacity) child.material.opacity = opacity
        if (color && child.material.name.indexOf('legno') < 0) { child.material.color = new THREE.Color(stringToThreeColor(color))}
        if (roughness) child.material.roughness = roughness
        // Applico la texture ai legni
        if (texture && child.material.name) {
          texture.rotation = 1.5708 // Pi Greco / 2 per dare 90° in radianti
          if(child.material.name.indexOf('legno_v') >= 0) {
            texture.rotation = 0
          }
          if (child.material.name.indexOf(nature) >= 0) {
            texture.repeat = [4, 4]
            await addTexture(child.material, texture)
          }
        }
      }
    })

    this.config.material = { color, roughness, id, texture, nature }
  }

  setSiblingsMaterial (material) {
    this.getSiblings().forEach(s => s.setMaterial(material, false))
  }

  destroy () {
    this.object.parent?.remove(this.object)
    this.getSiblings().splice(this.getSiblings().indexOf(this), 1)
  }
}