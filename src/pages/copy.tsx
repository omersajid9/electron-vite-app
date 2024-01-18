import React, { useState, useEffect } from 'react';
import Textarea from '../components/Textarea';
import getFromClipboard from '../helper/clipboard';

import axios from 'axios'

interface FormData
{
  string: string
}

function copy()
{
    const [snippet, setSnippet] = useState("");
    const [name, setName] = useState("");

    // const [count, setCount] = useState([]);

    useEffect(() =>
    {
        getFromClipboard(setSnippet);
    }, [])

    // const readGet = () =>
    // {
    //     axios.get("http://localhost:3000")
    //         .then((response) =>
    //         {
    //         setCount(response.data.split("|"));
    //         return null;
    //         })
    // }

    const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => 
    {
        if (event.key == "Enter")
        {
            const formdata: FormData =  {
                string: JSON.stringify({"name": name, "snippet": snippet})
            };
            await axios.post<FormData>('http://localhost:3000/add', formdata);
            setSnippet("");
            setName("");
        }
    }

    const handleClear = () =>
    {
      setSnippet("");
    }

    const handleReload = () =>
    {
      getFromClipboard(setSnippet);
    }

    return (
        <>
        <div className='container-copy'>          
          <input className='input-name-copy' value={name} onChange={(e)=>setName(e.target.value)} onKeyPress={handleSubmit} placeholder='Enter a comment'/>
          <Textarea  text={snippet} onTextSelect={setSnippet} placeholder="Enter a snippet" />
          <div>
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleReload}>Reload</button>
          </div>
        </div>
        </>
    )
}

export default copy;



          {/* <button onClick={() => readGet()}>
            Retrive Data
          </button> */}
          {/* {count.map(item => (
          <div key={item} className="card">
            <p>{item}</p>
          </div>
        ))} */}
