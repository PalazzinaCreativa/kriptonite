import * as THREE from 'three'
/*
  Metodo per creare la texture da applicare ai materiali.
  Riceve in input il materiale a cui applicare la texture e un oggetto opzioni con le seguenti proprietà:
    - name: nome della texture (dovrà corrispondere al nome della cartella che contiene le immagini dentro /public/texture e alla base dei nomi delle varie immagini)
    - repeat: quante volte la texture deve essere ripetuta nell'asse x e y (usare array per valori diversi negli assi o un numero se il valore è lo stesso)
    - maps: array di mappe da usare. Fare riferimento a https://threejs.org/docs/#api/en/materials/MeshStandardMaterial per i nomi delle mappe (il nome dovrà corrispondere al nome dell'immagine)
    - ext: estensione dell'immagine (default png)

  Il nome delle immagini nella cartella texture dovrà essere il seguente:
    /textures/{nome_texture}/{nome_texture}_{nome_mappa}.{ext}
*/

export const addTexture = (material, texture) => {
  // Setting defaults
  let { name = 'texture', repeat = 4, rotation = 0, maps = ['map', 'aoMap', 'normalMap', 'bumpMap', 'roughnessMap', 'metalnessMap'], ext = 'png', isStatic = false } = texture

  if (!material) {
    console.error(`Nessun materiale selezionato per la texture ${name}`)
    return
  }
  if (!maps || !maps.length) {
    console.error(`Nessuna mappa selezionata per la texture ${name}`)
    return
  }

  const textureLoader = new THREE.TextureLoader()
  textureLoader.setCrossOrigin("anonymous")
  
  let path

  //console.log('Loading texture', texture)
  
  return Promise.all(
    maps.map(mapName => {
      if(texture.isStatic) {
        path = `/assets/textures/${name}/${name}_${mapName}.${ext}`
      } else {
        path = texture[mapName]?.url ? `${texture[mapName]?.url}?cacheblock=true` : ''
      }
      if(path) {
        return new Promise((resolve, reject) => {
          textureLoader.load(path, (map) => {
            map.wrapS = THREE.RepeatWrapping
            map.wrapT = THREE.RepeatWrapping
            map.anisotropy = 16
            map.rotation = rotation
            if (repeat.length) {
              map.repeat.set(repeat[0], repeat[1])
            } else {
              map.repeat.set(repeat, repeat)
            }
            material[mapName] = map
            material.needsUpdate = true
            resolve(map)
          }, undefined, (e) => reject(e))
        })
      }
      return
    })
  )
}