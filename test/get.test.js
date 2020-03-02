const request = require('supertest');
const app = require('../app');
const _ = require('lodash');
const { Questions } = require('../db');
const { getQuestion: question } = require('./mockObjects');

let arrayOfQuestions;
const expectedArray = [{ id: 1000 }, { id: 1055 }, { id: 1058 }];

beforeEach(() => {
  const q1 = Questions.build({ id: 1000 });
  const q2 = Questions.build({ id: 1055 });
  const q3 = Questions.build({ id: 1058 });
  arrayOfQuestions = [q1, q2, q3];

  Questions.$queryInterface.$clearQueue();
  Questions.$queryInterface.$clearResults();
  Questions.$queryInterface.$clearHandlers();
});

describe('GETing a question...', function() {
  it('should return code 200 and appropriate object when requesting existing id', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      if (queryOptions[0].where.id === '99') return Questions.build(question);
      else return null;
    });
    await request(app)
      .get('/api/v1/questions/99')
      .expect(200, question);
  });

  it('should return code 404 when requesting non-existent id', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      if (queryOptions[0].where.id === '99') return Questions.build(question);
      else return null;
    });
    await request(app)
      .get('/api/v1/questions/97')
      .expect(404);
  });

  it('should return 500 in case of db error', async function() {
    Questions.$queryInterface.$queueFailure('Error in getting a question');
    await request(app)
      .get('/api/v1/questions/99')
      .expect(500);
  });
});

describe('GETing questions...', function() {
  it('should return 200 and array of objects when requesting all the questions', async function() {
    Questions.$queryInterface.$queueResult(arrayOfQuestions);
    await request(app)
      .get('/api/v1/questions')
      .expect(200, { questions: expectedArray });
  });

  it('should return 200 and appropriate questions when queriing level', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      if (queryOptions[0].where.level === 3) {
        return arrayOfQuestions;
      } else {
        return null;
      }
    });
    await request(app)
      .get('/api/v1/questions?level=3')
      .expect(200, {
        questions: expectedArray,
      });
  });

  it('should return 200 and appropriate questions when queriing subjectId', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      if (queryOptions[0].where.subjectId === 1) {
        return arrayOfQuestions;
      } else {
        return null;
      }
    });
    await request(app)
      .get('/api/v1/questions?subjectId=1')
      .expect(200, {
        questions: expectedArray,
      });
  });

  it('should return 200 and appropriate questions when queriing quantity', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      if (queryOptions[0].limit === 3) {
        return arrayOfQuestions;
      } else {
        return null;
      }
    });
    await request(app)
      .get('/api/v1/questions?quantity=3')
      .expect(200, {
        questions: expectedArray,
        nextPage: 'http://localhost:1234/api/v1/questions?quantity=3&start=3',
      });
  });

  it('should return 200 and appropriate questions when queriing start', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      if (queryOptions[0].offset === 5) {
        return arrayOfQuestions;
      } else {
        return null;
      }
    });
    await request(app)
      .get('/api/v1/questions?start=5')
      .expect(200, {
        questions: expectedArray,
      });
  });

  it('should return 200 and appropriate questions when queriing quantity, level, subjectId and start simultaneously', async function() {
    Questions.$queryInterface.$useHandler(function(query, queryOptions) {
      if (
        queryOptions[0].where.level === 1 &&
        queryOptions[0].where.subjectId === 2 &&
        queryOptions[0].offset === 10 &&
        queryOptions[0].limit === 5
      ) {
        return arrayOfQuestions;
      } else {
        return null;
      }
    });
    await request(app)
      .get('/api/v1/questions?quantity=5&level=1&subjectId=2&start=10')
      .expect(200, {
        questions: expectedArray,
        nextPage:
          'http://localhost:1234/api/v1/questions?quantity=5&start=15&level=1&subjectId=2',
      });
  });

  it('should return 500 in case of db error', async function() {
    Questions.$queryInterface.$queueFailure('Error in getting questions');
    await request(app)
      .get('/api/v1/questions')
      .expect(500);
  });
});
