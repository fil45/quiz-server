const Joi = require('joi');

module.exports = {
  body: {
    id: Joi.any().forbidden(),
    password: Joi.string().required(),
    question: Joi.string().required(),
    subjectId: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(3),
    level: Joi.number()
      .integer()
      .required()
      .min(1)
      .max(3),
    answers: Joi.array()
      .length(4)
      .required()
      .items({
        id: Joi.any().forbidden(),
        answer: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
        questionId: Joi.any().forbidden(),
      })
      .unique((a, b) => a.answer === b.answer) //validation that there are no identical answers
      .unique((a, b) => a.isCorrect && b.isCorrect), //validation that only one answer is correct
  },
};
