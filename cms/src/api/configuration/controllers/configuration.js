'use strict';

const { v4: uuidv4 } = require('uuid')

/**
 *  configuration controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::configuration.configuration', ({ strapi }) =>  ({

  async create(ctx) {
    ctx.request.body.data.code = uuidv4()
    // some logic here
    const response = await super.create(ctx);
    // some more logic
    return response;
  },

  async update(ctx) {
    const { id } = ctx.params

    const conf = await strapi.entityService.findMany('api::configuration.configuration', {
      filters: {
        code: id
      }
    })
    console.log(conf)
    console.log(ctx.request.body)
    if (conf[0]) {
      const entity = await strapi.entityService.update('api::configuration.configuration', conf[0].id, {
        data: {
          infos: ctx.request.body.data
        }
      })
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx)
      return this.transformResponse(sanitizedEntity)
    }
    // some more logic
    
    return {}
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.findMany('api::configuration.configuration', {
      filters: {
        code: id
      }
    })
    if (entity[0]) {
      const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx)
      return this.transformResponse(sanitizedEntity)
    }

    return {}
  }

}));
