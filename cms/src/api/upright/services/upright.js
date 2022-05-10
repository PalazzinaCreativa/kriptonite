'use strict';

/**
 * upright service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::upright.upright');
