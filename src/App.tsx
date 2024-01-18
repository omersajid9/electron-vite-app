// import React, { useState } from 'react'
import './App.css'

import Copy from './pages/copy'
import Paste from './pages/paste'



function App() {

  return (
    <>
      <div className="card">
      <Copy/>
        <Paste/>
        {/* <input 
          type = "text"
          onChange={(e) => setSnippet(e.target.value)}
          value = {snippet}
          // onKeyPress={handleSubmit}
          /> */}
        <br/>
        {/* <button onClick={() => readGet()}>
          Retrive Data
        </button> */}
        {/* <button onClick={() => getFromClipboard()}>
          Retrive Copy
        </button> */}
        {/* {count.map(item => (
        <div key={item} className="card">
          <p>{item}</p>
        </div>
      ))} */}
      </div>
    </>
  )
}

export default App




  // const readGet = () =>
  // {
  //   console.log("Initial click");
  //       axios.get("http://localhost:3000")
  //     .then((response) =>
  //       {
  //         setCount(response.data.split("|"));
  //         return null;
  //       })
  // }

  // const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => 
  // {
  //   console.log(event.key)
  //   if (event.key == "Enter")
  //   {
  //     const formdata: FormData =  {
  //       string: snippet
  //     };

  //     await axios.post<FormData>('http://localhost:3000/add', formdata);
  //   }
  // }

