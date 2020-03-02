const _ = require('lodash');

const postAnswers = [
  { answer: '42', isCorrect: true },
  { answer: '15', isCorrect: false },
  { answer: 'Many', isCorrect: false },
  { answer: 'One', isCorrect: false },
];

const putAnswers = [
  {
    id: 393,
    answer: '42',
    isCorrect: true,
  },
  {
    id: 394,
    answer: '15',
    isCorrect: false,
  },
  {
    id: 395,
    answer: 'Many',
    isCorrect: false,
  },
  {
    id: 396,
    answer: 'One',
    isCorrect: false,
  },
];

const getAnswers = [
  {
    id: 393,
    answer: 'Given',
    isCorrect: false,
    questionId: 99,
  },
  {
    id: 394,
    answer: 'Divide form',
    isCorrect: true,
    questionId: 99,
  },
  {
    id: 395,
    answer: 'Given',
    isCorrect: false,
    questionId: 99,
  },
  {
    id: 396,
    answer: 'Were',
    isCorrect: false,
    questionId: 99,
  },
];

const question = {
  password: '123',
  question: 'How much is the fish?',
  subjectId: '1',
  level: '1',
};

const testQuestions = [];
for (let i = 1; i < 4; i++) {
  const testQuestion = _.cloneDeep(question);
  delete testQuestion.password;
  testQuestion.id = i;
  testQuestion.answers = [
    { id: 1 * i, answer: 'A', isCorrect: true, questionId: i },
    { id: 20 * i, answer: 'B', isCorrect: false, questionId: i },
    { id: 300 * i, answer: 'C', isCorrect: false, questionId: i },
    { id: 4000 * i, answer: 'D', isCorrect: false, questionId: i },
  ];
  testQuestions.push(testQuestion);
}

const postQuestion = _.cloneDeep(question);
postQuestion.answers = _.cloneDeep(postAnswers);

const putQuestion = _.cloneDeep(question);
putQuestion.answers = _.cloneDeep(putAnswers);
putQuestion.id = 99;

const getQuestion = _.cloneDeep(question);
getQuestion.answers = _.cloneDeep(getAnswers);
getQuestion.id = 99;

module.exports = {
  getQuestion,
  postQuestion,
  putQuestion,
  testQuestions,
};
