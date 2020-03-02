const request = require('supertest');
const app = require('../app');
const _ = require('lodash');
const { Questions } = require('../db');
const { getQuestion: question } = require('./mockObjects');

beforeEach(() => {
  const q1 = (q2 = q3 = Questions.build(question));
  arrayOfQuestions = [q1, q2, q3];
  Questions.$queryInterface.$clearQueue();
  Questions.$queryInterface.$clearResults();
  Questions.$queryInterface.$clearHandlers();
});

describe('Starting a test...', function() {
  it('should return 500 in case of db error', async function() {
    Questions.$queryInterface.$queueFailure('Error while starting a test');
    await request(app)
      .get('/api/v1/start?level=1&subjectId=1&quantity=3')
      .expect(500);
  });

  it('should return code 200 and array of questions', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      return arrayOfQuestions;
    });
    await request(app)
      .get('/api/v1/start?level=1&subjectId=1&quantity=3')
      .expect(200);
  });

  it('should return code 422 in case of parameters without level', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      return arrayOfQuestions;
    });
    await request(app)
      .get('/api/v1/start?subjectId=1&quantity=3')
      .expect(422);
  });

  it('should return code 422 in case of parameters without subjectId', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      return arrayOfQuestions;
    });
    await request(app)
      .get('/api/v1/start?level=1&quantity=3')
      .expect(422);
  });

  it('should return code 422 in case of parameters without quantity', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      return arrayOfQuestions;
    });
    await request(app)
      .get('/api/v1/start?level=1&subjectId=1')
      .expect(422);
  });

  it('should return code 422 in case of wrong level', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      return arrayOfQuestions;
    });
    await request(app)
      .get('/api/v1/start?level=5&subjectId=1&quantity=3')
      .expect(422);
  });

  it('should return code 422 in case of wrong subjectId', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      return arrayOfQuestions;
    });
    await request(app)
      .get('/api/v1/start?level=1&subjectId=5&quantity=3')
      .expect(422);
  });

  it('should return code 422 in case of wrong quantity', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      return arrayOfQuestions;
    });
    await request(app)
      .get('/api/v1/start?level=1&subjectId=1&quantity=800')
      .expect(422);
  });
});
