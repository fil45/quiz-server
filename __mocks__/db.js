var SequelizeMock = require('sequelize-mock');
var dbMock = new SequelizeMock();

const Questions = dbMock.define('questions', {}, { timestamps: false });
const Answers = dbMock.define('answers', {}, { timestamps: false });

Questions.hasMany(Answers);
Answers.belongsTo(Questions, {
  foreignKey: 'questionId',
});

module.exports.db = dbMock;
module.exports.Questions = Questions;
module.exports.Answers = Answers;
