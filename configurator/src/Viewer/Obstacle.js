import Object3D from "./Object3D"

const restingOnTheGround = ['sofa', 'table', 'door']
export default class Obstacle extends Object3D {
  constructor (options, room) {
    super(options)
    this.room = room
    this.config.type = 'obstacle'
  }

  setPosition({ x, y, z }) {
    super.setPosition({ x, y: restingOnTheGround.includes(this.id) ? this.getSize().height / 2 : y, z })
  }
}