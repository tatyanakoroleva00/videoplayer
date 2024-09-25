import React from 'react'
import styles from '../css/InteractiveCorWords.module.css';
import { useState } from 'react';
export default function InteractiveCorWords({click, interactivesArr, timeCode, fullScreen}) {
  const [chosenWords, setChosenWords] = useState({});

  const [checked, setChecked] =  useState(false);
  const [result, setResult] = useState('');

  let data = {};
  for (let elem of interactivesArr) {
    let episodeTime = elem['time_code'];
    let timeSplitted = episodeTime.split(':');
    let minutes = Math.floor(+timeSplitted[0]);
    let secondsInMinutes = minutes * 60;
    let seconds = Math.floor(+timeSplitted[1]);
    let resultTime = secondsInMinutes + seconds;

    if (Math.floor(timeCode) == resultTime) {
          data = elem;
          console.log(elem['receivedInfo'], 'elem');
      }
  }

  let correctWordsData = data['receivedInfo'];

  let words = [];
  let correctWordsArr = [];
  for (let key in correctWordsData) {
    if (key.includes("word")) {
      let word = correctWordsData[key]["word_name"];
      words.push(word);

      let correctAnswer = correctWordsData[key]["status"];
      if (correctAnswer === "yes") {
        correctWordsArr.push(word);
      }
    }
  }

  const chooseWordHandler = (answer) => {
    if (chosenWords[answer]) {
      setChosenWords(delete chosenWords[answer]);
    } else {
      let status = !chosenWords.answer;
      setChosenWords(prev => ({...prev, [answer] : status}));
    }
  };

  const checkResultHandler = () => {
    let chosenWordsArr = [];
    for (let key in chosenWords) {
      chosenWordsArr.push(key);
    }
    let sortedChosenWordsArr =  chosenWordsArr.sort();
    let sortedCorrectWordsArr = correctWordsArr.sort();

    setChecked(true);

    if(sortedChosenWordsArr.toString() !== sortedCorrectWordsArr.toString()) {
      setResult('Неверно!');
    } else {
      setResult('Верно!');
    }
  };


  return (
    <div className={`${fullScreen ? styles['container-fullscreen'] : styles.container}`}>
      <div className={styles['cor-words-wrapper']}>
      <div><button className={styles['hide-interactive-btn']} onClick={click}> X </button></div>
        <p className={styles.title}>{correctWordsData.task}</p>
        <ul className={styles['words-box']}>
          {words.map((answer, index) => (
            <li className={`${chosenWords[answer]? styles.selected : styles.word}`} onClick = {() => {chooseWordHandler(answer)}}
              key={answer}>
              {answer}
            </li>
          ))}
        </ul>
        {!checked && <button onClick={checkResultHandler} className={styles['check-button']}>Проверить</button>}
        {checked &&
        <>
        <p>Результат: {result} </p>
        <button className={styles['next-button']} onClick={click}>Продолжить</button>
        </>}
      </div>
    </div>
  )
}
