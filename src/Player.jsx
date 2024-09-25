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
    const [fullScreen, setFullScreen] = useState(false);
    const [showPoster, setShowPoster] = useState(true);

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
        let percents = (resultTime + 0.8) / duration * 100;
        timeCodes.push(percents);
    }

    const showInteractive = (index) => {
        let resultTime = convertTime(interactivesArr[index]['time_code']);
        setTimeCode(resultTime);
        setInteractiveIsShown(true);
        player.current.currentTime = resultTime + 1;
        player.current.pause();
    }

    //Клик на невидимую кнопку "расширить экран"
    const toggleFullScreen = async () => {
        const container = document.getElementById('video-container');
        const fullscreenApi = container.requestFullscreen || container.webkitRequestFullScreen
            || container.mozRequestFullScreen
            || container.msRequestFullscreen;
        
        if (!document.fullscreenElement) {
            setFullScreen(true);
            fullscreenApi.call(container);
        }
        else {
            setFullScreen(false);
            document.exitFullscreen();
        }

        //Выход из fullscreen по нажатию на кнопку Escape 
        document.addEventListener('fullscreenchange', function() {
            if (document.fullscreenElement) {
                // console.log('Видео вошло в полноэкранный режим2');
            } else {
                // console.log('Видео вышло из полноэкранного режим2');
                setFullScreen(false);
            }
        }, false);
    
    }

    if (player.current) {
        let vid = document.getElementById("videoPlayer");

        function videoTimeUpdate(e) {
            vid.setAttribute("controls", "controls");
        }

        vid.addEventListener('timeupdate', videoTimeUpdate, false);

        vid.onplaying = function() {
            setShowPoster(false);
        };

        if (interactiveIsShown) {
            vid.onplay = function() {
                setInteractiveIsShown(false);
            };
        }
    }

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  


    return (
        <div className={styles.container} id="video-container"  onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
            <div className={styles['video-container']}>
                <video className={interactiveIsShown ? styles['video-with-interactive'] : styles['video-without-interactives']} id="videoPlayer" onTimeUpdate={timeUpdateHandler} src={videoData['url']}
                    ref={player} controls/>
            </div>
            {currentTime === 0 && !interactiveIsShown && showPoster && <div className={styles.cover}>
                <p>{videoData.heading}</p></div>
            }
            <div className={styles['toggle-btn-wrapper']}>
                <button id="fullscreen-toggle-btn" className={`${fullScreen ? styles['toggle-btn-fullscreen'] : styles['toggle-btn']}`} onClick={toggleFullScreen}></button>
            </div>
            <div className={`${interactiveIsShown ? styles.interactive : styles['not-visible']}`}>
                {interactiveIsShown && <Interactives fullScreen={fullScreen} timeCode={timeCode} interactivesArr={interactivesArr} click={handlePlayPauseClick} />}
            </div>
            <div className={`${isHovered ? styles['interactives-line'] : styles['not-visible']}`}>
                {interactivesArr?.map((elem, index) => (
                    <div id={index} key={index} onClick={() => showInteractive(index)} style={{ left: `${timeCodes[index]}%` }} className={styles['interactive-point']}></div>
                ))}
            </div>
        </div>

    )
}