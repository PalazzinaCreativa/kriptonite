import * as THREE from 'three'
import { loadObject } from "./utils/loadObject"
import { elementDistances } from '@/dataset/defaultConfiguratorValues'
import { stringToThreeColor } from './utils/stringToThreeColor'
import { addTexture } from "./utils/addTexture";
import { STANDALONE_Z } from '../dataset/defaultConfiguratorValues';
//import { RESTING_ON_THE_GROUND } from '@/dataset/defaultConfiguratorValues'
export default class Object3D {
  constructor (config) {
    this.config = config
    this.id = config.id
    this.variantId = config.variantId
  }

  async init () {
    // console.log('object3d init', this.config)
    if(!this.config.path) return
    this.object = await loadObject(this.config.path)
    this.object.name = this.config.id || this.config.type
    if (!this.config.dimensions) return
    this.setSize(this.config.dimensions, false)
    this.setPosition(this.getPosition())
    // Universal ID per calcolare le distanze tra i ripiani e i contenitori
    this._uid = `${this.config.type}_${String(this.getSiblings().length).padStart(3, '0')}` // TODO
  }

  getElementConfig() {
    this.elementConfig = this.product ? elementDistances.find((product) => product.elements.includes(this.config.type) && product.type === this.product.type && product.inRoomPosition === this.product.inRoomPosition && product.uprightsPosition === this.product.uprightsPosition) : null
    this.attachPoint = this.elementConfig ? this.elementConfig.attachPoint : 0
    this.distanceFromWall = (this.elementConfig && this.elementConfig.type === this.config.type) ? this.elementConfig.distance : (this.product.inRoomPosition === 'standalone' ? STANDALONE_Z : 0.1)
    // "offset" è la distanza di compensazione per evitare la sovrapposizione dei modelli 3D
    this.offset = this.elementConfig ? this.elementConfig.offset : 0.01
  }

  getSize () {
    // console.log(this.object)
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
    //const elementWallDistances = elementDistances.find((product) => product.elements.includes(this.config.type) && product.type === this.product.type && product.inRoomPosition === this.product.inRoomPosition && product.uprightsPosition === this.product.uprightsPosition)
    // console.log('posizionamento:', elementWallDistances, z)
    const distanceFromWall = this.elementConfig ? this.elementConfig.distance : z || this.getPosition().z
    // console.log('distanceFromWall:', distanceFromWall)
    
    // Calcolo la posizione negli assi in base ai parametri ricevuti
    const normalizeX = !x
      ? this.getPosition().x
      : x

    const normalizeY = !y
      ? this.getPosition().y
      : this.config.grounded
        ? this.getSize().height / 2
        : y

    const normalizeZ = distanceFromWall

    // console.log('object 3d dimensions:', normalizeX, normalizeY, normalizeZ)
    // 0.75 è la distanza tra il pavimento effettivo e la texture dello stesso, serve per evitare che gli elementi non si intersechino con il pavimento della stanza
    this.object.position.set(normalizeX, normalizeY + 0.75, normalizeZ)
  }

  setSize (dimensions) {
    const { width, height, depth } = this.getSize()

    //console.log('object 3d dimensions:', width, height, depth)

    const scale = {
      x: dimensions?.width ? dimensions.width / (width / this.object.scale.x) : 1,
      y: dimensions?.height ? dimensions.height / (height / this.object.scale.y) : 1,
      z: dimensions?.depth ? dimensions.depth / (depth / this.object.scale.z) : 1
    }

    // console.log('object 3d scale Z:', scale.z)

    this.object.scale.set(scale.x, scale.y, scale.z)
    if (this.config.grounded) this.setPosition(this.getPosition()) // Lo appoggia al terreno se richiesto
  }

  alert(state) {
    window.dispatchEvent(new Event('alert'))
  }

  setMaterial (material) {
    const { texture = null, nature = 'metallo', color = "#FFFFFF", roughness = 0.5, opacity = 1, id } = material
    //console.log('setMaterial', this.object)
    if(!this.object) return
    //console.log('setMaterial', texture, nature, color, roughness, opacity, id)
    this.object.traverse(async child => {
      if (child.material) {
        child.material.transparent = false
        if (opacity) child.material.opacity = opacity
        if (child.material.name.indexOf('legno') < 0) {
          child.material.color = new THREE.Color(stringToThreeColor(color))
        }
        if (roughness) child.material.roughness = roughness
        // Applico la texture ai legni
        if (texture && child.material.name) {
          texture.rotation = 1.5708 // Pi Greco / 2 per dare 90° in radianti
          if(child.material.name.indexOf('legno_v') >= 0) {
            texture.rotation = 0
          }
          if (child.material.name.indexOf('legno') >= 0) {
            texture.repeat = [4, 4]
            await addTexture(child.material, texture)
          }
        }
      }
    })

    this.config.material = material
  }

  setSiblingsMaterial (material) {
    this.getSiblings().forEach(s => s.setMaterial(material, false))
  }

  destroy () {
    this.object.parent?.remove(this.object)
    this.getSiblings().splice(this.getSiblings().indexOf(this), 1)
  }
}