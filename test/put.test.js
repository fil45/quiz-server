const request = require('supertest');
const app = require('../app');
const _ = require('lodash');
const { Questions, Answers } = require('../db');
const { putQuestion: goodQuestion } = require('./mockObjects');

let question;

const test = async (question, code) => {
  await request(app)
    .put('/api/v1/questions')
    .send(question)
    .expect(code);
};

beforeEach(() => {
  Questions.$queryInterface.$clearQueue();
  Questions.$queryInterface.$clearResults();
  Questions.$queryInterface.$clearHandlers();
  question = _.cloneDeep(goodQuestion);
});

describe('PUTing a question...', function() {
  it('should return 401 with wrong password', async function() {
    question.password = 'wrong';
    await test(question, 401);
  });

  it('should return 404 in case of putting non-existent question', async function() {
    Questions.$queryInterface.$useHandler(function() {
      return null;
    });

    await request(app)
      .put('/api/v1/questions')
      .send(question)
      .expect(404);
  });

  it('should return 200 if passed an approptiate question object', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      const question = _.cloneDeep(goodQuestion);
      const answers = question.answers.map(answer => Answers.build(answer));
      question.answers = answers;
      const q = Questions.build(question);
      q.update = () =>
        new Promise(function(resolve, reject) {
          resolve(q);
        });
      return q;
    });

    await request(app)
      .put('/api/v1/questions')
      .send(question)
      .expect(200);
  });

  it('should return 500 if there is error occured while updating answers', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      const question = _.cloneDeep(goodQuestion);
      const answers = question.answers.map(answer => Answers.build(answer));
      question.answers = answers;
      const q = Questions.build(question);
      q.update = () =>
        new Promise(function(resolve, reject) {
          resolve(null);
        });
      return q;
    });

    await request(app)
      .put('/api/v1/questions')
      .send(question)
      .expect(500);
  });

  it('should return 422 if at least one of the answers ids is incorrect', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      const question = _.cloneDeep(goodQuestion);
      question.answers[0].id = 999;
      const answers = question.answers.map(answer => Answers.build(answer));
      question.answers = answers;
      const q = Questions.build(question);
      q.update = () =>
        new Promise(function(resolve, reject) {
          resolve(q);
        });
      return q;
    });

    await request(app)
      .put('/api/v1/questions')
      .send(question)
      .expect(422);
  });

  it('should return 500 in case of db error', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      const question = _.cloneDeep(goodQuestion);
      const answers = question.answers.map(answer => {
        const a = Answers.build(answer);
        a.update = () => {
          throw new Error('Error');
        };
        return a;
      });
      question.answers = answers;
      const q = Questions.build(question);
      q.update = () =>
        new Promise(function(resolve, reject) {
          resolve(q);
        });
      return q;
    });

    await request(app)
      .put('/api/v1/questions')
      .send(question)
      .expect(500);
  });
});
