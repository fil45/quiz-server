var Joi = require('joi');

const SUBJECTS_AMOUNT = 3;

module.exports = {
  body: {
    password: Joi.string().required(),
    question: Joi.string().required(),
    subjectId: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(SUBJECTS_AMOUNT),
    level: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(3),
    answers: Joi.array()
      .length(4)
      .required()
      .items({
        answer: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      }),
  },
};
