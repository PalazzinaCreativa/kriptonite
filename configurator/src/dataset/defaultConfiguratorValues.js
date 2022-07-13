export const FLOOR_DEPTH = 600 // Profondità del pavimento

export const STANDALONE_Z = 200 // In che punto z posizionare gli elementi in mezzo alla stanza

export const NICHE_PADDING = 100 // Spazio esterno della nicchia

export const GUTTER = 20 //15 // Il prodotto non può essere posizionato a filo con la parete

export const RESTING_ON_THE_GROUND = ['sofa', 'table', 'door'] // Funziona solamente per i set di dati mock. Da oggi utilizziamo il campo 'grounded' a DB

// Le distanze dalle pareti e la posizione degli attacchi di ripiani e contenitori in base al tipo di prodotto selezionato
// Attachpoint a 0 è il default e indica che gli attacchi sono posti al metà del montante (Default k1)
export const elementDistances = [
    { type: 'k1', inRoomPosition: 'wall', uprightsPosition: 'wall', elements: ['upright'], distance: 0.1, attachPoint: 0, offset: 0.01 },
    { type: 'k2', inRoomPosition: 'wall', uprightsPosition: 'standalone', elements: ['upright', 'shelf', 'case'], distance: 25, attachPoint: 3, offset: 0 },
    { type: 'k2', inRoomPosition: 'wall', uprightsPosition: 'wall', elements: ['shelf', 'case'], distance: 24, attachPoint: 3, offset: 0 },
]