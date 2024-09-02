import React from 'react'
import { useState, useEffect } from 'react';
import styles from './css/Courses.module.css';


const Courses = ({setInteractivesArr, setVideoData}) => {
    const [courses, setCourses] = useState([]);
    //Подгрузка лишь вначале всех данных
    useEffect(() => {
        fetch('http://quiz.site/get-all-video-courses-handler')
            .then(response => response.json())
            .then((data) => {
            setCourses(data);
            })
        }, [])

      const showVideoCourseHandler = (videoCourseId) => {
        fetch('http://quiz.site/edit-videocourse-handler', {
          method: 'POST',
          body: JSON.stringify(Math.floor(videoCourseId))
      })
          .then(response => response.json())
          .then(data => {
              // console.log(data, 'data');
              setVideoData(data);
              setInteractivesArr(data.interactives);
          })
      }
      
  return (
    <div>
        
        <p>КОНСТРУКТОР</p>
      
      {courses.length !== 0 && <div className={styles['courses-table']}>
         <>
         {courses.map((elem, index) => (
           <div key={index} className={styles['table-line']}>
             <span>{elem['video_course_name']}</span>
             <div>
               <button onClick={() => showVideoCourseHandler(elem['video_course_id'])}>Play</button>
             </div>
           </div>
         ))}
         </>
       </div>}

    </div>
  )
}

export default Courses