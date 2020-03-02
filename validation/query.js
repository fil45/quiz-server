const Joi = require('joi');

module.exports = {
  query: {
    quantity: Joi.number()
      .integer()
      .min(1),
    level: Joi.number()
      .integer()
      .min(1)
      .max(3),
    subjectId: Joi.number()
      .integer()
      .min(1)
      .max(3),
    start: Joi.number()
      .integer()
      .min(0),
  },
};
