const request = require('supertest');
const app = require('../app');
const _ = require('lodash');
const { Questions } = require('../db');
const { testQuestions: questions } = require('./mockObjects');

const questionsToAnswer = [
  {
    id: 1,
    answerId: 1,
  },
  {
    id: 2,
    answerId: 2,
  },
  {
    id: 3,
    answerId: 3,
  },
];

const getTestId = async function() {
  const responce = await request(app).get(
    '/api/v1/start?level=1&subjectId=1&quantity=3'
  );

  return responce.body.testId;
};

beforeEach(() => {
  arrayOfQuestions = questions.map(q => Questions.build(q));
  Questions.$queryInterface.$clearQueue();
  Questions.$queryInterface.$clearResults();
  Questions.$queryInterface.$clearHandlers();
  Questions.$queryInterface.$useHandler(function(query, queryOptions) {
    return arrayOfQuestions;
  });
});

describe('Ending a test...', function() {
  it('should return 200 if passed appropriate answers', async function() {
    const testId = await getTestId();

    await request(app)
      .post('/api/v1/end')
      .send({
        testId,
        questions: questionsToAnswer,
      })
      .expect(200);
  });

  it('should return 404 if passed wrong testId', async function() {
    const testId = await getTestId();

    await request(app)
      .post('/api/v1/end')
      .send({
        testId: testId + 1,
        questions: questionsToAnswer,
      })
      .expect(404);
  });

  it('should return 422 if quantity of answers is incorrect', async function() {
    const testId = await getTestId();

    const questionsToAnswerCopy = _.cloneDeep(questionsToAnswer);
    questionsToAnswerCopy.push({
      id: 4,
      answerId: 4,
    });
    await request(app)
      .post('/api/v1/end')
      .send({
        testId: testId,
        questions: questionsToAnswerCopy,
      })
      .expect(422);
  });

  it('should return 422 if questions ids are not unique', async function() {
    const testId = await getTestId();
    const questionsToAnswerCopy = _.cloneDeep(questionsToAnswer);
    questionsToAnswerCopy[0].id = 3;
    await request(app)
      .post('/api/v1/end')
      .send({
        testId: testId,
        questions: questionsToAnswerCopy,
      })
      .expect(422);
  });

  it('should return 422 if a question id not found', async function() {
    const testId = await getTestId();
    const questionsToAnswerCopy = _.cloneDeep(questionsToAnswer);
    questionsToAnswerCopy[0].id = 99;
    await request(app)
      .post('/api/v1/end')
      .send({
        testId: testId,
        questions: questionsToAnswerCopy,
      })
      .expect(422);
  });
});
