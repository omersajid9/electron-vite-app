import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

import axios from 'axios'

function App() {
  const [count, setCount] = useState("Heallo from frontend")

  async function getFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      console.log(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }
  

  const readGet = () =>
  {
   
    getFromClipboard();
    console.log("Initial click");
        axios.get("http://localhost:3000")
      .then((response) =>
        {
          // console.log("CLICKED", response.data);
          setCount(response.data);
          return null;
        })

  }

  return (
    <>
      <div className="card">
        <button onClick={() => readGet()}>
          {count}
        </button>
      </div>
    </>
  )
}

export default App
