import * as THREE from 'three'
import { setupRoom } from './setup/setupRoom'
import { setupFloor } from './setup/setupFloor'
import { addTexture } from "./utils/addTexture";
import { setupBaseboard } from './setup/setupBaseboard'
import Obstacle from './Obstacle'
import { stringToThreeColor } from './utils/stringToThreeColor'

export default class Room {
  constructor (viewer, { type, dimensions }) {
    this.config = {
      type,
      dimensions,
      wallColor: '#ffffff',
      floor: 'parquet',
      floorType: {
        id: 2,
        name: 'bamboo',
        repeat: [7, 9],
        isStatic: true,
        ext: 'jpg',
        maps: ['map', 'aoMap', 'normalMap', 'bumpMap', 'roughnessMap', 'metalnessMap']
      },
      obstacles: []
    }
    this.obstacles = []
    this.viewer = viewer
  }

  async init () {
    this.main = new THREE.Group()
    this.main.name = 'Room'

    const { room, config } = await setupRoom({ type: this.config.type, dimensions: this.config.dimensions, color: stringToThreeColor(this.config.wallColor) })
    if (config) { // Se la stanza ha impostazioni particolari. Es: Angolo della mansarda
      Object.entries(config)
        .forEach(([key, value]) => {
          this.viewer.config.room[key] = value
        })
    }
    const floor = await setupFloor({ width: this.config.dimensions.width, roomType: this.config.type, type: this.config.floor })
    const baseboard = await setupBaseboard(this.config.dimensions)

    this.main.add(room)
    this.main.add(floor)
    this.main.add(baseboard)

    this.viewer.scene.add(this.main)
  }

  changeWallColor (color) {
    const normalizeColor = stringToThreeColor(color)
    this.main.children.find(c => c.name === 'room').material.color.setHex(normalizeColor)
    this.config.wallColor = normalizeColor
  }

  async changeFloor (texture) {
    this.config.floorType = texture
    await addTexture(this.main.children.find(c => c.name === 'floor').material, texture)
  }

  addObstacle (obstacle) {
    this.main.add(obstacle.object)
    this.obstacles.push(obstacle)
  }

  reset () {
    this.obstacles.forEach(o => this.main.remove(o.object))
    this.obstacles = []
  }
}