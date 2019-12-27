const Joi = require('joi');
const SUBJECTS_AMOUNT = process.env.SUBJECTS_AMOUNT;

module.exports = {
  query: {
    quantity: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(50),
    level: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(3),
    subjectId: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(Number(SUBJECTS_AMOUNT)),
  },
};
