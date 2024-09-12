import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Player from './Player'
import Player from './Player.jsx';
// import Test from './Test.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Player/>
    {/* <Test/> */}
  </StrictMode>,
)
