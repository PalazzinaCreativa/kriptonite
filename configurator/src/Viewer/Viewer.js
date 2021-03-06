import * as THREE from 'three'

// Setup
import { setupScene } from './setup/setupScene'
import { setupCamera } from './setup/setupCamera'
import { setupRenderer } from './setup/setupRenderer'
import { setupLights } from './setup/setupLights'
import { setupOrbitControls } from './setup/setupOrbitControls'
import { setupPostprocessing } from './setup/setupPostprocessing'

// Utils
import { gsap } from 'gsap'

// Classes
import Room from './Room'
import Obstacle from './Obstacle'
import Product from './Product'
import Upright from './Upright'
import Shelf from './Shelf'
import Case from './Case'
import { loadObject } from './utils/loadObject'
import { placeObject } from './utils/placeObject'
import { isTouchDevice } from './utils/isTouchDevice'
import { STANDALONE_Z } from '../dataset/defaultConfiguratorValues'

export default class Viewer {
  constructor (domEl, { room, product, shared = false }, callback) {
    this.domEl = domEl

    // Lista di dati da salvare per il cliente e per ripopolare il viewer
    this.config = {
      room,
      product,
      shared
    }

    // Proprietà che serve per differenziare i vari elementi a ripetizione inseriti nella scena
    this.copy = 0

    // Elemento selezionato
    this.selectedObject = null

    // L'elemento in fase di inserimento
    this.objectToPlace = null

    // Descrive se "selectedObject" è in una posizione dove può essere inserito o meno
    this.cantBePositioned = null

    this.hooks = {
      objectSelected: null,
      getData: null
    }

    this.elementVariantExists = true

    // Tentativo di debounce
    this.previousUprightBetweenDistance = 0

    // Storia del progetto
    this._history = []
    this._historyPosition = 0

    // Converte le dimensioni inserite dall'utente per utilizzarle nel viewer se non è una configurazione condivisa
    if(!this.config.shared) {
      Object.entries(this.config.room.dimensions).forEach(([key, value]) => {
        this.config.room.dimensions[key] = value * 100
      })
    }

    // Se la stanza è mansardata setta come altezza il valore massimo possibile
    if (this.config.room.type === 'attic') {
      this.config.room.dimensions.height = Math.max(this.config.room.dimensions.leftHeight, this.config.room.dimensions.rightHeight)
    }

    // Il Viewer viene inizializzato
    this._init(callback)
  }

  async _init (callback) {
    const { type, dimensions } = this.config.room

    // Crea la scena
    this.scene = setupScene()

    // Posiziona la camera
    this.camera = setupCamera(dimensions, this.domEl, this.config.room)

    // Crea la stanza
    this.room = new Room(this, { type, dimensions })
    
    // Carica le impostazioni della stanza, comprese le texture di pavimento e pareti
    await this.room.init()

    this.product = new Product(this, { type: this.config.product.type, inRoomPosition: this.config.product.inRoomPosition, uprightsPosition: this.config.product.uprightsPosition })
    
    this.obstacles = []

    this.renderer = setupRenderer(this.domEl)

    // console.log(this.lights, this.room)

    this.lights = setupLights(dimensions)
    this.lights[this.room.config.type].forEach(light => {
      this.scene.add(light)
      if (light.target) this.scene.add(light.target)
    })

    const postProcessing = setupPostprocessing(this.scene, this.camera, this.renderer)

    this.composer = postProcessing.composer
    this.outlinePass = postProcessing.outlinePass

    this.controls = setupOrbitControls(this.camera, this.renderer, dimensions)
    this._isPanning = false // Variabile per controllare il comportamento del click del mouse: pan / rotate

    this.domEl.appendChild(this.renderer.domElement)

    this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight
    this.camera.updateProjectionMatrix()
    this._animate()
    this._addListeners()

    this.human = await loadObject('/assets/objects/human/human.gltf')
    this.scene.add(this.human)

    this.human.position.set(50, 0, 130)
    this.human.visible = false
    this.human.traverse(child => {
      if (child.material?.name === 'text_material') child.material.color = new THREE.Color(0x9b9b9b)
    })

    await this._feed()
    this.updateConfig()
    if (typeof callback === 'function') callback(this)

    // Three devtools https://github.com/threejs/three-devtools
    if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
      __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: this.scene }));
      __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: this.renderer }));
    }
  }
  // Loop per renderizzare la scena 3d nel canvas
  _animate = () => {
    window.requestAnimationFrame(this._animate)
    this.controls.update()
    this.composer.render() // Uso il composer al posto del renderer per renderizzare
  }

  async _feed (c) {
    const config = c || this.config
    if (config.room.wallColor) this.room.changeWallColor(config.room.wallColor)
    if (config.room.floorType) this.room.changeFloor(config.room.floorType)
    const objects = []

    if (config.room && config.room.obstacles) objects.push(config.room.obstacles.map(o => Object.assign(o, { type: 'obstacle' }, {})))
    if (config.product && config.product.uprights) objects.push(config.product.uprights.map(u => Object.assign(u, { type: 'upright' }, {})))
    if (config.product && config.product.shelves) objects.push(config.product.shelves.map(s => Object.assign(s, { type: 'shelf', nature: s.nature }, {})))
    if (config.product && config.product.cases) objects.push(config.product.cases.map(c => Object.assign(c, { type: 'case', nature: c.nature }, {})))
    
    //console.log('feed', objects.flat())

    for (const o of objects.flat()) { // For per mantenere il ciclo asincrono
      const data = this.doHook('getData', o)
      // console.log('data', data, 'o', o)
      let object
      if (o.type === 'obstacle') object = new Obstacle(data, this.room)
      if (o.type === 'upright') object = new Upright({ ...data, index: o.index, realIndex: o.realIndex }, this.product)
      if (o.type === 'shelf') object = new Shelf({ ...data, index: o.index, realIndex: o.realIndex }, this.product)
      if (o.type === 'case') object = new Case({ ...data, index: o.index, realIndex: o.realIndex }, this.product)

      // console.log('oggetto caricato', object)
      await object.init()
      //console.log('scaling', object)

      // Non serve più scalare gli oggetti se il searchForElementVariant è attivato
      //object.object.scale.set(o.scale.x, o.scale.y, o.scale.z)
      object.object.position.set(o.position.x, o.position.y, o.position.z)

      if (typeof object._setIndex === 'function') object._setIndex()

      if (o.material) object.setMaterial(o.material)

      if (o.type === 'obstacle') this.room.addObstacle(object, false)
      if (o.type === 'upright') this.product.addUpright(object, false)
      if (o.type === 'shelf') this.product.addShelf(object, false)
      if (o.type === 'case') this.product.addCase(object, false)
    }
  }

  setHook (hook, callback) {
    this.hooks[hook] = callback
  }

  _addListeners () {
    let isDragging = false
    let hoveredElement, checkpointPosition

    const raycaster = new THREE.Raycaster() // Classe Three.js per tracciare il movimento del mouse nella scena
    const pointer = new THREE.Vector2()

    this.domEl.addEventListener('pointermove', (e) => {
      pointer.set( // Aggiorno il pointer con le coordinate della posizione attuale del mouse
        (e.clientX / this.renderer.domElement.offsetWidth) * 2 - 1,
        -(e.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
      )
      raycaster.setFromCamera(pointer, this.camera) // Aggiorna il raycaster con le coordinate del mouse per verificare le intersezioni

      // Se c'è un oggetto da posizionare
      if (this.objectToPlace) {
        const intersects = raycaster.intersectObjects([this.room.main]) // Controllo i punti di intersezione con la stanza
        const roomIntersection = intersects.find(m => m.object.name === 'room') // Controllo che il mouse sia dentro la stanza
        if (!roomIntersection) return

        //console.log('oggetto da posizionare:', true, 'roomIntersection:', roomIntersection)
        //console.log(this.objectToPlace._cantBePositioned)
        
        // Se è un montante K2 cielo-terra posizionato in una mansarda ricalcolo la sua altezza al movimento del mouse nella scena
        if(this.objectToPlace?.config?.type === 'upright' && this.room.config.type === 'attic' && this.objectToPlace.product?.type === 'k2' && this.objectToPlace.product?.uprightsPosition === 'standalone') {
          this.objectToPlace.setSize()
        }

        // Se si sta posizionando un ripiano o un contenitore
        if(this.objectToPlace && (this.objectToPlace?.config?.type === 'shelf' || this.objectToPlace?.config?.type === 'case')) {
          // Selezione della variante corretta in base alla distanza tra i montanti in questa posizione, invio della larghezza ad ElementConfigurator
          var currentDistanceBetweenUprights = Math.round(this.objectToPlace.getSize().width)
          //if(currentDistanceBetweenUprights !== this.previousUprightBetweenDistance) {
            //console.log('update:', 'previous:', this.previousUprightBetweenDistance, 'current:', currentDistanceBetweenUprights)
          //}
          this.elementVariantExists = this.doHook('searchForElementVariant', { id: this.objectToPlace.config.id, type: this.objectToPlace.config.type, width: currentDistanceBetweenUprights.toPrecision(2), isChanged: currentDistanceBetweenUprights !== this.previousUprightBetweenDistance })
          this.previousUprightBetweenDistance = currentDistanceBetweenUprights !== this.previousUprightBetweenDistance ? currentDistanceBetweenUprights : this.previousUprightBetweenDistance
          //console.log('can position element:', !objectPlaced)
        }

        // Ritorna true se trova collisioni con altri oggetti
        var objectPlaced = placeObject({
          point: roomIntersection.point,
          element: this.objectToPlace,
          collidables: this._getAllObjects((this.objectToPlace?.config?.type === 'shelf' || this.objectToPlace?.config?.type === 'case') ? ['uprights'] : []).filter(c => c !== this.objectToPlace.object),
          room: this.config.room
        }) || this.objectToPlace._cantBePositioned

        //console.log('collisioni con altri oggetti:', objectPlaced, 'variante trovata:', this.elementVariantExists, (objectPlaced && !this.elementVariantExists))

        if (objectPlaced || !this.elementVariantExists) {
          this.outlinePass.error.selectedObjects = [this.objectToPlace.object]
          this._positioningBlocked = true
          document.body.style.cursor = 'not-allowed'
          this.objectToPlace.object.traverse(child => {
            if (child.material) {
              //child.material.transparent = true
              child.material.opacity = 0.2
            }
          })
          return
        }

        document.body.style.cursor = 'auto'
        this.objectToPlace.object.traverse(child => {
          if (child.material) {
            //child.material.transparent = true
            child.material.opacity = 1
          }
        })
        this._positioningBlocked = false // Variabile che controlla se posso posizionare o meno gli elementi
        this.outlinePass.error.selectedObjects = []
        return
      }

      //console.log('is adding a new element', this._isAddingNewElement)

      if (this._isAddingNewElement) return
      // Se non ho alcun oggetto da posizionare
      const intersects = raycaster.intersectObjects(this._getAllObjects()) // Controllo i punti di intersezione con la stanza

      // Se non sono in hover su nessun elemento
      if (!intersects.length) {
        this.outlinePass.hover.selectedObjects = []
        document.body.style.cursor = 'auto'
        hoveredElement = null
        return
      }
      // Hover sull'oggetto
      hoveredElement = (!this.config.shared || (this.config.shared && import.meta.env.DEV)) && this._getInstanceFromMesh(intersects[0].object)
      if (!hoveredElement) return
      this.outlinePass.hover.selectedObjects = [hoveredElement.object]
      document.body.style.cursor = 'pointer'
      
      // Se c'è un elemento selezionato e sono in hover su di lui inizio il drag (se non è un montante)
      if (hoveredElement && hoveredElement.config.type !== 'upright') {
      // console.log(hoveredElement, 'isDragging:', isDragging)
      if (!isDragging) return
      this._selectElement(hoveredElement)
      this.objectToPlace = hoveredElement
      // TODO: Feedback per l'utente per vedere l'oggetto selezionato
      if (!checkpointPosition && this.objectToPlace) checkpointPosition = { x: this.objectToPlace.getPosition().x, y: this.objectToPlace.getPosition().y, z: this.objectToPlace.getPosition().z } // Backup della posizione dell'elemento. Se lo posiziono in una posizione non idonea, torna in questo punto
      this.controls.enabled = false
      }
    })

    this.domEl.addEventListener('pointerdown', (e) => {
      if (hoveredElement && (!this.config.shared || (this.config.shared && import.meta.env.DEV)))  {
        isDragging = true
      }
    })

    // Evento al rilascio del mouse
    this.domEl.addEventListener('pointerup', (e) => {
      // L'evento di trascinamento è completato
      isDragging = false
      this.controls.enabled = true
      
      // Se si sta posizionando un elemento
      // console.log('isAdding:', this._isAddingNewElement, 'object:', this.objectToPlace)
      if (this.objectToPlace) {
        // Se l'elemento è in una posizione non idonea
        if (this._positioningBlocked || this.objectToPlace._cantBePositioned) {
          // Se si sta aggiungendo un nuovo elemento non faccio nulla
          if (this._isAddingNewElement) return
          // Se ho una posizione di backup torno in quel punto
          if (checkpointPosition) {
            this.objectToPlace.object.scale.set(1, 1, 1)
            this.objectToPlace.object.position.set(checkpointPosition.x, checkpointPosition.y, checkpointPosition.z)
          }
          this.objectToPlace.setMaterial({ opacity: 1 })
          this.objectToPlace = null
          this.selectedElement = null
          checkpointPosition = null
          return
        }

        // Aggiungo l'indice all'elemento in base alla sua posizione nello spazio, in modo da poterlo cercare facilmente.
        if (typeof this.objectToPlace._setIndex === 'function') {
          this.objectToPlace._setIndex()
        }

        // Rimuovo elmento dalla scena perchè verrà reinserito nella riga seguente
        this.scene.remove(this.objectToPlace.object)
        
        if (this._isAddingNewElement) {
          if (this.objectToPlace.config.type === 'obstacle') this.room.addObstacle(this.objectToPlace)
          if (this.objectToPlace.config.type === 'upright') this.product.addUpright(this.objectToPlace)
          if (this.objectToPlace.config.type === 'shelf') this.product.addShelf(this.objectToPlace)
          if (this.objectToPlace.config.type === 'case') this.product.addCase(this.objectToPlace)
        } else {
          this.objectToPlace.setMaterial(this.objectToPlace.config?.material || { opacity: 1 })
        }

        const newConfig = { ...this.objectToPlace.config, copy: this.copy++ } // Mi salvo la configurazione dell'oggetto corrente per utilizzarla nel prodotto da inserire in seguito

        this.objectToPlace = null
        checkpointPosition = null
        this.updateConfig()
        
        // Deseleziono l'ostacolo non appena viene posizionato sulla scena
        if(newConfig.type === 'obstacle') {
          this.doHook('removeSelectedElement')
        }

        // Se l'elemento è abilitato per l'inserimento a ripetizione e si sta aggiungendo un nuovo elemento alla scena
        if (this._isAddingNewElement && newConfig.type !== 'obstacle') {
          this.addElement(newConfig)
          return
        }
        this._isAddingNewElement = false
        return
      }
      // Se non sono in hover su nessun elemento, elimino eventuali selezioni
      if (!hoveredElement) {
        this.selectedElement = null
        this.outlinePass.select.selectedObjects = []
        this.doHook('removeSelectedElement')
        return
      }

      // Se ho un elemento in hover seleziono quell'elemento
      this._selectElement(hoveredElement)
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.objectToPlace) { // Se premo esc con l'oggetto da inserire selezionato
        this.scene.remove(this.objectToPlace.object)
        this.objectToPlace = null
        this.doHook('removeSelectedElement')
        this.product.removeWireframes()
        this._isAddingNewElement = false
      }
    })

    window.addEventListener('resize',() => {
      this.zoomOnTarget({ z: 400 }, 0.3)
      this.camera.aspect = this.domEl.offsetWidth / this.domEl.offsetHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.domEl.offsetWidth, this.domEl.offsetHeight)
      this._animate()
      this.zoomOnTarget()
    })
  }

  _selectElement (element) {
    //console.log(element)
    if(!this.config.shared || (this.config.shared && import.meta.env.DEV)) {
      element.isEdit = true
      this.outlinePass.hover.selectedObjects = []
      this.outlinePass.select.selectedObjects = [element.object]
      this.selectedElement = element
      this.zoomOnTarget({ ...element.getPosition(), z: 500 })
      this.doHook('selectElement', element)
      document.body.style.cursor = 'auto'
    }
  }

  _unselectAll (repositionCamera) {
    this.outlinePass.select.selectedObjects = []
    this.selectedElement = null
    this._isAddingNewElement = false
    this.product.removeWireframes()
    if (this.objectToPlace) {
      this.scene.remove(this.objectToPlace.object)
      this.objectToPlace = null
    }
    if (repositionCamera) this.zoomOnTarget()
  }

  _getAllObjects (but = []) {
    // Torna un array con tutti gli oggetti 3d nella stanza tranne quelli presenti nell'array but
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
      .concat(
        !but.includes('cases')
          ? this.product.cases.map(item => item.object)
          : []
      )
      .flat()
      .filter(o => !!o)
  }

  async addElement (config) {
    // console.log('aggiungo', config)
    this._isAddingNewElement = true

    // Se è un dispositivo touch disabilito i movimenti di camera al touch
    if (isTouchDevice()) this.controls.enabled = false

    // resetto eventuali impostazioni di un precedente inserimento
    if (this.objectToPlace) {
      this.scene.remove(this.objectToPlace.object)
      this.objectToPlace = null
      this.product.removeWireframes()
    }

    // Inizializzo un nuovo elemento
    let element
    if (config.type === 'obstacle') element = new Obstacle(config, this.room)
    if (config.type === 'upright') element = new Upright(config, {...this.product, type: this.config.product?.type })
    if (config.type === 'shelf') element = new Shelf(config, {...this.product, type: this.config.product?.type })
    if (config.type === 'case') element = new Case(config, {...this.product, type: this.config.product?.type })

    await element.init()

    // Creo le linee guida
    if (config.type === 'upright') element._generateSiblingWireframe(this.config.room.dimensions.width, this.config.room.dimensions.height)

    this.objectToPlace = element
    if(!this.objectToPlace.object) return

    // Posizione iniziale dell'elemento in fase di inserimento
    let initialZ = this.config.product.inRoomPosition === 'standalone' ? STANDALONE_Z : 1
    this.objectToPlace.object.position.set(this.config.room.dimensions.width / 2, this.config.room.dimensions.height / 2, initialZ)

    this.doHook('selectElement', this.objectToPlace)

    // Aggiunge l'elemento alla scena
    this.scene.add(this.objectToPlace.object)
  }

  updateConfig () {
    const wallColor = this.room.config.wallColor
    const floorType = this.room.config.floorType

    // console.log('updateConfig:', this.product)

    const obstacles = this.room.obstacles
      .map(obstacle => ({
        type: 'obstacle',
        id: obstacle.id,
        position: { x: obstacle.object.position.x, y: obstacle.object.position.y, z: obstacle.object.position.z },
        scale: { x: obstacle.object.scale.x, y: obstacle.object.scale.y, z: obstacle.object.scale.z },
      }))

    const uprights = this.product.uprights
      .map(upright => ({
        type: 'upright',
        id: upright.id,
        material: upright.config.material,
        variantId: upright.variantId,
        position: { x: upright.object.position.x, y: upright.object.position.y, z: upright.object.position.z },
        scale: { x: upright.object.scale.x, y: upright.object.scale.y, z: upright.object.scale.z },
      }))

    const shelves = this.product.shelves
      .map(shelf => ({
        type: 'shelf',
        id: shelf.id,
        material: shelf.config.material,
        nature: shelf.config.nature,
        variantId: shelf.variantId,
        position: { x: shelf.object.position.x, y: shelf.object.position.y, z: shelf.object.position.z },
        scale: { x: shelf.object.scale.x, y: shelf.object.scale.y, z: shelf.object.scale.z },
        index: shelf.index,
        realIndex: shelf.realIndex
      }))
    
    const cases = this.product.cases
      .map(item => ({
        type: 'case',
        id: item.id,
        material: item.config.material,
        nature: item.config.nature,
        variantId: item.variantId,
        position: { x: item.object.position.x, y: item.object.position.y, z: item.object.position.z },
        scale: { x: item.object.scale.x, y: item.object.scale.y, z: item.object.scale.z },
        index: item.index,
        realIndex: item.realIndex
      }))

    this.config.room.wallColor = wallColor
    this.config.room.floorType = floorType
      
    this.config.room.obstacles = obstacles
    this.config.product.uprights = uprights
    this.config.product.shelves = shelves
    this.config.product.cases = cases

    // Impostazione della storia della configurazione
    // Se si stanno compiendo modifiche e si è all'inizio della storia (prima modifica),
    // verranno rimossi tutti gli step ad eccezione di quello corrente e quello che si sta per creare.
    // console.log(this.config)
    if (this._historyPosition !== 0) {
      this._history = [JSON.parse(JSON.stringify(this.config)), this._history[this._historyPosition]]
      this._historyPosition = 0

      this.doHook('checkUndoRedo', {
        canUndo: this._history.length && this._historyPosition < this._history.length - 1,
        canRedo: this._historyPosition > 0
      })
      return
    }

    // La storia mantiene al massimo 50 step di configurazioni in memoria
    // Se si supera il limite massimo di step possibili, verrà eliminato il più vecchio
    if (this._history.length > 50) {
      this._history.pop()
    }

    // Aggiunta della corrente configurazione alla storia
    //console.log('inserimento nella storia di:', this.config)
    this._history.unshift(JSON.parse(JSON.stringify(this.config)))

    // console.log('duplicated step:', JSON.stringify(this._history[this._historyPosition]) === JSON.stringify(this._history[this._historyPosition + 1]))
    if(JSON.stringify(this._history[this._historyPosition]) === JSON.stringify(this._history[this._historyPosition + 1])) {
      this._history.shift()
    }

    // Salvataggio della storia nello store
    this.doHook('checkUndoRedo', {
      canUndo: this._history.length && (this._historyPosition < this._history.length - 1),
      canRedo: this._historyPosition > 0
    })
  }

  // Metodo che mi ritorna un'istanza del configuratore a partire da una mesh (utile per esempio nel raycaster che torna solo mesh)
  _getInstanceFromMesh (mesh) {
    return [...this.room.obstacles, ...this.product.uprights, ...this.product.shelves, ...this.product.cases]
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

  undo () {
    // console.log('UNDO')
    // console.log('current history step:', this._history[this._historyPosition])
    // console.log('going to history step:', this._history[this._historyPosition + 1])
    // Eliminazione della scena
    this.product.reset()
    this.room.reset()

    // Render della configurazione precedente nella scena
    // 0 è lo stato corrente, 1 è quello precedente
    this._feed(this._history[this._historyPosition + 1])
    this._historyPosition++

    // Salvataggio della storia nello store
    this.doHook('checkUndoRedo', {
      canUndo: this._history.length && this._historyPosition < this._history.length - 1,
      canRedo: this._historyPosition > 0
    })
  }

  redo () {
    // console.log('REDO')
    // console.log('current history step:', this._history[this._historyPosition])
    // console.log('going to history step:', this._history[this._historyPosition - 1])
    // Eliminazione della scena
    this.product.reset()
    this.room.reset()

    // Render della configurazione precedente nella scena
    // 0 è lo stato corrente, -1 è quello successivo
    this._feed(this._history[this._historyPosition - 1])
    this._historyPosition--

    // Salvataggio della storia nello store
    this.doHook('checkUndoRedo', {
      canUndo: this._history.length && this._historyPosition < this._history.length - 1,
      canRedo: this._historyPosition > 0
    })
  }

  doHook (hook, params) {
    if (typeof this.hooks[hook] !== 'function') return
    return this.hooks[hook](params)
  }

  togglePan () {
    this._isPanning = !this._isPanning
    this.controls.mouseButtons.LEFT = this._isPanning ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE
    this.controls.touches.ONE = this._isPanning ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE
  }

  toggleProductSelection () {
    this.selectedElement = !this._isProductSelected
      ? this.product
      : null

    this.outlinePass.select.selectedObjects = !this._isProductSelected
      ? [this.product.object]
      : []

    this._isProductSelected = !this._isProductSelected
  }

  zoomOnTarget (newPosition = { x: this.config.room.dimensions.width / 2, y: this.config.room.dimensions.height / 2, z: 400 }, duration = 1.5) {
    const controlsZ = this.controls.target.z

    gsap.to(
      [this.camera.position, this.controls.target],
      {
        ...newPosition,
        ease: 'power4.out',
        duration,
        onUpdate: () => {
          this.controls.target.z = controlsZ
          this.controls.update()
        }
      }
    )
  }

  toggleHuman () {
    this.human.visible = !this.human.visible
  }
}
