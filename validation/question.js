var Joi = require('joi');

module.exports = {
  body: {
    question: Joi.string().required(),
    subjectId: Joi.number().required(),
    level: Joi.number().required(),
    answers: Joi.array()
      .length(4)
      .required()
      .items({
        answer: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      }),
  },
};
