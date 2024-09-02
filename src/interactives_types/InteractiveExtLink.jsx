import React from "react";
import styles from '../css/InteractiveExtLink.module.css';
export default function InteractiveExtLink({ click, interactivesArr, timeCode }) {

    let data = {};
    for (let elem of interactivesArr) {
        if(Math.floor(timeCode) == elem['time_code']) {
            data = elem;
            // console.log(elem['receivedInfo'], 'elem');
        }
    }

    return (
        <div className={styles.container} >
            <div className={styles['external-link-wrapper']}>
                <p className={styles['link-description']}>{data['receivedInfo']['external_source_link_description']}</p>
                <p className={styles['weblink']}><a target="_blank" href={data['receivedInfo']['external_source_url']}>{data['receivedInfo']['external_source_url']}</a></p>
                <button className={styles['next-button']} onClick={click}>Продолжить</button>
            </div>
        </div>

    )

}