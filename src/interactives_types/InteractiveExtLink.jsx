import React from "react";
import styles from '../css/InteractiveExtLink.module.css';
export default function InteractiveExtLink({fullScreen, click, interactivesArr, timeCode }) {

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
        }
    }

    return (
        <div className={`${fullScreen ? styles['container-fullscreen'] : styles.container}`} >
            <div className={styles['external-link-wrapper']}>
                <p className={styles['link-description']}>{data['receivedInfo']['external_source_link_description']}</p>
                <p className={styles['weblink']}><a target="_blank" href={data['receivedInfo']['external_source_url']}>{data['receivedInfo']['external_source_url']}</a></p>
                <button className={styles['next-button']} onClick={click}>Продолжить</button>
            </div>
        </div>

    )

}