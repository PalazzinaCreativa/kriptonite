
import qs from 'qs'


class Client {
  
  constructor (config) {
    this.config = config
  }

  _buildRequest (info) {
    const url = this.config.baseURL + '/' + info.url

    const conf = {
      method: info.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: info.body })
    }

    if (info.method === 'GET') {
      delete conf.body
    }

    return new Request(url, conf)
  }

  /**
   * Initialize configuration
   * @returns configuration information
   */
  async initConfiguration () {
    const req = this._buildRequest({
      url: 'api/configurations',
      method: 'POST',
      body : { infos: { a: 1 } }
    })
    
    const res = await fetch(req)
    const data = await res.json()
    return data
  }

  /**
   * List products
   * @returns array of products informations
   */
  async getProducts () {
    const query = qs.stringify({
      populate: '*', 
    }, {
      encodeValuesOnly: true
    })

    const req = this._buildRequest({
      url: `api/products?${query}`,
      method: 'GET'
    })
    
    const res = await fetch(req)
    const data = await res.json()
    return data
  }

  /**
   * List encumbrances
   * @returns array of encumrances informations
   */
  async getEncumbrances () {
    const query = qs.stringify({
      populate: '*', 
    }, {
      encodeValuesOnly: true,
    })

    const req = this._buildRequest({
      url: `api/encumbrances?${query}`,
      method: 'GET'
    })
    
    const res = await fetch(req)
    const data = await res.json()
    return data
  }

  /**
   * Get available uprights for product, given the product id
   * @param {int} product_id 
   * @returns 
   */
  async getUprightsByProduct (product_id) {
    const query = qs.stringify({
      filters: {
        prodotti: {
          id: product_id
        }
      },
      populate: [
        'variants',
        'variants.model',
      ],
    }, {
      encodeValuesOnly: true,
    })

    const req = this._buildRequest({
      url: `api/uprights?${query}`,
      method: 'GET'
    })
    
    const res = await fetch(req)
    const { data } = await res.json()
    for (const entry of data) {
      entry.variants = entry.variants.map(variant => {
        if (variant.model) {
          variant.model = variant.model.url
        }
        return variant
      })
    }
    return data
  }

  /**
   * Get available shelves infprmation given the product id
   * @param {int} product_id 
   * @returns 
   */
  async getShelvesByProduct (product_id) {
    const query = qs.stringify({
      filters: {
        product: {
          id: product_id
        }
      },
      populate: [
        'image',
        'colors',
        'variants',
        'variants.model',
      ],
    }, {
      encodeValuesOnly: true,
    })

    const req = this._buildRequest({
      url: `api/shelves?${query}`,
      method: 'GET'
    })
    
    const res = await fetch(req)
    const { data } = await res.json()
    for (const entry of data) {
      entry.colors = entry.colors.map(e => e.id)
      entry.variants = entry.variants.map(variant => {
        if (variant.model) {
          variant.model = variant.model.url
        }
        return variant
      })
    }
    return data
  }

/**
   * Get available shelves infprmation given the product id
   * @param {int} product_id 
   * @returns 
   */
 async getWoodShelvesByProduct (product_id) {
  const query = qs.stringify({
    filters: {
      product: {
        id: product_id
      }
    },
    populate: [
      'image',
      'variants',
      'variants.model',
      'variants.texture'
    ],
  }, {
    encodeValuesOnly: true,
  })

  const req = this._buildRequest({
    url: `api/wood-shelves?${query}`,
    method: 'GET'
  })
  
  const res = await fetch(req)
  const { data } = await res.json()
  for (const entry of data) {
    entry.variants = entry.variants.map(variant => {
      if (variant.model) {
        variant.model = variant.model.url
      }
      if (variant.texture) {
        variant.texture = variant.texture.id
      }
      return variant
    })
  }
  return data
}

  /**
   * Get textures
   * @returns 
   */
  async getTextures() {
    const query = qs.stringify({
      populate: '*', 
    }, {
      encodeValuesOnly: true
    })

    const req = this._buildRequest({
      url: `api/textures?${query}`,
      method: 'GET'
    })
    
    const res = await fetch(req)
    const { data } = await res.json()
    for (const entry of data) {
      if (entry.image) {
        entry.thumb = entry.image.formats.thumbnail.url
        entry.image = entry.image.url
      } else {
        entry.thumb = null
      }
    }
    return data
  }

  async getColors() {
    const query = qs.stringify({
      fields: ['id', 'name', 'finish', 'code']
    }, {
      encodeValuesOnly: true
    })

    const req = this._buildRequest({
      url: `api/colors?${query}`,
      method: 'GET'
    })
    
    const res = await fetch(req)
    const { data } = await res.json()
    return data 
  }

}

window.Client = Client
export default Client