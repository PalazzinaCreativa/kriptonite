import { detectCollision } from './detectCollision'
import { STANDALONE_Z, GUTTER } from '@/dataset/defaultConfiguratorValues'

export const placeObject = ({ point, element, room, collidables }) => {
  const { width, height, depth } = element.getSize()
  const { object } = element

  const position = ['x', 'y'] // Calcolo il punto in cui posso posizionare l'elemento sugli assi x e y tenendo conto del padding della stanza
    .map(ace => {
      const objectSize = ace === 'x' ? width : height
      const roomSize = ace === 'x' ? room.dimensions.width : room.dimensions.height
      return {
        point: point[ace] - objectSize / 2 < GUTTER
          ? GUTTER + objectSize / 2
          : point[ace] + objectSize / 2 > roomSize - GUTTER
            ? roomSize - GUTTER - objectSize / 2
            : point[ace],
        ace
      }
    })
    .reduce((acc, curr) => ({ ...acc, [curr.ace]: curr.point }), {})

  element.setPosition({
    x: position.x,
    y: position.y,
    z: element.product?.inRoomPosition === 'standalone' ? STANDALONE_Z : isNaN(depth) ? 0.1 : depth / 2 // Se il prodotto è in mezzo alla stanza uso un valore predefinito, sennò lo calcolo per stare attaccato alla parete
  }) // Assegno al mio oggetto selezionato la posizione del mouse corrente per poterlo muovere all'interno dello spazio

  return detectCollision(object, collidables)
}