import { detectCollision } from './detectCollision'
import { STANDALONE_Z, GUTTER, GUTTER_HORIZONTAL, elementDistances } from '@/dataset/defaultConfiguratorValues'

export const placeObject = ({ point, element, collidables, room }) => {
  const { width, height, depth } = element.getSize()
  // console.log('inserimento di:', element)
  const { object } = element

  // Calcolo del punto in cui sarà possibile posizionare l'elemento sugli assi x e y tenendo conto del suo padding
  const position = ['x', 'y']
    .map(ace => {
      const objectSize = ace === 'x' ? width : height
      const roomSize = ace === 'x' ? room.dimensions.width : room.dimensions.height
      const gutter = element?.elementConfig?.gutters[ace] || (ace === 'x' ? GUTTER_HORIZONTAL : GUTTER)
      // console.log(ace, gutter)
      return {
        point: point[ace] - objectSize / 2 < gutter
          ? gutter + objectSize / 2
          : point[ace] + objectSize / 2 > roomSize - gutter
            ? roomSize - gutter - objectSize / 2
            : point[ace],
        ace
      }
    })
    .reduce((acc, curr) => ({ ...acc, [curr.ace]: curr.point }), {})

  element.setPosition({
    x: position.x,
    y: position.y,
    z: element.product?.inRoomPosition === 'standalone' ? STANDALONE_Z : isNaN(depth) ? 0.1 : depth / 2
  })

  return detectCollision(object, collidables)
}