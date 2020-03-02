const request = require('supertest');
const app = require('../app');
const _ = require('lodash');
const { Questions } = require('../db');
const { postQuestion: goodQuestion } = require('./mockObjects');

let question;

const test = async (question, code) => {
  await request(app)
    .post('/api/v1/questions')
    .send(question)
    .expect(code);
};

beforeEach(() => {
  Questions.$queryInterface.$clearQueue();
  Questions.$queryInterface.$clearResults();
  Questions.$queryInterface.$clearHandlers();
  question = _.cloneDeep(goodQuestion);
});

describe('POSTing a question...', function() {
  it('should return 200 if passed an approptiate question object', async function() {
    await test(goodQuestion, 200);
  });

  it('should return 401 with wrong password', async function() {
    question.password = 'wrong';
    await test(question, 401);
  });

  it('should return 422 without any password', async function() {
    delete question.password;
    await test(question, 422);
  });

  it('should return 422 without any question', async function() {
    delete question.question;
    await test(question, 422);
  });

  it('should return 422 without any subjectId', async function() {
    delete question.subjectId;
    await test(question, 422);
  });

  it('should return 422 without any level', async function() {
    delete question.level;
    await test(question, 422);
  });

  it('should return 422 without any answers', async function() {
    delete question.answers;
    await test(question, 422);
  });

  it('should return 422 if there are less then 4 answers', async function() {
    question.answers.length = 3;
    await test(question, 422);
  });

  it('should return 422 if there are more then 4 answers', async function() {
    question.answers.push({ answer: 'Some', isCorrect: false });
    await test(question, 422);
  });

  it('should return 422 if there are more then one correct answer', async function() {
    question.answers[0].isCorrect = true;
    question.answers[1].isCorrect = true;
    await test(question, 422);
  });

  it('should return 422 if there are same answers', async function() {
    question.answers[0].answer = question.answers[1].answer;
    await test(question, 422);
  });

  it('should return 500 in case of db error', async function() {
    Questions.$queryInterface.$queueFailure('Error in posting a question');
    await request(app)
      .post('/api/v1/questions')
      .send(question)
      .expect(500);
  });
});
