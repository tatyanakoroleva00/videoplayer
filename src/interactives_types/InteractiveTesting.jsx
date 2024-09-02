import { useState } from 'react';
import '../css/interactive_testing.css';

export default function InteractiveTesting ({click, timeCode, interactivesArr}) {

  let data = {};
  for (let elem of interactivesArr) {
      if(Math.floor(timeCode) == elem['time_code']) {
          data = elem;
          console.log(elem['receivedInfo'], 'elem');
      }
  }

  let testing = data['receivedInfo'];

  //Приведение входящих данных к существующей логике
  let questionsArr = [];

  for (let key in testing) {
    let questionObj = {};
    let answersArr = [];

    for (let internalKey in testing[key]) {
      if(internalKey === 'question_name') {
        let questionName = testing[key][internalKey];
        questionObj['question_name'] = questionName;
      }
      if(internalKey === 'correct') {
        let correctAnswer = testing[key][internalKey];
        questionObj['correctAnswer'] = correctAnswer;
        
      }
      if (internalKey.includes('answer')) {
        answersArr.push(testing[key][internalKey]);
      }
    }
    questionObj.choices = answersArr;
    questionsArr.push(questionObj);
  }

  let totalQuestionsNumber = questionsArr.length;

  const quiz  = {
    questions : questionsArr,
    totalQuestions : totalQuestionsNumber,
    perQuestionScore: 5,
  };

  const [activeQuestion, setActiveQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  })

  const { questions } = quiz
  const { question_name, choices, correctAnswer } = questions[activeQuestion]

  const onClickNext = () => {
    setSelectedAnswerIndex(null)
    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    )
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
      setShowResult(true)
    }
  }

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index);
    let chosenAnswer = index + 1;
    console.log(chosenAnswer, 'answerindex');
   if (chosenAnswer === Math.floor(correctAnswer)) {
    console.log(correctAnswer, 'correctAnswer');
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
  }

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`)

  return (
    <div className="quiz-container">
      {!showResult ? (
        <div>
          <div>
            <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
            <span className="total-question">/{addLeadingZero(questions.length)}</span>
          </div>
          <h2>{question_name}</h2>
          <ul>
            {choices.map((answer, index) => (
              <li
                onClick={() => onAnswerSelected(answer, index)}
                key={answer}
                className={selectedAnswerIndex === index ? 'selected-answer' : null}>
                {answer}
              </li>
            ))}
          </ul>
          <div className="flex-right">
            <button onClick={onClickNext} disabled={selectedAnswerIndex === null}>
              {activeQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
            </button>
          </div>
        </div>
      ) : (
        <div className="result">
          <h3>Результат</h3>
          <p>
            Количество вопросов: <span>{questions.length}</span>
          </p>
          <p>
            Итог:<span> {result.score}</span>
          </p>
          <p>
            Правильные ответы:<span> {result.correctAnswers}</span>
          </p>
          <p>
            Неправильные ответы:<span> {result.wrongAnswers}</span>
          </p>
          <button onClick={click}>Продолжить</button>
        </div>
      )}
    </div>
  )
}
