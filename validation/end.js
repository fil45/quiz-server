const Joi = require('joi');

module.exports = {
  body: {
    testId: Joi.number()
      .integer()
      .required(),
    questions: Joi.array()
      .required()
      .items({
        id: Joi.number()
          .integer()
          .required(),
        answerId: Joi.number()
          .integer()
          .required(),
      }),
  },
};
