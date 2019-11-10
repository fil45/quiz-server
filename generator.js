const { Questions, Answers } = require('./db');

const subject = {
  1: 'Math',
  2: 'Physics',
  3: 'Chemistry',
};

const level = {
  1: 'Low',
  2: 'Average',
  3: 'High',
};

//Generation of testing data
let lorem =
  "From i made. Stars firmament had midst after let can't upon forth created. Kind the itself every divide darkness herb to. Were. Heaven. Dry divided signs signs. Lights divided. Saying fifth likeness years is third brought. Divide abundantly evening every wherein. Moved man likeness is Given fifth, place said have itself us had beast deep abundantly beast over the form divide. Female signs evening said gathered fowl multiply yielding that. Years under said god you'll very tree, great creeping day midst saw grass after. Together days man fowl forth signs let bearing blessed, you're fly. Created above above living herb appear behold us, multiply subdue creature evening fill it the greater, you'll stars behold great to us yielding life days morning given darkness doesn't.";
lorem = lorem.replace(/\.|\,/g, '');
let loremArr = lorem.toLowerCase().split(' ');

const randAB = function(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
};

const rand = function(n) {
  return Math.floor(Math.random() * n);
};

const getRandomQuestion = function() {
  let question = '';
  let length = randAB(5, 10);
  for (let i = 0; i < length; i++) {
    question += loremArr[rand(loremArr.length)] + ' ';
  }
  question =
    question[0].toLocaleUpperCase() + question.slice(1, question.length - 1);
  question += '?';
  return question;
};

const getRandomAnswer = function() {
  let answer = '';
  let length = randAB(1, 3);
  for (let i = 0; i < length; i++) {
    answer += loremArr[rand(loremArr.length)] + ' ';
  }
  answer = answer[0].toLocaleUpperCase() + answer.slice(1, answer.length - 1);
  return answer;
};

const getRandomCorrect = function() {
  let arr = [0, 0, 0, 0];
  arr[rand(4)] = 1;
  return arr;
};

const getRandomAnswers = function(n) {
  let arr = [];
  let correct = getRandomCorrect();
  for (let i = 0; i < n; i++) {
    arr.push({
      answer: getRandomAnswer(),
      isCorrect: correct[i],
    });
  }
  return arr;
};

const getCorrectAnswer = function(answers) {
  return answers.filter(a => a.isCorrect)[0].answer
};

let generateData = function(n) {
  for (let q = 0; q < n; q++) {
    for (let i = 1; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        let randomAnswers = getRandomAnswers(4);
        let correct = getCorrectAnswer(randomAnswers);
        Questions.create(
          {
            question: `${subject[i]}; ${
              level[j]
            }; Correct: ${correct}; Question: ${getRandomQuestion()}`,
            subjectId: i,
            level: j,
            answers: randomAnswers,
          },
          {
            include: [Answers],
          }
        ).catch(e => {
          console.error('Error: ', e.message);
        });
      }
    }
  }
};

module.exports = generateData;
