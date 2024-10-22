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

  let answersObjChosen = {};
  for (let elem in questions) {
    let question = questions[elem]['answerOptions'];
    for (let answer of question) {
      answersObjChosen[answer['id']] = false;
    }
  }

  const [checkedAnswers, setCheckedAnswers] = useState(answersObjChosen);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const maxScore = 5 * questions.length;

  const handleAnswerToggle = (index, answerOption) => {
    let id = answerOption['id'];
    
    setCheckedAnswers(prev => ({...prev, [id] : !checkedAnswers[id]}));
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

  const tryAgainHandler = () => {
    let updatedCheckedAnswersObj = checkedAnswers;
    for (let key in updatedCheckedAnswersObj) {
      if(updatedCheckedAnswersObj.hasOwnProperty(key)) {
        updatedCheckedAnswersObj[key] = false;
      }
    }
    setCheckedAnswers(updatedCheckedAnswersObj);
    setScore(0);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setShowScore(false);
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
          <div className={styles['buttons-wrapper']}>
            <button className={styles['replay-button']} onClick={tryAgainHandler}>Попробовать еще раз</button>
            <button className={styles['continue-btn']} onClick={click}>Продолжить</button>
            </div>
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
              <li key={index} className={`${checkedAnswers[answerOption['id']] === true && styles['checkbox-checked']}`} onClick={() => handleAnswerToggle(index, answerOption)}>
                <label>
                  <input className={styles['checkbox-invisible']}
                    type="checkbox"
                    checked={selectedAnswers.includes(index)}
                  />
                  {answerOption.name}
                </label>
              </li>
            ))}
          </ul>

          <div className={styles["flex-right"]}>
            <button className={styles['next-btn']} onClick={handleNextQuestion} disabled={selectedAnswers.length === 0}> {currentQuestion === questions.length - 1 ? 'Проверить' : 'Далее'}
            </button>
          </div>
        </>)}
    </div>

  )
}
