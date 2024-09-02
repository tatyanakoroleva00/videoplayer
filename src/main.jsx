import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import VideoCourse from './Videocourse'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VideoCourse />
  </StrictMode>,
)
