// import React, { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ipcRenderer } from 'electron';

import Copy from './pages/copy'
import Paste from './pages/paste'

import "tailwindcss/tailwind.css";

function App() {
  const nav = useNavigate();

  ipcRenderer.on('Open-Copy', () => {
    console.log("YO COPY PRESSED BROOO")
    nav("/copy") // prints 'some data'
  })  

  ipcRenderer.on('Open-Paste', () => {
    nav("/paste") // prints 'some data'
  })  

  
  return (
      <Routes>
        <Route path="/copy" element={<Copy />} />
        <Route path="/paste" element={<Paste />} />
      </Routes>
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

