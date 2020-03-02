const Joi = require('joi');

module.exports = {
  body: {
    id: Joi.number()
      .integer()
      .required(),
    password: Joi.string().required(),
    question: Joi.string(),
    subjectId: Joi.number()
      .integer()
      .min(1)
      .max(3),
    level: Joi.number()
      .integer()
      .min(1)
      .max(3),
    answers: Joi.array().items({
      id: Joi.number()
        .integer()
        .required(),
      answer: Joi.string(),
      isCorrect: Joi.boolean(),
      questionId: Joi.any().forbidden(),
    }),
  },
};
