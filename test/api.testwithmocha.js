const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { Questions, Answers } = require('../db');
const dummy = require('./dummy_objects');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);
const expect = chai.expect;

async function addQuestionToDB(question) {
  const result = await Questions.create(question, {
    include: [Answers],
  });
  return result.dataValues.id;
}

async function clearDB() {
  await Questions.destroy({
    where: {},
  });
  await Answers.destroy({
    where: {},
  });
}

describe('DB', function() {
  let id;
  before(async function() {
    await clearDB();
    id = await addQuestionToDB(dummy[0]);
  });

  it('should write/read a question with answers to/from DB', async function() {
    const { dataValues: question } = await Questions.findOne({
      where: { id },
      include: [Answers],
    });
    expect(question.id).to.be.equal(id);
    expect(question.question).to.be.equal(dummy[0].question);
    const answers = question.answers.map(item => item.dataValues);
    expect(answers.length).to.be.equal(4);
    answers.forEach(answer => {
      expect(answer).to.have.own.property('answer');
      expect(answer).to.have.own.property('isCorrect');
      expect(answer).to.have.own.property('id');
      expect(answer.questionId).to.be.equal(id);
    });
  });
});

describe('API', function() {
  describe('Getting questions without parameters', function() {
    before(async function() {
      await clearDB();
      dummy.forEach(async (question, index) => {
        if (index === 5) return;
        await addQuestionToDB(question);
      });
      id = await addQuestionToDB(dummy[5]);
    });

    it('should return 200', async function() {
      await request(app)
        .get('/api/v1/questions')
        .expect(200);
    });

    it('should return array of questions', async function() {
      const response = await request(app).get('/api/v1/questions');
      expect(response.body.questions).to.be.array();
      expect(response.body.questions.length).to.be.equal(10);
    });

    it('should return questions in correct format', async function() {
      const response = await request(app).get('/api/v1/questions');
      const question = response.body.questions.filter(
        question => question.id === id
      )[0];
      expect(question.question).to.be.equal(dummy[5].question);
      expect(question.subjectId).to.be.equal(dummy[5].subjectId);
      expect(question.level).to.be.equal(dummy[5].level);
      expect(question.id).to.be.equal(id);
      expect(question.answers).to.be.array();
      expect(question.answers.length).to.be.equal(4);
      question.answers.forEach(answer => {
        expect(answer).to.have.own.property('answer');
        expect(answer).to.have.own.property('isCorrect');
        expect(answer).to.have.own.property('id');
        expect(answer.questionId).to.be.equal(id);
      });
    });
  });

  describe('Getting a question with id', function() {
    let id;
    before(async function() {
      await clearDB();
      dummy.forEach(async (question, index) => {
        if (index === 3) return;
        await addQuestionToDB(question);
      });
      id = await addQuestionToDB(dummy[3]);
    });

    it('should return 200 with known id', async function() {
      await request(app)
        .get('/api/v1/questions/' + id)
        .expect(200);
    });

    it('should return 404 with unknown id', async function() {
      await request(app)
        .get('/api/v1/questions/' + '123abc')
        .expect(404);
    });

    it('should return correct question and answers', async function() {
      const response = await request(app).get('/api/v1/questions/' + id);
      const question = response.body;
      expect(question.question).to.be.equal(dummy[3].question);
      expect(question.subjectId).to.be.equal(dummy[3].subjectId);
      expect(question.level).to.be.equal(dummy[3].level);
      expect(question.id).to.be.equal(id);
      expect(question.answers.length).to.be.equal(4);
      question.answers.forEach(answer => {
        expect(answer).to.have.own.property('answer');
        expect(answer).to.have.own.property('isCorrect');
        expect(answer).to.have.own.property('id');
        expect(answer.questionId).to.be.equal(id);
      });
    });
  });
});
