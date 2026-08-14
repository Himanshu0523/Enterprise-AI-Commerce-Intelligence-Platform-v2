const Joi = require('joi');

module.exports = Joi.object({
  displayName: Joi.string().min(2).max(50),
  avatarUrl: Joi.string().uri(),
  preferences: Joi.object({
    language: Joi.string().length(2),
    currency: Joi.string().length(3),
    notifications: Joi.boolean()
  })
});