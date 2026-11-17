const Joi = require('joi');

module.exports = Joi.object({
  addressLine1: Joi.string().trim().min(3).max(160).required(),
  addressLine2: Joi.string().trim().max(160).allow(''),
  city: Joi.string().trim().max(80).allow(''),
  state: Joi.string().trim().max(80).allow(''),
  country: Joi.string().trim().max(80).required(),
  postalCode: Joi.string().trim().max(24).allow(''),
  isDefault: Joi.boolean(),
  type: Joi.string().valid('shipping', 'billing').default('shipping'),
});
