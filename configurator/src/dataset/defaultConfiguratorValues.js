export const FLOOR_DEPTH = 600 // Profondità del pavimento

export const STANDALONE_Z = 200 // In che punto z posizionare gli elementi in mezzo alla stanza

export const NICHE_PADDING = 100 // Spazio esterno della nicchia

export const GUTTER = 20 //15 // Il prodotto non può essere posizionato a filo con la parete

export const RESTING_ON_THE_GROUND = ['sofa', 'table', 'door', 'upright_s_tele', 'upright_s'] // Funziona solamente per i set di dati mock. Da oggi utilizziamo il campo 'grounded' a DB

// Le distanze dalle pareti in base al tipo di prodotto selezionato
export const distancesFromWall = [
    { type: 'k1', inRoomPosition: 'wall', uprightsPosition: 'wall', elements: ['upright'], distance: 0.1 },
    { type: 'k2', inRoomPosition: 'wall', uprightsPosition: 'standalone', elements: ['upright', 'shelf', 'case'], distance: 25 }
]