import styles from './css/Player.module.css'
import play_button from './images/play-btn.png';
import pause_button from './images/pause-btn.png';
import "react-video-seek-slider/styles.css";
import { VideoSeekSlider } from "react-video-seek-slider";
import { useCallback, useEffect, useRef, useState } from "react";
import Interactives from '../Interactives';

export default function Player() {
    const player = useRef(null);
    const interval = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [videoswitch, setVideoSwitch] = useState(true);
    const [interactiveIsShown, setInteractiveIsShown] = useState(false);
    const [timeCode, setTimeCode] = useState();
    const [videoData, setVideoData] = useState({});
    const [interactivesArr, setInteractivesArr] = useState([]);

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
        if (!player) {
            return;
        } else {
            player.current?.addEventListener("play", handlePlay);
            player.current?.addEventListener("pause", handlePause);
            player.current?.addEventListener("loadeddata", handleDataLoaded);
            player.current?.addEventListener("progress", handleProgress);
        }
    }, [player]);

    //Slider 


    // player2.current.addEventListener("play", 'handlePlay');
    const handleTimeChange = useCallback((time, offsetTime) => {
        if (!player.current?.currentTime) {
            return;
        }

        player.current.currentTime = time / 1000;
        setCurrentTime(time);
    }, []);

    const handlePlay = () => {
        interval.current = setInterval(() => {
            setCurrentTime((player.current?.currentTime || 0) * 1000);
        }, 1000);
    };

    const handlePause = () => {
        clearInterval(interval.current);
    };

    const handleDataLoaded = () => {
        setMaxTime((player.current?.duration || 0) * 1000);
    };

    
    const handleProgress = () => {
        const buffer = player?.current?.buffered;

        if (((buffer?.length > 0 && player.current?.duration) || 0) > 0) {
            let currentBuffer = 0;
            const inSeconds = player.current?.currentTime || 0;

            for (let i = 0; i < buffer.length; i++) {
                if (buffer.start(i) <= inSeconds && inSeconds <= buffer.end(i)) {
                    currentBuffer = i;
                    break;
                }
            }

            setProgress(buffer.end(currentBuffer) * 1000 || 0);
        }
    };

    //Episodes

    //Перебор интерактивов. Получение таймкода и номера интерактива. 

    useEffect(() => {
        for (let elem of interactivesArr) {
            let episodeTime = elem['time_code'];
            let time = Math.floor(currentTime / 1000);

            if(time === Math.floor(episodeTime)) {
                setTimeCode(time);
                setInteractiveIsShown(true);
                player.current.pause();
            } 
        }
    }, [player, currentTime])


    /* Что происходит, когда нажимаем на включить и выключить видео */
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
    /* Интерактив показываем по нажатию на точку */
    const showInteractive = (index) => {
        let interactiveTimeCode = Math.floor(interactivesArr[index]['time_code']);
            setTimeCode(interactiveTimeCode);
            setCurrentTime(interactiveTimeCode * 1000);
            setInteractiveIsShown(true);
            console.log(player.currentTime, 'curtime');
            player.current.currentTime = interactiveTimeCode + 1;
            player.current.pause();
    }

    /* Рассчет размещения точек для интерактивов на видео */
    let seconds = maxTime / 1000;
    let pixelsPerSecond = 630 / seconds;

    let videoTime = Math.floor(currentTime / 1000);
    

    let videoUrl = videoData['url'];
    return (
        <>
            <div className={styles.container}>
                <div className={interactiveIsShown? styles['not-visible']: styles.visible}>
                

                    <video src={videoUrl} type="video/mp4"
                        autoPlay={false}
                        className={styles['video-preview']} 
                        ref={player}> 
                    </video> 
                </div>
                {interactiveIsShown && <Interactives timeCode={timeCode} interactivesArr={interactivesArr} click={handlePlayPauseClick}/>}
                {videoTime > 0 && videoTime < 5 && <div className={styles['video-heading-wrapper']}><p className={styles['video-heading']}>{videoData.heading}</p></div>}

                <div className={styles['toolbar-wrapper']}>
                    <div className={styles['dynamic-btn']}>
                        <button onClick={handlePlayPauseClick}>
                            {videoswitch ? <img className={styles['play-btn']} src={play_button} alt="play_button" /> :
                                <img className={styles['pause-btn']} src={pause_button} alt='pause_button' />}
                        </button>
                    </div>
                    <div className={styles['slider-wrapper']}>

                        <VideoSeekSlider
                            max={maxTime}
                            currentTime={currentTime}
                            bufferTime={progress}
                            onChange={handleTimeChange}
                            limitTimeTooltipBySides={true}
                            secondsPrefix="00:"
                            minutesPrefix="0:"
                            hideHoverTime={false}
                            
                        />
                        {/* Точки на линии */}

                        <div className={styles['interactives-line']}>
                            {interactivesArr?.map((elem, index) => (
                                <div id={index} onClick={() => showInteractive(index)} style={{left: Math.floor(interactivesArr[index]['time_code'] * pixelsPerSecond)}} className={styles.first}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </>
    )
}

