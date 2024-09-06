import styles from './css/Player.module.css'
import { useEffect, useRef, useState } from "react";
import Interactives from './Interactives';
//  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" 

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
            body: JSON.stringify(new URL(window.location).searchParams.get('courseId'))
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

    useEffect(() => {
        for (let elem of interactivesArr) {
            let episodeTime = elem['time_code'];
            let timeSplitted = episodeTime.split(':');
            let minutes = Math.floor(+timeSplitted[0]);
            let secondsInMinutes = minutes * 60;
            let seconds = Math.floor(+timeSplitted[1]);
            let resultTime = secondsInMinutes + seconds;

            if (currentTime === resultTime) {
                console.log('curtime', currentTime);
                console.log(resultTime, 'resTIme');
                setTimeCode(currentTime);
                setInteractiveIsShown(true);
                player.current.currentTime = resultTime + 1;
                player.current.pause();
            }
        }
    }, [player, currentTime])


    let videoUrl = videoData['url'];

    //Сразу устанавливаем счетчик для времени
    const timeUpdateHandler = () => {
        let time = player.current?.currentTime;
        setCurrentTime(Math.floor(time));
    }

    const handlePlayPauseClick = () => {
        setInteractiveIsShown(false);
        player.current.play();
    };
    return (
        <div className={styles.container}>
            <div className={interactiveIsShown? styles['not-visible']: styles.visible}>
            <video onTimeUpdate={timeUpdateHandler} src={videoUrl}
                ref={player} width={1000} height={550} controls />
            </div>
            {/* {currentTime === 0 && <div className={styles['video-heading-wrapper']}><p className={styles['video-heading']}>{videoData.heading}</p></div>} */}
            {interactiveIsShown && <Interactives timeCode={timeCode} interactivesArr={interactivesArr} click={handlePlayPauseClick}/>}
        </div>
    )
}