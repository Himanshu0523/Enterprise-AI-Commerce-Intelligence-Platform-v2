const Joi = require('joi');
module.exports = Joi.object({ role: Joi.string().valid('retail', 'business').required() });