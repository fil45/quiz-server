module.exports = function validateAnswersUpdate(oldAnswers, newAnswers) {
  oldAnswers = oldAnswers.map(answer => answer.dataValues);
  let oldAnswersIds = oldAnswers.map(answer => answer.id);
  let newAnswersIds = newAnswers.map(answer => answer.id);

  //check that ids of new answers belongs to question to be updated
  if (!contains(oldAnswersIds, newAnswersIds))
    throw new Error('At least one of the answer ids is incorrect');

  //check that all ids are unique
  let summaryAnswers = getSummaryAnswers(oldAnswers, newAnswers);
  let idSet = new Set(summaryAnswers);
  if (idSet.size !== 4) throw new Error('All ids must be unique');

  //check that only one answer is correct
  if (
    summaryAnswers.reduce(
      (total, answer) => (total += +answer.isCorrect),
      0
    ) !== 1
  )
    throw new Error('There must only be one correct answer');

  //check that there are no identical answers
  let summaryAnswersTexts = summaryAnswers.map(answer => answer.answer);
  let textSet = new Set(summaryAnswersTexts);
  if (textSet.size !== 4) throw new Error('All answers must be unique');
};

function contains(where, what) {
  for (let i = 0; i < what.length; i++) {
    if (where.indexOf(what[i]) == -1) return false;
  }
  return true;
}

function getSummaryAnswers(oldAnswers, newAnswers) {
  let summaryAnswers = oldAnswers.slice();
  for (let i = 0; i < summaryAnswers.length; i++) {
    for (let j = 0; j < newAnswers.length; j++) {
      if (summaryAnswers[i].id === newAnswers[j].id) {
        summaryAnswers[i] = newAnswers[j];
      }
    }
  }
  return summaryAnswers;
}
