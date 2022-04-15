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
import { setupPostProcessing } from './setup/setupPostprocessing'
import { detectCollision } from './utils/detectCollision'
import Object3D from './Object3D'
export default class Configurator {
  constructor (el, options, configuration) {
    this.el = el
    this.options = options
    this.objectsToIntersect = [] // Quando muovo un elemento all'interno della scena controllo se vengono intersecati questi oggetti
    this.configuration = { // TODO: Inizializzare la scena se il constructor ha l'oggetto configuration
      room: {},
      obstacles: [],
      product: {
        uprights: [],
        shelves: []
      }
    }

    this.insertMode = {
      on: false
    }

    this.normalizeDimensions()
    this.init()
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
    this.configuration.room = {
      type: this.options.type,
      wallColor: '#ffffff',
      dimensions: this.options.dimensions
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

    const postProcessing = setupPostProcessing(this.scene, this.camera, this.renderer)

    this.composer = postProcessing.composer
    this.outlinePass = postProcessing.outlinePass

    this.addToScene([
      this.floor,
      this.room,
      ...this.lights
    ])

    this.controls = setupOrbitControls(this.camera, this.renderer, dimensions)

    this.el.appendChild(this.renderer.domElement)

    // Listeners
    window.addEventListener('resize', this.handleWindowResize)

    this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight
    this.camera.updateProjectionMatrix()
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
  animate = () => {
    window.requestAnimationFrame(this.animate)
    this.controls.update()
    this.composer.render()
  }

  // Gestione window resize
  handleWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
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
    this.configuration.room.wallColor = color
  }

  async createObstacle ({ id, path, dimensions }) {
    const object = new Object3D(
      path,
      { name: id, id: name + '_' * this.configuration.obstacles.length, dimensions },
      (obj) => {
        let isMouseMoving = false // Variabile di controllo per distinguere click da drag
        // Aggiorno la variabile toInsert con l'oggetto selezionato
        const { depth } = object.getSize()
        object.setPosition(this.options.dimensions.width / 2, this.options.dimensions.height / 2, depth || 0.1) // Posizione iniziale dell'oggetto selezionato
        this.toInsert = object

        window.addEventListener('pointermove', e => {
          this.handlePointerMove(e)
          isMouseMoving = true
        })
        window.addEventListener('pointerdown', () => {
          isMouseMoving = false
        })

        window.addEventListener('pointerup', (e) => {
          if (isMouseMoving) return
          this.handleClickObjectPositioning(e, id)
        })

        window.addEventListener('keydown', e => this.handleEscapePress(e))
        this.scene.add(obj)
      }
    )
  }
  // Seleziona l'oggetto da inserire
  // async pickUp ({ id, path, dimensions }) {
  //   // Se non esiste lo importo dal path
  //   const object = await loadObject(path, id)
  //   object.name = 'toInsert'

  //   if (dimensions) {
  //     // Se sono specificate le dimensioni, prendo le dimensioni dell'oggetto per scalarlo nelle dimensioni che vogliamo dargli
  //     const { width, height, depth } = this.getObjectSize(object)
  //     object.scale.set(
  //       dimensions.width / width,
  //       dimensions.height / height,
  //       dimensions.depth / depth
  //     )
  //   }

  //   let isMouseMoving = false // Variabile di controllo per distinguere click da drag
  //   // Aggiorno la variabile toInsert con l'oggetto selezionato
  //   this.toInsert = object
  //   const { depth } = this.getObjectSize(this.toInsert)
  //   this.toInsert.position.set(this.options.dimensions.width / 2, this.options.dimensions.height / 2, depth || 0.1) // Posizione iniziale dell'oggetto selezionato
  //   window.addEventListener('pointermove', e => {
  //     this.handlePointerMove(e)
  //     isMouseMoving = true
  //   })
  //   window.addEventListener('pointerdown', () => {
  //     isMouseMoving = false
  //   })
  //   window.addEventListener('pointerup', (e) => {
  //     if (isMouseMoving) return
  //     this.handleClickObjectPositioning(e, id)
  //   })
  //   window.addEventListener('keydown', e => this.handleEscapePress(e))
  //   this.scene.add(object)
  // }

  handleEscapePress (e) {
    if (e.key !== 'Escape') return
    this.toInsert = null
    this.scene.remove(this.scene.getObjectByName('toInsert'))
  }

  // Muovo l'oggetto nella scena (solo nell'asse x o y)
  handlePointerMove (event) {
    // Controllo se ho qualche oggetto selezionato
    if (!this.toInsert) return
    this.pointer.set( // Aggiorno il pointer con le coordinate della posizione attuale del mouse
      (event.clientX / this.renderer.domElement.offsetWidth) * 2 - 1,
      -(event.clientY / this.renderer.domElement.offsetHeight) * 2 + 1
    )

    this.raycaster.setFromCamera(this.pointer, this.camera) // Aggiorna il raycaster con le coordinate del mouse per verificare le intersezioni

    const intersects = this.raycaster.intersectObjects(this.objectsToIntersect) // Controllo le intersezioni con gli altri elementi della scena
    const roomIntersection = intersects.find(m => m.object.name === 'room') // Controllo che il mouse sia dentro la stanza
    if (!roomIntersection) return

    const { width, height, depth } = this.toInsert.getSize()

    const position = ['x', 'y'] // Calcolo il punto in cui posso posizionare l'elemento sugli assi x e y
      .map(ace => {
        const objectSize = ace === 'x' ? width : height
        const roomSize = ace === 'x' ? this.options.dimensions.width : this.options.dimensions.height
        return {
          point: roomIntersection.point[ace] - objectSize / 2 < GUTTER
            ? roomSize - GUTTER - objectSize / 2
            : roomIntersection.point[ace],
          ace
        }
      })
      .reduce((acc, curr) => ({ ...acc, [curr.ace]: curr.point }), {})

    if (Math.floor(position.y) % 6 === 0) console.log(position.y, 'ok')
    this.toInsert.setPosition(
      position.x,
      OBJECTS_ON_THE_GROUND.includes(this.toInsert.name) ? height / 2 : position.y, // Controllo se deve stare a contatto con il pavimento
      isNaN(depth) ? 0.1 : depth / 2
    ) // Assegno al mio oggetto selezionato la posizione del mouse corrente per poterlo muovere all'interno dello spazio

    this.checkPosition()
    this.createGuides()
  }

  handleClickObjectPositioning (event, type) {
    if (!this.toInsert || !this.canBePositioned) return
    this.objectsToIntersect.push(this.toInsert)
    if (!this.obstacles) {
      this.obstacles = new THREE.Group()
      this.scene.add(this.obstacles)
    }
    this.obstacles.add(this.toInsert.object)

    this.configuration.obstacles.push({
      type,
      position: {
        x: this.toInsert.getPosition().x,
        y: this.toInsert.getPosition().y,
        z: this.toInsert.getPosition().z
      },
      scale: {
        x: this.toInsert.getPosition().x,
        y: this.toInsert.getPosition().y,
        z: this.toInsert.getPosition().z
      }
    })

    this.scene.remove(this.scene.getObjectByName('guideline'))
    this.toInsert = null
    window.removeEventListener('pointermove', (e) => this.handlePointerMove(e))
  }

  // Metodo che controlla se l'elemento può essere posizionato nella posizione corrente
  checkPosition () {
    const intersects = this.raycaster.intersectObjects(this.objectsToIntersect) // Array di elementi (solo dell'array objectsToIntersect) intersecati dal puntatore
    if (intersects.length > 1) { // Se è presente più di un elemento (oltre alla stanza) non posso posizinoare l'elemento selezionato
      this.canBePositioned = false
      this.outlinePass.selectedObjects = [this.toInsert.object] // Aggiungo un bordo all'elemento da posizionare
      return false
    }

    this.outlinePass.selectedObjects = [] // Se può essere posizionato rimuovo un eventuale bordo
    this.canBePositioned = true
    return true
  }

  createGuides () {
    if (!this.obstacles || !this.obstacles.children.length || !this.toInsert) return
    this.scene.remove(this.scene.getObjectByName('guideline'))
    this.obstacles.children.forEach(obstacle => {
      // Calcolo la posizione negli assi
      const obstacleMinX = obstacle.position.x - this.getObjectSize(obstacle).width / 2
      const obstacleMaxX = obstacle.position.x + this.getObjectSize(obstacle).width / 2
      const obstacleMinY = obstacle.position.y - this.getObjectSize(obstacle).height / 2
      const obstacleMaxY = obstacle.position.y + this.getObjectSize(obstacle).height / 2
      const toInsertMinX = this.toInsert.position.x - this.getObjectSize(this.toInsert).width / 2
      const toInsertMaxX = this.toInsert.position.x + this.getObjectSize(this.toInsert).width / 2
      const toInsertMinY = this.toInsert.position.y - this.getObjectSize(this.toInsert).height / 2
      const toInsertMaxY = this.toInsert.position.y + this.getObjectSize(this.toInsert).height / 2

      let linePoints

      if (Math.floor(obstacleMinX) === Math.floor(toInsertMinX)) {
        linePoints = [
          new THREE.Vector3(
            obstacleMinX,
            obstacleMinY,
            20
          ),
          new THREE.Vector3(
            toInsertMinX,
            toInsertMaxY,
            20
          )
        ]
      }

      if (Math.floor(obstacleMaxX) === Math.floor(toInsertMaxX)) {
        linePoints = [
          new THREE.Vector3(
            obstacleMaxX,
            obstacleMinY,
            20
          ),
          new THREE.Vector3(
            toInsertMaxX,
            toInsertMaxY,
            20
          )
        ]
      }

      if (Math.floor(obstacleMinY) === Math.floor(toInsertMinY)) {
        linePoints = [
          new THREE.Vector3(
            obstacleMaxX,
            obstacleMinY,
            20
          ),
          new THREE.Vector3(
            toInsertMaxX,
            toInsertMinY,
            20
          )
        ]
      }

      if (Math.floor(obstacleMaxY) === Math.floor(toInsertMaxY)) {
        linePoints = [
          new THREE.Vector3(
            obstacleMaxX,
            obstacleMaxY,
            20
          ),
          new THREE.Vector3(
            toInsertMaxX,
            toInsertMaxY,
            20
          )
        ]
      }

      if (!linePoints) return
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffea, linewidth: 8 })

      const line = new THREE.Line(lineGeometry, lineMaterial)
      line.name = 'guideline'

      this.scene.add(line)
    })
  }

  async addElement ({ path, id, type, height }) {
    const object = await loadObject(path, id)
    const scale = height / this.getObjectSize(object).height

    object.scale.set(scale, scale, scale)

    this.insertMode = { // Inizio la modalità inserimento e aggiungo l'oggetto selezionato
      on: true,
      id,
      object
    }

    if (type === 'upright') this.createUprightWireframe()
  }

  createUprightWireframe () {
    if (!this.insertMode.on) return

    if (!this.configuration.product.uprights.length) {
      this.insertMode.object.position.x = this.options.dimensions.width / 6
      this.insertFirstUpright() // Se non esistono altri montanti inserisco il primo
    }
  }

  insertFirstUpright () {
    const { object } = this.insertMode

    // Controllo se il primo elemento non si sovrapponga ad altro nella scena
    const collision = detectCollision(object, this.obstacles ? this.obstacles.children : [])

    if (collision) {
      object.position.x = object.position.x + GUTTER
      this.insertFirstUpright()
      return
    }
    this.scene.add(object)
  }
}
