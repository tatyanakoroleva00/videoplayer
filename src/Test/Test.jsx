import React, { useState, useRef } from 'react'
import './Test.css';

const Test = () => {
    const [fullScreen, setFullScreen] = useState(false);

    const fullScreenHandler = async () => {
        const container = document.getElementById('test-container');
        // const video = document.getElementsByTagName('video');
        const fullscreenApi = container.requestFullscreen;
        // const bottomOverlay = document.getElementsByClassName('.bottom-overlay');
        // const topOverlay = document.getElementsByClassName('.top-overlay');
        // const video = document.getElementsByTagName('video'); 


        if (!document.fullscreenElement) {
            setFullScreen(true);
            fullscreenApi.call(container);
        }
        else {
            setFullScreen(false);
            document.exitFullscreen();
        }
    };

    return (
        <>
            <div id='test-container'>
                <div id="bottom-overlay"><video id="videoPlayer" className={`${fullScreen ? 'bottom-overlay-min-size' : 'bottom-overlay-max-size'}`} src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" controls /></div>
                <div id="top-overlay">
                    <input type='text' placeholder='hello' />
                    <input type='text' placeholder='it is' />
                    <input type='text' placeholder='meeee' />
                </div>
                <div>
                    <button id="fullscreen-toggle-btn" onClick={fullScreenHandler} >C</button>
                </div>
            </div>
            <div>

            </div>
        </>
    )
}

export default Test