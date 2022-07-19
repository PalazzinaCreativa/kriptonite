'use strict';

/**
 *  router.
 */

const { validateAll } = require('indicative/validator')

const rules = {
  name: 'required|alpha',
  surname: 'required|alpha',
  email: 'required|email',
  town: 'required|alpha',
  message: 'required',
  privacy: 'required'
}

const messages = {
  required: 'Questo campo è obbligatorio',
  alpha: 'Sono permesse solo lettere',
  email: 'Inserire una mail valida'
}

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contacts.contact', {
  config: {
    create: {
      middlewares: [
        async (ctx, next) => {
          const body = ctx.request.body
          try {
            await validateAll(JSON.parse(body.data), rules, messages)
          } catch (errors) {
            return ctx.send({ errors }, 400)
          }
          return next()
        }
      ]
    }
  }
});
