const request = require('supertest');
const app = require('../app');
const _ = require('lodash');
const { db, Questions, Answers } = require('../db');

const answers = {};
answers.dataValues = [
  {
    id: 393,
    answer: 'Given',
    isCorrect: false,
  },
  {
    id: 394,
    answer: 'Divide form',
    isCorrect: true,
  },
  {
    id: 395,
    answer: 'Given',
    isCorrect: false,
  },
  {
    id: 396,
    answer: 'Were',
    isCorrect: false,
  },
];

const questionToReturn = {
  id: '99',
  question: 'Bla bla?',
  subjectId: 3,
  level: 3,
  answers,
};

Questions.$queryInterface.$useHandler(function(query, queryOptions, done) {
  if (query === 'findOne') {
    if (queryOptions[0].where.id == 99) {
      return Questions.build(questionToReturn);
    } else {
      return null;
    }
  }
});

const goodQuestion = {
  password: '123',
  question: 'How much is the fish?',
  id: '99',
  subjectId: '1',
  level: '1',
  answers: [
    { id: 393, answer: '42', isCorrect: true },
    { id: 394, answer: '15', isCorrect: false },
    { id: 395, answer: 'Many', isCorrect: false },
    { id: 396, answer: 'One', isCorrect: false },
  ],
};

const test = async (question, code) => {
  await request(app)
    .put('/api/v1/questions')
    .send(question)
    .expect(code);
};

let question;

beforeEach(() => {
  question = _.cloneDeep(goodQuestion);
});

describe('PUTing a question...', function() {
  //   it('should return 200 if passed an approptiate question object', async function() {
  //     await test(goodQuestion, 200);
  //   });

  it('should return 401 with wrong password', async function() {
    question.password = 'wrong';
    await test(question, 401);
  });
});
