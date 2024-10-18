import { useState } from 'react';
import styles from '../css/InteractiveTesting.module.css';

export default function InteractiveTesting({ click, timeCode, interactivesArr, fullScreen }) {
  let data = {}; //тут находится интерактив

  for (let elem of interactivesArr) {

    let episodeTime = elem['time_code'];
    let timeSplitted = episodeTime.split(':');
    let minutes = Math.floor(+timeSplitted[0]);
    let secondsInMinutes = minutes * 60;
    let seconds = Math.floor(+timeSplitted[1]);
    let resultTime = secondsInMinutes + seconds;

    if (Math.floor(timeCode) == resultTime) {
      data = elem;
    }
  }
  let testing = data['receivedInfo']['questions'];

  let questions = [];

  for (let question of testing) {
    let questionObject = {};
    questionObject['questionText'] = question['question_name'];

    questionObject['answerOptions'] = question['answers'];
    questions.push(questionObject);
  }

  console.log(questions, 'questions');


  function toHide() {
    // //Приведение входящих данных к существующей логике
    // let questionsArr = [];



    // for (let key in testing['questions']) {

    //   let questionObj = {};
    //   let answersArr = [];
    //   let correctAnswers = [];







    //   for (let internalKey in testing['questions'][key]) {

    //     let testingInteractive = testing['questions'][key];

    //     if (internalKey === 'question_name') {
    //       let questionName = testing['questions'][key][internalKey];
    //       questionObj['question_name'] = questionName;
    //     }

    //     if (internalKey === 'answers') {
    //       for (let answer of testingInteractive[internalKey]) {
    //         answersArr.push(answer['name']);

    //         if (answer['status'] === true) {
    //           correctAnswers.push(answer['name'])
    //         }
    //       }
    //     }
    //     questionObj.choices = answersArr;
    //     questionObj['correctAnswer'] = correctAnswers;
    //     questionsArr.push(questionObj);
    //   }
    // }

    // console.log(questionsArr, 'questionsArr');

    // let totalQuestionsNumber = questionsArr.length;

    // const quiz = {
    //   questions: questionsArr,
    //   totalQuestions: totalQuestionsNumber,
    //   perQuestionScore: 5,
    // };


    // const [activeQuestion, setActiveQuestion] = useState(0)
    // const [selectedAnswer, setSelectedAnswer] = useState('')
    // const [showResult, setShowResult] = useState(false)
    // const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
    // const [result, setResult] = useState({
    //   score: 0,
    //   correctAnswers: 0,
    //   wrongAnswers: 0,
    // });

    // const { questions } = quiz;
    // const { question_name, choices, correctAnswer } = questions[activeQuestion];

    // const onClickNext = () => {
    //   setSelectedAnswerIndex(null)
    //   setResult((prev) =>
    //     selectedAnswer
    //       ? {
    //         ...prev,
    //         score: prev.score + 5,
    //         correctAnswers: prev.correctAnswers + 1,
    //       }
    //       : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    //   )
    //   if (activeQuestion !== questions.length - 1) {
    //     setActiveQuestion((prev) => prev + 1)
    //   } else {
    //     setActiveQuestion(0)
    //     setShowResult(true)
    //   }
    // };

    // const onAnswerSelected = (answer, index) => {
    //   setSelectedAnswerIndex(index);
    //   let chosenAnswer = index + 1;


    //   if (chosenAnswer === Math.floor(correctAnswer)) {
    //     setSelectedAnswer(true)
    //   } else {
    //     setSelectedAnswer(false)
    //   }
    // };

    // const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const maxScore = 5 * questions.length;

  const handleAnswerToggle = (index) => {
    setSelectedAnswers((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((i) => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const handleNextQuestion = () => {
    const correctAnswers = questions[currentQuestion].answerOptions
      .map((option, index) => (option.status ? index : null))
      .filter((index) => index !== null);

    const isCorrect = correctAnswers.length === selectedAnswers.length &&
      correctAnswers.every((val) => selectedAnswers.includes(val));

    if (isCorrect) {
      setScore(score + 5);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswers([]);
    } else {
      setShowScore(true);
    }
  };

  return (

    <div className={`${fullScreen ? styles['container-fullscreen'] : styles['quiz-container']}`}>
      {showScore ? (

        <div className={styles.result}>
          <h2>Результат</h2>
          <p>
            Количество вопросов: <span>{questions.length}</span>
          </p>
          <p>
            Итог:<span> {score} / {maxScore}</span>
          </p>
          <button className={styles['continue-btn']} onClick={click}>Продолжить</button>
        </div>
      ) : (
        <>
          <div className='question-section'>
            <div className='question-count'>
              <span>Вопрос {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className='question-text'>{questions[currentQuestion].questionText}</div>
          </div>
          <ul className='answer-section'>
            {questions[currentQuestion].answerOptions.map((answerOption, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedAnswers.includes(index)}
                    onChange={() => handleAnswerToggle(index)}
                  />
                  {answerOption.name}
                </label>
              </li>
            ))}
          </ul>

          <div className={styles["flex-right"]}>
            <button className={styles['next-btn']} onClick={handleNextQuestion} disabled={selectedAnswers.length === 0}> {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
            </button>
          </div>
        </>)}
    </div>

  )
}
