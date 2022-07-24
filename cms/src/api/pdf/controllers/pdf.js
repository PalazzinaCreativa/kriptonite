'use strict'

const pdf = require('html-pdf')
const _ = require('lodash')
const fs = require('fs-extra')


const createPDF = (html, options) => new Promise(((resolve, reject) => {
  pdf.create(html, options).toBuffer((err, buffer) => {
      if (err !== null) {reject(err)}
      else {resolve(buffer)}
  })
}))

const template = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;700&display=swap" rel="stylesheet">
    <style>
      .title {
        text-align: center;
      }
      .centered {
        text-align: center;
      }
      .table-centered {
        margin-left: auto;
        margin-right: auto;
      }
      .f-sm {
        font-size: 10px;
      }.
      .main-image {
        height: 380px;
      }
      strong {
        font-weight: 700;
      }
      .separator {
        background-color: rgb(199, 199, 199);
        color: #000;
        text-transform: uppercase;
        font-weight: bold;
        padding: 5px 10px;
        font-size: 10px;
        margin: 0;
        margin-top: 5px;
      }
    </style>
    </head>
  <body>
    <div>
      <h1 class="title">KRIPTONITE</h1>
    </div>
    <div class="centered main-image">
      <img src="<%=image%>" height="380" width="auto">
    </div>
    <table class="table-centered" border="1" width="100%">
      <tbody>
        <tr>
          <td width="33%">
            <h2 class="centered">Sistema K1</h2>
          </td>
          <td class="f-sm centered" width="33%">
            <strong>Dove vuoi inserire il prodotto?</strong><br>
            A parete
          </td>
          <td class="f-sm centered" width="33%">
            <strong>Di che tipo è la tua parete?</strong><br>
            Nicchia
          </td>
        </tr>
        <tr>
          <td width="33%">
            <strong>Nome progetto:</strong> Salotto 02 <br>
            <strong>Codice:</strong> 0123546
          </td>
          <td class="f-sm centered" width="33%">
            <strong>Di che materiale è la tua parete?</strong>
            Altro
          </td>
          <td class="f-sm centered" width="33%">
            <strong>Dimensioni parete:</strong><br>
            570x280 cm
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-centered" border="1" width="100%">
      <tbody>
        <tr>
          <td width="33%">
            <strong>Dimensioni totali:</strong> <br>
            248x322cm
          </td>
          <td class="f-sm centered" width="33%">
            <strong>Prezzo provisorio?</strong>
            &euro; 1870,00
          </td>
          <td class="f-sm centered" width="33%">
            lorem ipsu dolor sit amet
          </td>
        </tr>
      </tbody>
    </table>
    <div class="separator">
      Componenti utilizzati
    </div>
    <table>
      <tbody>
        <% for (const row of products) { %>
        <tr>
          <% for (const cell of row) { %>
          <td>
            <div>
              <p><%= cell.name %> <% if (cell.count > 1) { %> x<%= cell.count %> <% } %></p>
              <p>Profondità: <%= cell.depth %></p>
              <p>Colore: <%= cell.depth %></p>
              <p>Codice: <%= cell.sku %></p>
            </div>
          </td>
          <% } %>
        </tr>
        <% } %>
      </tbody>
    </table>
  </body>
</html>`

const compiled = _.template(template)

module.exports = {
  generatePDF: async (ctx, next) => {
    const { image = null } = ctx.request.body

    const configuration = await strapi.entityService.findMany('api::configuration.configuration', {
      filter:  {
          code: '126c4663-5945-49b5-bd62-ecef2ad42feb'
      },
      limit: 1
    })

    const { infos } = configuration[0].infos
    return infos
    let uprights = await strapi.entityService.findMany('api::upright.upright', {
      filters: {
        id: {
          $in: infos.product.uprights.map(i => i.id)
        }
      },
      populate: '*'
    })

    uprights = _.keyBy(uprights, 'id')
    let selectedUprights = infos.product.uprights.map(s => uprights[s.id].variants.find(v => v.id == s.variantId))

    const woodShelvesIds = infos.product.shelves.filter(i => i.material.nature == 'legno')
    const metalShelvesIds = infos.product.shelves.filter(i => i.material.nature == 'metallo')
    const woodCasesIds = infos.product.cases.filter(i => i.material.nature == 'legno')
    const metalCasesIds = infos.product.cases.filter(i => i.material.nature == 'metallo')

    // metal shelves
    let shelves = await strapi.entityService.findMany('api::shelf.shelf', { filters: { id: { $in: metalShelvesIds.map(i => i.id) } }, populate: '*'})
    shelves = _.keyBy(shelves, 'id')
    let selectedShelves = metalShelvesIds.map(s => shelves[s.id].variants.find(v => v.id == s.variantId))

    // wood shelves
    let woodShelves = await strapi.entityService.findMany('api::wood-shelf.wood-shelf', { filters: { id: { $in: woodShelvesIds.map(i => i.id) } }, populate: '*'})
    woodShelves = _.keyBy(woodShelves, 'id')
    let selectedWoodShelves = woodShelvesIds.map(s => woodShelves[s.id].variants.find(v => v.id == s.variantId))

    // metal cases
    let cases = await strapi.entityService.findMany('api::case.case', { filters: { id: { $in: metalCasesIds.map(i => i.id) } }, populate: '*'})
    cases = _.keyBy(cases, 'id')
    let selectedCases = metalCasesIds.map(s => cases[s.id].variants.find(v => v.id == s.variantId))

    // wood cases
    let woodCases = await strapi.entityService.findMany('api::wood-case.wood-case', { filters: { id: { $in: woodCasesIds.map(i => i.id) } }, populate: '*'})
    woodCases = _.keyBy(woodCases, 'id')
    let selectedWoodCases = woodCasesIds.map(s => woodCases[s.id].variants.find(v => v.id == s.variantId))

    let selected = []
    selected = [...selected, ...selectedUprights, ...selectedShelves, ...selectedWoodShelves, ...selectedCases, ...selectedWoodCases]
    selected = _.groupBy(selected, 'sku')
    selected = Object.keys(selected).map(key => {
      const p = selected[key][0]
      p.count = selected[key].length
      return p
    })

    const content = compiled({ image, products: _.chunk(selected, 3) })

    const p = await createPDF(content, {
          format: 'A4',
          httpHeaders: { 'content-type': 'application/pdf' },
          quality: '80',
          orientation: 'portrait',
          type: 'pdf',
          timeout: '100000',
          localUrlAccess: true,
          border: '25px'
        })
    // await fs.writeFile(path.join(__dirname, '..', 'public', 'generated', '['+locale+']_' + prod.name + '.pdf'), p)
    ctx.res.end(p)
    // return createPDF('<h1>Test</h1>', { stream : ctx.res })
    // ctx.res.on('finish')
    // return pdf.create('<h1>Test</h1>').toStream(function(err, stream){
    //   stream.pipe(ctx.res)

    //   // return new Promise(resolve => { 
    //   //   // ctx.res.writeHead(200, { 'Content-Type': 'application/pdf' })
    //   //   ctx.res.on('finish', resolve)
    //   // })
    // })
  }
}