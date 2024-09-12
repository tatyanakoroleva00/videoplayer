import React from 'react'
import InteractiveExtLink from './interactives_types/InteractiveExtLink';
import InteractiveCorWords from './interactives_types/InteractiveCorWords';
import InteractiveTesting from './interactives_types/InteractiveTesting';

export default function Interactives({ timeCode, interactivesArr, click, fullScreen }) {

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
    <div>
      {interactiveType == 'externalSourceLink' && <InteractiveExtLink fullScreen={fullScreen} click={click} timeCode={timeCode} interactivesArr={interactivesArr} />}
      {interactiveType == 'correctWordsChoice' && <InteractiveCorWords fullScreen={fullScreen} click={click} timeCode={timeCode} interactivesArr={interactivesArr} />}
      {interactiveType == 'testing' && <InteractiveTesting fullScreen={fullScreen} click={click} timeCode={timeCode} interactivesArr={interactivesArr} />}
    </div>
  )
}
