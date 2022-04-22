import * as THREE from 'three'
import { setupRoom } from './setup/setupRoom'
import { setupFloor } from './setup/setupFloor'
import Obstacle from './Obstacle'
import { stringToThreeColor } from './utils/stringToThreeColor'

export default class Room {
  constructor (viewer, { type, dimensions }) {
    this.config = {
      type,
      dimensions,
      wallColor: '#ffffff',
      floor: 'parquet'
    }
    this.obstacles = []
    this.viewer = viewer
  }

  async init () {
    this.main = new THREE.Group()

    this.room = await setupRoom({ type: this.config.type, dimensions: this.config.dimensions, color: stringToThreeColor(this.config.wallColor) })
    this.floor = await setupFloor({ width: this.config.dimensions.width, roomType: this.config.type, type: this.config.floor })

    this.main.add(this.room)
    this.main.add(this.floor)

    this.viewer.scene.add(this.main)
  }

  changeWallColor (color) {
    const normalizeColor = stringToThreeColor(color)
    this.room.material.color.setHex(normalizeColor)
    this.config.wallColor = normalizeColor
  }

  async changeFloor (texture) {
    await addTexture(this.floor.material, texture) // texture dovrà essere un oggetto tipo { name: 'parquet', repeat: 4, ext: 'jpg', maps: ['map', 'aoMap', 'normalMap', 'bumpMap', 'roughnessMap', 'metalnessMap'] }
  }

  addObstacle (obstacle) {
    this.main.add(obstacle.object)
    this.obstacles.push(obstacle)
  }

  reset () {
    this.obstacles.forEach(o => this.main.remove(o))
    this.obstacles = []
  }
}