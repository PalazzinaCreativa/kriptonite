import * as THREE from 'three'
// Setup
import { setupScene } from './setup/setupScene'
import { setupCamera } from './setup/setupCamera'
import { setupRenderer } from './setup/setupRenderer'
import { setupLights } from './setup/setupLights'
import { setupOrbitControls } from './setup/setupOrbitControls'
import { setupPostprocessing } from './setup/setupPostprocessing'
// Utils
import { detectCollision } from './utils/detectCollision'

// Data
import { GUTTER } from '@/dataset/defaultConfiguratorValues'

// Classes
import Room from './Room'
import Obstacle from './Obstacle'
import Product from './Product'
import Upright from './Upright'
import Shelf from './Shelf'

export default class Viewer {
  constructor (domEl, { room }, callback) {
    this.domEl = domEl

    this.config = {
      room
    } // Lista di dati da salvare per il cliente e per ripopolare il viewer

    this.selectedObject = null // Elemento selezionato
    this.objectToInsert = null // Oggetto da inserire
    this.cantBePositioned = null // selectedObject se in una posizione dove non può essere inserito

    this.availableObjects = []

    this.viewerElements = { // Lista di tutte le istanze del viewer
      room: null,
      obstacles: [],
      product: {
        uprights: [],
        shelves: []
      }
    }

    this.hooks = {
      objectSelected: null
    }

    // Normalize dimensions
    Object.entries(this.config.room.dimensions)
      .forEach(([key, value]) => {
        this.config.room.dimensions[key] = value * 100
      }) // Converte le dimensioni inserite dall'utente per utilizzarle nel viewer

    // Se la stanza è mansardata setta come altezza l'altezz massima
    if (this.config.room.type === 'attic') {
      this.config.room.dimensions.height = Math.max(this.config.room.dimensions.leftHeight, this.config.room.dimensions.rightHeight)
    }
    this.config.room = {
      type: this.config.room.type,
      wallColor: 'ffffff',
      dimensions: this.config.room.dimensions
    }

    this._init(callback)
  }

  async _init (callback) {
    const { type, dimensions } = this.config.room
    this.scene = setupScene()
    this.camera = setupCamera(dimensions, this.domEl)

    this.room = new Room({ type, dimensions })
    await this.room.init() // Aspetto che carichi tutte le texture di pavimento e stanza
    this.scene.add(this.room.main)

    this.product = new Product() // Inizializzo il prodotto

    this.renderer = setupRenderer(this.domEl)

    this.lights = setupLights(dimensions)
    this.lights.forEach(light => {
      this.scene.add(light)
      if (light.target) this.scene.add(light.target)
    })

    const postProcessing = setupPostprocessing(this.scene, this.camera, this.renderer)

    this.composer = postProcessing.composer
    this.outlinePass = postProcessing.outlinePass

    this.controls = setupOrbitControls(this.camera, this.renderer, dimensions)

    this.domEl.appendChild(this.renderer.domElement)

    // Listeners
    window.addEventListener('resize',() => {
      this.camera.aspect = this.domEl.offsetWidth / this.domEl.offsetHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.domEl.offsetWidth, this.domEl.offsetHeight)
      this.animate()
    })

    this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight
    this.camera.updateProjectionMatrix()
    this._animate()
    this._addListeners()

    if (typeof callback === 'function') callback(this)
  }
  // Loop per renderizzare la scena 3d nel canvas
  _animate = () => {
    window.requestAnimationFrame(this._animate)
    this.controls.update()
    this.composer.render() // Uso il composer al posto del renderer per renderizzare
  }

  selectObject () {
    this.hooks.selectedObject('selected')
  }

  setHook (hook, callback) {
    this.hooks[hook] = callback
  }

  _addListeners () {
    let isDragging = false

    const raycaster = new THREE.Raycaster() // Classe Three.js per tracciare il movimento del mouse nella scena

    window.addEventListener('pointermove', (e) => {
      isDragging = true
      this._handlePointerMove(e, raycaster)
    })
    window.addEventListener('pointerdown', (e) => {
      isDragging = false
    })
    window.addEventListener('pointerup', (e) => {
      if (isDragging || typeof this.handlePointerUp !== 'function') return
      this.handlePointerUp(e)
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.objectToInsert) { // Se premo esc con l'oggetto da inserire selezionato
        this.scene.remove(this.objectToInsert.object)
        this.objectToInsert = null
      }
    })

    window.addEventListener('resize', this.handleWindowResize)
  }

  _handlePointerMove (e, raycaster) {
    if (!this.objectToInsert) return
    const pointer = new THREE.Vector2()

    pointer.set( // Aggiorno il pointer con le coordinate della posizione attuale del mouse
      (e.clientX / this.renderer.domElement.offsetWidth) * 2 - 1,
      -(e.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
    )

    raycaster.setFromCamera(pointer, this.camera) // Aggiorna il raycaster con le coordinate del mouse per verificare le intersezioni

    const intersects = raycaster.intersectObjects([this.room.main]) // Controllo i punti di intersezione con la stanza
    const roomIntersection = intersects.find(m => m.object.name === 'room') // Controllo che il mouse sia dentro la stanza
    if (!roomIntersection) return

    const { width, height, depth } = this.objectToInsert.getSize()
    const object = this.objectToInsert.object

    const position = ['x', 'y'] // Calcolo il punto in cui posso posizionare l'elemento sugli assi x e y tenendo conto del padding della stanza
      .map(ace => {
        const objectSize = ace === 'x' ? width : height
        const roomSize = ace === 'x' ? this.config.room.dimensions.width : this.config.room.dimensions.height
        return {
          point: roomIntersection.point[ace] - objectSize / 2 < GUTTER
            ? GUTTER + objectSize / 2
            : roomIntersection.point[ace] + objectSize / 2 > roomSize - GUTTER
              ? roomSize - GUTTER - objectSize / 2
              : roomIntersection.point[ace],
          ace
        }
      })
      .reduce((acc, curr) => ({ ...acc, [curr.ace]: curr.point }), {})

    this.objectToInsert.setPosition(
      position.x,
      position.y,
      isNaN(depth) ? 0.1 : depth / 2
    ) // Assegno al mio oggetto selezionato la posizione del mouse corrente per poterlo muovere all'interno dello spazio

    // Controllo che la posizione corrente dell'elemento sia disponibile
    const collidables = this._getAllObjects(this.objectToInsert.type === 'shelf' ? 'uprights' : undefined)

    const collision = detectCollision(object, collidables)

    if (collision) { // Se è presente più di un elemento (oltre alla stanza) non posso posizinoare l'elemento selezionato
      this._generateOutline(object, 'error')
      this._positioningBlocked = true // Variabile che controlla se posso posizionare o meno gli elementi
      return
    }
    this._positioningBlocked = false // Variabile che controlla se posso posizionare o meno gli elementi
    this._removeOutlines()

    // this.createGuides() // TODO
  }

  _getAllObjects (but) { // Torna un array semplice con tutti gli oggetti 3d nella stanza
    return this.viewerElements
      .obstacles.map(obstacle => obstacle.object)
      .concat(
        but !== 'uprights'
          ? this.viewerElements.product.uprights.map(upright => upright.object)
          : []
      )
      .concat(
        this.viewerElements.product.shelves.map(shelf => shelf.object)
      )
      .flat()
      .filter(o => !!o)
  }


  _generateOutline (objectsToOutline, outlineType) { // NB: Non aggiungo outline, vado a sostituire quelle correnti. È impossibile utilizzare outline diversi allo stesso momento. Per farlo servirà istanziare un nuovo outline pass
    const outlineColors = {
      error: 0xfa4c4c,
      hover: 0xd4d4d4,
      select: 0x12bced
    }
    this.outlinePass.visibleEdgeColor.set(outlineColors[outlineType])
    this.outlinePass.selectedObjects = [objectsToOutline]
  }

  _removeOutlines () {
    this.outlinePass.selectedObjects = []
  }

  async addObstacle (options, callback) {
    const obstacle = new Obstacle(options)
    await obstacle.init()

    this.objectToInsert = obstacle
    this.scene.add(this.objectToInsert.object)

    this.handlePointerUp = (obj) => { // Funzione da eseguire al click se sto inserendo l'ostacolo
      this.room.addObstacle(obj, options.type)
      this.viewerElements.obstacles.push(this.objectToInsert)
      this.objectToInsert = null
      if (typeof callback === 'function') callback(obstacle)
      this.handlePointerUp = undefined // Resetto la funzione da eseguire al click
    }
  }

  async addUpright (options, callback) {
    const upright = new Upright(options, this.product)
    await upright.init()

    this.objectToInsert = upright
    this.scene.add(this.objectToInsert.object)
    this.handlePointerUp = () => { // Funzione da eseguire al click se sto inserendo l'ostacolo
      if (this._positioningBlocked || this.objectToInsert._cantBePositioned) return
      this.objectToInsert._setIndex()
      this.product.addUpright(this.objectToInsert)
      this.viewerElements.product.uprights.push(this.objectToInsert)
      this.objectToInsert = null
      if (typeof callback === 'function') callback(upright)
      this.handlePointerUp = undefined // Resetto la funzione da eseguire al click
      this.addUpright(options, callback)
    }
  }

  async addShelf (options, callback) {
    const shelf = new Shelf(options, this.product)
    await shelf.init()

    this.objectToInsert = shelf
    this.scene.add(this.objectToInsert.object)

    this.handlePointerUp = () => { // Funzione da eseguire al click se sto inserendo l'ostacolo
      if (this._positioningBlocked || this.objectToInsert._cantBePositioned) return
      this.objectToInsert._setIndex()
      this.product.addShelf(this.objectToInsert)
      this.viewerElements.product.shelves.push(this.objectToInsert)
      this.objectToInsert = null
      if (typeof callback === 'function') callback(shelf)
      this.handlePointerUp = undefined // Resetto la funzione da eseguire al click
      this.addShelf(options, callback)
    }
  }
}
