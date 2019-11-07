const Sequelize = require('sequelize');
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = require('./constants');

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Questions = db.define(
  'questions',
  {
    question: { type: Sequelize.TEXT, allowNull: false },
    subjectId: { type: Sequelize.INTEGER, allowNull: false },
    level: { type: Sequelize.INTEGER, allowNull: false },
  },
  { timestamps: false }
);

const Answers = db.define(
  'answers',
  {
    answer: { type: Sequelize.TEXT, allowNull: false },
    isCorrect: { type: Sequelize.BOOLEAN, allowNull: false },
  },
  { timestamps: false }
);

Questions.hasMany(Answers);
Answers.belongsTo(Questions, {
  foreignKey: 'questionId',
});

module.exports.db = db;
module.exports.Questions = Questions;
module.exports.Answers = Answers;
