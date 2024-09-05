import styles from './css/Player.module.css'
import { useEffect, useRef, useState } from "react";
import Interactives from './Interactives';

export default function Player2() {
    const player = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [timeCode, setTimeCode] = useState('');
    const [videoData, setVideoData] = useState({});
    const [interactivesArr, setInteractivesArr] = useState([]);
    const [duration, setDuration] = useState(0);
    const [interactiveIsShown, setInteractiveIsShown] = useState(false);
    const [videoswitch, setVideoSwitch] = useState(true);
    

    useEffect(() => {
        fetch('http://quiz.site/edit-videocourse-handler', {
            method: 'POST',
            // body: JSON.stringify(new URL(window.location).searchParams.get('courseId'))
            body: JSON.stringify(Math.floor(919))
        })
            .then(response => response.json())
            .then(data => {
                setVideoData(data);
                setInteractivesArr(data.interactives);
            })
    }, [])

    useEffect(() => {
        if(!player) return;
        else {
            setDuration(player.current?.duration);
        }
    }, [player])

     //Episodes
    //Перебор интерактивов. Получение таймкода и номера интерактива. 

    // useEffect(() => {
    //     for (let elem of interactivesArr) {
    //         let episodeTime = elem['time_code'];
            
    //         console.log(episodeTime, 'epTime');

    //         let timeSplitted = episodeTime.split(':');
    //         let minutes = Math.floor(+timeSplitted[0]);
    //         let secondsInMinutes = minutes * 60;
    //         let seconds = Math.floor(+timeSplitted[1]);
    //         let resultTime = secondsInMinutes + seconds;
    //         console.log(resultTime, 'resTime');

    //         if (currentTime === resultTime) {
    //             setTimeCode(currentTime);
    //             setInteractiveIsShown(true);
    //             player.current.pause();
    //             player.current.currentTime = resultTime + 1;
    //         }
    //     }
    // }, [player, currentTime])


    useEffect(() => {
        for (let elem of interactivesArr) {
            let episodeTime = elem['time_code'];
            let time = Math.floor(currentTime / 1000);
            console.log(episodeTime, 'time');

            if(time === Math.floor(episodeTime)) {
                setTimeCode(time);
                setInteractiveIsShown(true);
                player.current.pause();
            } 
        }
    }, [player, currentTime])

    let videoUrl = videoData['url'];
    // console.log(currentTime, 'curTime');

    //Сразу устанавливаем счетчик для времени
    const timeUpdateHandler = () => {
        let time = player.current?.currentTime;
        setCurrentTime(Math.floor(time));
    }

    const handlePlayPauseClick = () => {

        // setInteractive1(false);
        setInteractiveIsShown(false);

        setVideoSwitch(!videoswitch);
        if (videoswitch) {
            player.current.play();
        } else {
            player.current.pause();
        }
    }
    return (
        <div className={styles.container}>
            <div className={interactiveIsShown? styles['not-visible']: styles.visible}>
            <video onTimeUpdate={timeUpdateHandler} src={videoUrl}
                ref={player} width={1000} height={500} controls />
            </div>
            {currentTime > 0 && currentTime < 5 && <div className={styles['video-heading-wrapper']}><p className={styles['video-heading']}>{videoData.heading}</p></div>}

            {interactiveIsShown && <Interactives timeCode={timeCode} interactivesArr={interactivesArr} click={handlePlayPauseClick}/>}
        </div>
    )
}



// import { useRef, useState } from 'react';
// // https://sys3.ru/mti/video/02_ob_institute.mp4
// import img from './assets/poster.png'


// const Player = () => {
//   const player = useRef(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [timeCode, setTimeCode] = useState('');
//   let url = "https://sys3.ru/mti/video/02_ob_institute.mp4";


//   //Видео перематывается на определенный момент времени по щелчку
//   const SeekHandler = () => {
//     setCurrentTime(50);
//   }
//   //Сразу устанавливаем счетчик для времени
//   const timeUpdateHandler = () => {
//     let time = player.current?.currentTime;
//     setCurrentTime(Math.floor(time));
//   }

//   //Рассчет секунд в введенном времени
//   function convertTime(time) {
//     let timeSplitted = time.split(':');
//     let minutes = Math.floor(+timeSplitted[0]);
//     let secondsInMinutes = minutes * 60;
//     let seconds = Math.floor(+timeSplitted[1]);
//     let resultTime = secondsInMinutes + seconds;
//     return resultTime;
//   }
//   let newtime = convertTime(timeCode);

//   let episodes = [newtime];

//   for (let episode of episodes) {
//     if (currentTime === episode) {
//       player.current.pause();
//       player.current.currentTime = episode + 1;
//     }
//   }

//   return (
//     <div >
//       <video onTimeUpdate={timeUpdateHandler}
//         ref={player} poster={img} width={1000} height={500} controls preload="true">
//         <source src={url} type="video/mp4" />
//       </video>
//       <div>
//         <br />
//         <label>Timecode : <input onChange={(event) => setTimeCode(event.target.value)} type='text' pattern="[0-9]*" value={timeCode} placeholder='00:00' maxLength={5} /></label>
//       </div>
//     </div>
//   )
// }

// export default Player