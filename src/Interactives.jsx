import React from 'react'
import InteractiveExtLink from './interactives_types/InteractiveExtLink';
import InteractiveCorWords from './interactives_types/InteractiveCorWords';
import InteractiveTesting from './interactives_types/InteractiveTesting';
import styles from './css/Interactives.module.css';

export default function Interactives({timeCode, interactivesArr, click}) {

    let interactiveType = '';
    for (let elem of interactivesArr) {
        if(Math.floor(timeCode) == elem['time_code']) {
            interactiveType = elem['interactive_type'];
        }
    }

  return (
    <div className={styles['interactives_wrapper']}>
        {interactiveType == 'externalSourceLink' && <InteractiveExtLink click={click} timeCode={timeCode} interactivesArr={interactivesArr}/>}
        {interactiveType == 'correctWordsChoice' && <InteractiveCorWords click={click} timeCode={timeCode} interactivesArr={interactivesArr}/>}
        {interactiveType == 'testing' && <InteractiveTesting click={click} timeCode={timeCode} interactivesArr={interactivesArr} />}
    </div>
  )
}
