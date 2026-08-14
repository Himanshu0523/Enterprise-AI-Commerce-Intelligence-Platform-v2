const Joi = require('joi');

module.exports = Joi.object({
  productId: Joi.string().required()
});