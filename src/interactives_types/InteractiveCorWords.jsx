import React from 'react'
import styles from '../css/InteractiveCorWords.module.css';
import { useState } from 'react';
export default function InteractiveCorWords({click, interactivesArr, timeCode}) {
  const [chosenWords, setChosenWords] = useState({});

  const [checked, setChecked] =  useState(false);
  const [result, setResult] = useState('');

  let data = {};
  for (let elem of interactivesArr) {
      if(Math.floor(timeCode) == elem['time_code']) {
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
    <div className={styles.container}>
      <div className={styles['cor-words-wrapper']}>
        <p>{correctWordsData.task}</p>
        <ul className={styles['words-box']}>
          {words.map((answer, index) => (
            <li className={`${chosenWords[answer]? styles.selected : styles.word}`} onClick = {() => {chooseWordHandler(answer)}}
              key={answer}>
              {answer}
            </li>
          ))}
        </ul>
        <button onClick={checkResultHandler} className={styles['check-button']}>Проверить</button>
        {checked &&
        <>
        <p>Результат: {result} </p>
        <button className={styles['next-button']} onClick={click}>Продолжить</button>
        </>}
        
      </div>
    </div>
  )
}
