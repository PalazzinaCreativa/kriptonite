import * as THREE from 'three'
import { GUTTER } from '../../../dataset/defaultConfiguratorValues'

export default ({ width, height }) => {
  const xSize = width - GUTTER * 2

  const gridHelper = new THREE.GridHelper(xSize, xSize / 5)
  gridHelper.rotation.x = Math.PI / 2
  gridHelper.position.x = xSize / 2 + GUTTER
  gridHelper.position.y = xSize / 2

  return gridHelper
}