import React from 'react'
import InteractiveExtLink from './interactives_types/InteractiveExtLink';
import InteractiveCorWords from './interactives_types/InteractiveCorWords';
import InteractiveTesting from './interactives_types/InteractiveTesting';
import styles from './css/Interactives.module.css';

export default function Interactives({ timeCode, interactivesArr, click }) {

  let interactiveType = '';
  for (let elem of interactivesArr) {

    let episodeTime = elem['time_code'];
    let timeSplitted = episodeTime.split(':');
    let minutes = Math.floor(+timeSplitted[0]);
    let secondsInMinutes = minutes * 60;
    let seconds = Math.floor(+timeSplitted[1]);
    let resultTime = secondsInMinutes + seconds;

    if (Math.floor(timeCode) == resultTime) {
      interactiveType = elem['interactive_type'];
    }
  }

  return (
    <div className={styles['interactives_wrapper']}>
      {interactiveType == 'externalSourceLink' && <InteractiveExtLink click={click} timeCode={timeCode} interactivesArr={interactivesArr} />}
      {interactiveType == 'correctWordsChoice' && <InteractiveCorWords click={click} timeCode={timeCode} interactivesArr={interactivesArr} />}
      {interactiveType == 'testing' && <InteractiveTesting click={click} timeCode={timeCode} interactivesArr={interactivesArr} />}
    </div>
  )
}
