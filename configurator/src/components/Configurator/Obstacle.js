import Object3D from "./Object3D";
import { loadObject } from "./utils/loadObject";

export default class Obstacle extends Object3D {
  constructor (path, { dimensions, name, id }) {
    super()
    super.path = path
    super.dimensions = dimensions
    super.name = name
    super.id = id
    this.init()
  }

  async init () {
    this.object = await loadObject(this.path)
  }
}