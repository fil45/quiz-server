const Joi = require('joi');
const { SUBJECTS_AMOUNT } = require('../constants');

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
      .max(SUBJECTS_AMOUNT),
    start: Joi.number()
      .integer()
      .min(1),
  },
};
