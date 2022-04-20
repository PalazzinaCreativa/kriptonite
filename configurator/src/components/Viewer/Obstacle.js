import Object3D from "./Object3D"

export default class Obstacle extends Object3D {
  constructor (options, room) {
    super(options)
    this.room = room
  }
}