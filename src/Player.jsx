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
    const [pixels, setPixels] = useState(0);
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(550);


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
        if (!player) return;
        else {
            setDuration(player.current?.duration);
            player.current?.addEventListener("loadeddata", handleDataLoaded);
        }
    }, [player])

    const handleDataLoaded = () => {
        setDuration(player.current?.duration || 0);
    };


    //Episodes
    //Перебор интерактивов. Получение таймкода и номера интерактива. 

    function convertTime(episodeTime) {
        let timeSplitted = episodeTime.split(':');
        let minutes = Math.floor(+timeSplitted[0]);
        let secondsInMinutes = minutes * 60;
        let seconds = Math.floor(+timeSplitted[1]);
        let resultTime = secondsInMinutes + seconds;
        return resultTime;
    }

    useEffect(() => {
        for (let elem of interactivesArr) {

            let resultTime = convertTime(elem['time_code']);

            if (currentTime === resultTime) {
                setTimeCode(currentTime);

                setInteractiveIsShown(true);
                player.current.currentTime = resultTime + 1;
                player.current.pause();
            }
        }
    }, [player, currentTime])

    //Сразу устанавливаем счетчик для времени
    const timeUpdateHandler = () => {
        let time = player.current?.currentTime;
        setCurrentTime(Math.floor(time));

    }

    const handlePlayPauseClick = () => {
        setInteractiveIsShown(false);
        player.current.play();
    };

    let timeCodes = [];
    for (let elem of interactivesArr) {
        let resultTime = convertTime(elem['time_code']);
        console.log(duration, 'duration');
        let pixels = resultTime * Math.floor(900 / duration);
        console.log(width, 'width');
        console.log(pixels, 'pixels');
        timeCodes.push(pixels);
    }

    const showInteractive = (index) => {
        let resultTime = convertTime(interactivesArr[index]['time_code']);
        setTimeCode(resultTime);
        // setCurrentTime(resultTime);
        setInteractiveIsShown(true);
        player.current.currentTime = resultTime + 1;
        player.current.pause();
    }



    return (
        <div className={styles.container}>
            {/* <div className={interactiveIsShown ? styles['not-visible'] : styles.visible}> */}
            <div className={styles['video-player']}>
                <video id="video" onTimeUpdate={timeUpdateHandler} src={videoData['url']}
                    ref={player} width={width} height={height} controls />
            </div>
            {/* {currentTime === 0 && <div className={styles['video-heading-wrapper']}><p className={styles['video-heading']}>{videoData.heading}</p></div>} */}
            <div className={`${interactiveIsShown ? styles.interactive : styles['not-visible']}`}>
                {interactiveIsShown && <Interactives timeCode={timeCode} interactivesArr={interactivesArr} click={handlePlayPauseClick} />}
            </div> 
            <div className={styles['interactives-line']}>
                {interactivesArr?.map((elem, index) => (
                    <div id={index} key={index} onClick={() => showInteractive(index)} style={{ left: timeCodes[index] }} className={styles.first}></div>
                ))}
            </div>
        </div>
    )
}