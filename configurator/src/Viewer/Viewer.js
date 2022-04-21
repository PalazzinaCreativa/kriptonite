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
  constructor (domEl, { room, product }, callback) {
    this.domEl = domEl

    this.config = {
      room,
      product
    } // Lista di dati da salvare per il cliente e per ripopolare il viewer

    this.selectedObject = null // Elemento selezionato
    this.objectToInsert = null // Oggetto da inserire
    this.cantBePositioned = null // selectedObject se in una posizione dove non può essere inserito

    this.hooks = {
      objectSelected: null,
      getData: null
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

    this._init(callback)
  }

  async _init (callback) {
    const { type, dimensions } = this.config.room
    this.scene = setupScene()
    this.camera = setupCamera(dimensions, this.domEl)

    this.room = new Room({ type, dimensions })
    await this.room.init() // Aspetto che carichi tutte le texture di pavimento e stanza
    this.scene.add(this.room.main)

    this.product = new Product({ inRoomPosition: this.config.product.layout, uprightsPosition: this.config.product.uprightsPosition })
    this.scene.add(this.product.group)
    this.obstacles = []

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

    this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight
    this.camera.updateProjectionMatrix()
    this._animate()
    this._addListeners()

    await this._populate()
    if (typeof callback === 'function') callback(this)
  }
  // Loop per renderizzare la scena 3d nel canvas
  _animate = () => {
    window.requestAnimationFrame(this._animate)
    this.controls.update()
    this.composer.render() // Uso il composer al posto del renderer per renderizzare
  }

  async _populate () {
    if (this.config.room.wallColor) this.room.changeWallColor(this.config.room.wallColor)
    if (this.config.room.floorType) this.room.changeFloor(this.config.room.floorType)
    const objects = []

    if (this.config.room && this.config.room.obstacles) objects.push(this.config.room.obstacles.map(o => Object.assign(o, { type: 'obstacle' }, {})))
    if (this.config.product && this.config.product.uprights) objects.push(this.config.product.uprights.map(u => Object.assign(u, { type: 'upright' }, {})))
    if (this.config.product && this.config.product.shelves) objects.push(this.config.product.shelves.map(s => Object.assign(s, { type: 'shelf' }, {})))

      objects
        .flat()
        .forEach(async o => {
          const data = this.hooks.getData(o)

          let object
          if (o.type === 'obstacle') object = new Obstacle(data, this.room)
          if (o.type === 'upright') object = new Upright(Object.assign(data, { index: o.index, realIndex: o.realIndex }, {}), this.product)
          if (o.type === 'shelf') object = new Shelf(Object.assign(data, { index: o.index }, {}), this.product)

          await object.init()
          object.object.scale.set(o.scale.x, o.scale.y, o.scale.z)
          object.object.position.set(o.position.x, o.position.y, o.position.z)

          if (o.type === 'obstacle') this.room.addObstacle(object)
          if (o.type === 'upright') this.product.addUpright(object)
          if (o.type === 'shelf') this.product.addShelf(object)
        })
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
    let savedPos

    window.addEventListener('pointermove', (e) => {
      isDragging = true
      this._handlePointerMove(e, raycaster)
    })
    window.addEventListener('pointerdown', (e) => {
      isDragging = false
      // Se c'è un elemento selezionato inizio il drag (se non è un montante)
      if (this.selectedElement && this.selectedElement.type !== 'upright') {
        setTimeout(() => {
          if (!isDragging) return
          this.objectToInsert = this.selectedElement
          this.controls.enabled = false
          if (!savedPos) savedPos = { x: this.selectedElement.getPosition().x, y: this.selectedElement.getPosition().y, z: this.selectedElement.getPosition().z }
        }, 200)
      }
    })
    window.addEventListener('pointerup', (e) => {
      // Se sto spostando un elemento in una zona non idonea
      if (this.selectedElement && this.objectToInsert && this._positioningBlocked) {
        this.selectedElement.object.position.set(savedPos.x, savedPos.y, savedPos. z)
        this.selectedElement = null
        this.objectToInsert = null
        savedPos = null
        return
      }

      // Se sto spostando un elemento
      if (this.selectedElement && this.objectToInsert && !this._positioningBlocked) {
        this.objectToInsert = null
        this.controls.enabled = true
        savedPos = null
        return
      }

      if (isDragging || typeof this.handlePointerUp !== 'function' || (this.objectToInsert && this._positioningBlocked)) return

      this.handlePointerUp(e)
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.objectToInsert) { // Se premo esc con l'oggetto da inserire selezionato
        this.handlePointerUp = null
        this.scene.remove(this.objectToInsert.object)
        this.objectToInsert = null
        this.product.removeWireframes()
      }
    })

    window.addEventListener('resize',() => {
      this.camera.aspect = this.domEl.offsetWidth / this.domEl.offsetHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.domEl.offsetWidth, this.domEl.offsetHeight)
      this._animate()
    })
  }

  _handlePointerMove (e, raycaster) {
    const pointer = new THREE.Vector2()

    pointer.set( // Aggiorno il pointer con le coordinate della posizione attuale del mouse
      (e.clientX / this.renderer.domElement.offsetWidth) * 2 - 1,
      -(e.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
    )

    raycaster.setFromCamera(pointer, this.camera) // Aggiorna il raycaster con le coordinate del mouse per verificare le intersezioni

    // Se non c'è nessun elemento da inserire, al pointermove cerco elementi da selezionare per modificarli
    if (!this.objectToInsert) {
      const intersects = raycaster.intersectObjects(this._getAllObjects())
      if (!intersects || !intersects.length) {
        this._removeOutlines()
        this.handlePointerUp = null
        this.selectedElement = null
        document.body.style.cursor = 'auto'
        return
      }
      const element = this._getInstanceFromMesh(intersects[0].object)
      this._generateOutline(element.object, 'hover')
      this.selectedElement = element
      document.body.style.cursor = 'pointer'
      this.handlePointerUp = () => {
        this._removeOutlines()
        this._generateOutline(element.object, 'select')
        console.log(element.index)
        this.hooks.selectElement(element)
        document.body.style.cursor = 'auto'
      }
      return
    }

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

    this.objectToInsert.setPosition({
      x: position.x,
      y: position.y,
      z: isNaN(depth) ? 0.1 : depth / 2
    }) // Assegno al mio oggetto selezionato la posizione del mouse corrente per poterlo muovere all'interno dello spazio

    // Controllo che la posizione corrente dell'elemento sia disponibile
    const collidables = this._getAllObjects(this.objectToInsert.type === 'shelf' ? ['uprights'] : []).filter(c => c !== object)

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

  _getAllObjects (but = []) { // Torna un array con tutti gli oggetti 3d nella stanza tranne quelli presenti nell'array but
    return this.room.obstacles.map(obstacle => obstacle.object)
      .concat(
        !but.includes('uprights')
          ? this.product.uprights.map(upright => upright.object)
          : []
      )
      .concat(
        !but.includes('shelves')
          ? this.product.shelves.map(shelf => shelf.object)
          : []
      )
      // .concat(
      //   !but.includes('room')
      //     ? this.room.main
      //     : []
      // )
      .flat()
      .filter(o => !!o)
  }


  _generateOutline (objectsToOutline, outlineType) { // NB: Non aggiungo outline, vado a sostituire quelle correnti. È impossibile utilizzare outline diversi allo stesso momento. Per farlo servirà istanziare un nuovo outline pass
    const outlineColors = {
      error: 0xfa4c4c,
      hover: 0xededed,
      select: 0x12bced
    }
    this.outlinePass.visibleEdgeColor.set(outlineColors[outlineType])
    this.outlinePass.selectedObjects = [objectsToOutline]
  }

  _removeOutlines () {
    this.outlinePass.selectedObjects = []
  }

  // TODO: Unire addObstacle, addUpright, addShelf in un'unica funzione
  async addObstacle (options, callback) {
    const obstacle = new Obstacle(options, this.room)
    await obstacle.init()

    this.objectToInsert = obstacle
    // Initial Position
    this.objectToInsert.object.position.set(this.config.room.dimensions.width / 2, this.config.room.dimensions.height / 2, -10)

    this.scene.add(this.objectToInsert.object)
    this.handlePointerUp = (obj) => { // Funzione da eseguire al click se sto inserendo l'ostacolo
      this.scene.remove(this.objectToInsert.object)
      this.room.addObstacle(this.objectToInsert)
      this.obstacles.push(this.objectToInsert)
      this.objectToInsert = null
      if (typeof callback === 'function') callback(obstacle)
      this.handlePointerUp = undefined // Resetto la funzione da eseguire al click
    }
  }

  async addUpright (options, callback) {
    const upright = new Upright(options, this.product)
    await upright.init()

    upright._generateSiblingWireframe(this.config.room.dimensions.width, this.config.room.dimensions.height)

    this.objectToInsert = upright
    // Initial Position
    this.objectToInsert.object.position.set(this.config.room.dimensions.width / 2, this.config.room.dimensions.height / 2, -10)

    this.scene.add(this.objectToInsert.object)
    this.handlePointerUp = () => { // Funzione da eseguire al click se sto inserendo l'ostacolo
      if (this._positioningBlocked || this.objectToInsert._cantBePositioned) return
      this.objectToInsert._setIndex()
      this.scene.remove(this.objectToInsert.object) // Rimuovo elmento dalla scena perchè verrà inserito nella riga seguente
      this.product.addUpright(this.objectToInsert)
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
    // Initial Position
    this.objectToInsert.object.position.set(this.config.room.dimensions.width / 2, this.config.room.dimensions.height / 2, -10)

    this.scene.add(this.objectToInsert.object)

    this.handlePointerUp = () => { // Funzione da eseguire al click se sto inserendo l'ostacolo
      if (this._positioningBlocked || this.objectToInsert._cantBePositioned) return
      this.scene.remove(this.objectToInsert.object) // Rimuovo elmento dalla scena perchè verrà inserito nella riga seguente
      this.product.addShelf(this.objectToInsert)
      this.objectToInsert = null
      if (typeof callback === 'function') callback(shelf)
      this.handlePointerUp = undefined // Resetto la funzione da eseguire al click
      this.addShelf(options, callback)

      this.updateConfig()
    }
  }

  updateConfig () {
    const wallColor = this.room.wallColor
    const floorType = this.room.floorType

    const obstacles = this.obstacles
      .map(obstacle => ({
        id: obstacle.id,
        position: { x: obstacle.object.position.x, y: obstacle.object.position.y, z: obstacle.object.position.z },
        scale: { x: obstacle.object.scale.x, y: obstacle.object.scale.y, z: obstacle.object.scale.z },
      }))

    const uprights = this.product.uprights
      .map(upright => ({
        id: upright.id,
        variantId: upright.variantId,
        position: { x: upright.object.position.x, y: upright.object.position.y, z: upright.object.position.z },
        scale: { x: upright.object.scale.x, y: upright.object.scale.y, z: upright.object.scale.z },
      }))

    const shelves = this.product.shelves
      .map(shelf => ({
        id: shelf.id,
        variantId: shelf.variantId,
        position: { x: shelf.object.position.x, y: shelf.object.position.y, z: shelf.object.position.z },
        scale: { x: shelf.object.scale.x, y: shelf.object.scale.y, z: shelf.object.scale.z },
        index: shelf.index,
        realIndex: shelf.realIndex
      }))

    this.config.room.wallColor = wallColor
    this.config.room.floorType = floorType

    this.config.room.obstacles = obstacles
    this.config.product.uprights = uprights
    this.config.product.shelves = shelves
  }

  // Metodo che mi ritorna un'istanza del configuratore a partire da una mesh (utile per esempio nel raycaster che torna solo mesh)
  _getInstanceFromMesh (mesh) {
    return [...this.room.obstacles, ...this.product.uprights, ...this.product.shelves]
      .find(instance => {
        let hasMesh = false
        instance.object.traverse(child => {
          if (child === mesh) {
            hasMesh = true
          }
        })
        return hasMesh
      })
  }
}
