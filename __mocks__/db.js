var SequelizeMock = require('sequelize-mock');
var dbMock = new SequelizeMock();
const question = require('./question.js');

const Questions = dbMock.define('questions', {}, { timestamps: false });
const Answers = dbMock.define('answers', {}, { timestamps: false });

Questions.$queryInterface.$useHandler(function(query, queryOptions) {
  if (query === 'findOne') {
    if (queryOptions[0].where.id === '99') {
      if (queryOptions[0].include) {
        return Questions.build(question);
      }
      const questionWoAnswers = _.cloneDeep(question);
      delete questionWoAnswers.answers;
      return Questions.build(questionWoAnswers);
    } else {
      return null;
    }
  }
});

Questions.hasMany(Answers);
Answers.belongsTo(Questions, {
  foreignKey: 'questionId',
});

//Questions.$queueFailure(new Error('My test error'));

module.exports.db = dbMock;
module.exports.Questions = Questions;
module.exports.Answers = Answers;
