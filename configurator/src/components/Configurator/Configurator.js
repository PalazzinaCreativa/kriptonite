import { setupScene } from './setup/setupScene'
import { setupCamera } from './setup/setupCamera'
import { setupFloor } from './setup/setupFloor'
import { setupRoom } from './setup/setupRoom'
import { setupRenderer } from './setup/setupRenderer'
import { setupLights } from './setup/setupLights'
import { setupOrbitControls } from './setup/setupOrbitControls'
import { loadObject } from './utils/loadObject'
import * as THREE from 'three'
import { OBJECTS_ON_THE_GROUND, GUTTER } from '@/dataset/defaultConfiguratorValues'

export default class Configurator {
  constructor (el, options) {
    this.el = el
    this.options = options
    this.normalizeDimensions()
    this.init()
    this.objectsToIntersect = [] // Quando muovo un elemento all'interno della scena controllo se vengono intersecati questi oggetti
  }

  normalizeDimensions () {
    Object.entries(this.options.dimensions)
    .forEach(([key, value]) => {
      this.options.dimensions[key] = value * 100
    }) // Converte le dimensioni inserite dall'utente

    // Se la stanza è mansardata setta come altezza l'altezz massima
    if (this.options.type === 'attic') {
      this.options.dimensions.height = Math.max(this.options.dimensions.leftHeight, this.options.dimensions.rightHeight)
    }
  }

  async init () {
    const { layout, type, dimensions } = this.options
    this.scene = setupScene()
    this.camera = setupCamera(dimensions, this.el)
    this.floor = await setupFloor(dimensions.width, type)
    this.room = await setupRoom(type, dimensions)
    this.objectsToIntersect.push(this.room)



    this.renderer = setupRenderer(this.el)
    this.lights = setupLights(dimensions)
    this.lights.forEach(light => {
      this.scene.add(light)
      if (light.target) this.scene.add(light.target)
    })



    // Inizializzo le funzioni per lo spostamento degli elementi nella scena
    this.raycaster = new THREE.Raycaster() // Funzioni per tracciare il mouse nella scena
    this.pointer = new THREE.Vector2() // Vector2 vuoto, da aggiornare con le coordinate del mouse quando in movimento

    this.addToScene([
      this.floor,
      this.room,
      // grid,
      ...this.lights
    ])

    this.controls = setupOrbitControls(this.camera, this.renderer, dimensions)

    this.el.appendChild(this.renderer.domElement)

    // Listeners
    window.addEventListener('resize', this.handleWindowResize)
    this.animate()
  }

  // --- Utils

  // Aggiungere elementi alla scena principale
  addToScene (elements) {
    if (elements.length) {
      elements.forEach(el => {
        this.scene.add(el)
      })
      return
    }
    this.scene.add(elements)
  }

  // Render della scena 3d
  animate () {
    const animate = () => {
      requestAnimationFrame(animate)
      this.renderer.render( this.scene, this.camera )
      this.controls.update()
    }
    animate()
  }

  // Gestione window resize
  handleWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize( window.innerWidth, window.innerHeight )

    this.render()
    this.animate()
  }

  // Calcola la dimensione di un oggetto della scena. Prende come parametro il modello e ritorna un oggetto { width, height, depth }
  getObjectSize (object) {
    const boundingBox = new THREE.Box3().setFromObject(object)
    return {
      width: boundingBox.max.x - boundingBox.min.x,
      height: boundingBox.max.y - boundingBox.min.y,
      depth: boundingBox.max.z - boundingBox.min.z
    }
  }

  // -- Metodi

  // Cambia colore della parete
  changeWallColor (color) {
    if (!this.room) return
    const threeColor = new THREE.Color(color)
    this.room.material.color.setHex(threeColor.getHex())
  }

  // Seleziona l'oggetto da inserire
  async pickUp ({ id, path, dimensions }) {
    // Se non esiste lo importo dal path
    const object = await loadObject(path, id)
    object.name = id

    if (dimensions) {
      // Se sono specificate le dimensioni, prendo le dimensioni dell'oggetto per scalarlo nelle dimensioni che vogliamo dargli
      const { width, height, depth } = this.getObjectSize(object)
      object.scale.set(
        dimensions.width / width,
        dimensions.height / height,
        dimensions.depth / depth
      )

    }

    // Aggiorno la variabile isMoving con l'oggetto selezionato
    this.isMoving = object
    const { depth } = this.getObjectSize(this.isMoving)
    this.isMoving.position.set(this.options.dimensions.width / 2, this.options.dimensions.height / 2, depth || 0.1) // Posizione iniziale dell'oggetto selezionato
    window.addEventListener('pointermove', e => this.handlePointerMove(e))
    window.addEventListener('click', e => this.handleClickObjectPositioning(e))
    this.objectsToIntersect.push(this.isMoving)
    this.scene.add(object)
  }

  // Muovo l'oggetto nella scena (solo nell'asse x o y)
  handlePointerMove (event) {
    // Controllo se ho qualche oggetto selezionato
    if (!this.isMoving) return
    this.pointer.set( // Aggiorno il pointer con le coordinate della posizione attuale del mouse
      (event.clientX / this.renderer.domElement.offsetWidth) * 2 - 1,
      -(event.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
    )

    this.raycaster.setFromCamera(this.pointer, this.camera) // Aggiorna il raycaster con le coordinate del mouse per verificare le intersezioni

    const intersects = this.raycaster.intersectObjects(this.objectsToIntersect) // Controllo le intersezioni con gli altri elementi della scena
    const roomIntersection = intersects.find(m => m.object.name === 'room') // Controllo che il mouse sia dentro la stanza
    if (!roomIntersection) return

    const { width, height, depth } = this.getObjectSize(this.isMoving)
    const positionX = roomIntersection.point.x - width / 2 < GUTTER // Calcolo in che punto x posizionare l'elemento basandomi sul punto minimo e massimo in cui posso posizionarlo
      ? GUTTER + width / 2
      : roomIntersection.point.x + width / 2 > this.options.dimensions.width - GUTTER
        ? this.options.dimensions.width - GUTTER - width / 2
        : roomIntersection.point.x

    const positionY = roomIntersection.point.y - height / 2 < GUTTER
      ? GUTTER + height / 2
      : roomIntersection.point.y + height / 2 > this.options.dimensions.height - GUTTER
        ? this.options.dimensions.height - GUTTER - height / 2
        : roomIntersection.point.y

    this.isMoving.position.set(
      positionX,
      OBJECTS_ON_THE_GROUND.includes(this.isMoving.name) ? height / 2 : positionY, // Controllo se deve stare a contatto con il pavimento
      isNaN(depth) ? 0.1 : depth / 2
    ) // Assegno al mio oggetto selezionato la posizione del mouse corrente per poterlo muovere all'interno dello spazio

    this.checkPosition()
  }

  handleClickObjectPositioning (event) {
    if (!this.isMoving || !this.canBePositioned) return
    this.isMoving = null
    window.removeEventListener('pointermove', (e) => this.handlePointerMove(e))
  }

  // Metodo che controlla se l'elemento può essere posizionato nella posizione corrente
  checkPosition () {
    const intersects = this.raycaster.intersectObjects(this.objectsToIntersect)
    if (intersects.filter(i => i.object.name !== this.isMoving.name).length > 1) {
      this.canBePositioned = false

      intersects.filter(i => i.object.name === this.isMoving.name)
        .map(obj => obj.object)
        .forEach(mesh => {
          const geo = new THREE.EdgesGeometry(mesh.geometry)
          const mat = new THREE.LineBasicMaterial({ color: 0xbb4444, linewidth: 50 });
          const wireframe = new THREE.LineSegments(geo, mat);
          wireframe.renderOrder = 1
          mesh.add(wireframe)
        })
      return false
    }
    if ( this.scene.getObjectByName('error_wireframe')) this.scene.remove(this.scene.getObjectByName('error_wireframe'))
    this.canBePositioned = true
    return true
  }
}

