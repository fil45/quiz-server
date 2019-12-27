var SequelizeMock = require('sequelize-mock');
var dbMock = new SequelizeMock();

const Questions = dbMock.define(
  'questions',
  [
    {
      id: 1,
      question: '12345',
      subjectId: 1,
      level: 1,
    },
    {
      id: 2,
      question: '456789',
      subjectId: 2,
      level: 2,
    },
  ],
  { timestamps: false }
);

const Answers = dbMock.define(
  'answers',
  [
    {
      id: 1,
      answer: '1234',
      isCorrect: 1,
      questionId: 1,
    },
    {
      id: 2,
      answer: '1234',
      isCorrect: 0,
      questionId: 1,
    },
    {
      id: 3,
      answer: '1234',
      isCorrect: 0,
      questionId: 1,
    },
    {
      id: 4,
      answer: '1234',
      isCorrect: 0,
      questionId: 1,
    },
  ],
  { timestamps: false }
);

module.exports.db = dbMock;
module.exports.Questions = Questions;
module.exports.Answers = Answers;
