const request = require('supertest');
const app = require('../app');
const _ = require('lodash');
const { db, Questions, Answers } = require('../db');
const question = require('../__mocks__/question');

describe('GETing a question...', function() {
  it('should return code 200 and appropriate object when requesting existing id', async function() {
    await request(app)
      .get('/api/v1/questions/99')
      .expect(200, question);
  });

  it('should return 404 with not existing id', async function() {
    await request(app)
      .get('/api/v1/questions/1')
      .expect(404);
  });
  //TODO
  it('should return 200 and array of objects when requesting all the questions', async function() {
    await request(app)
      .get('/api/v1/questions')
      .expect(200, [question]);
  });
});
