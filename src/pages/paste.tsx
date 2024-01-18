import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ipcRenderer } from 'electron'

interface Query {
    name: string
}


function paste()
{
    const [query, setQuery] = useState("");
    const [snippet, setSnippet] = useState("");

    const [count, setCount] = useState([]);

    const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => 
    {
        if (event.key == "Enter")
        {
            const queryData: Query =  {
                "name": query
            };
            const response = await axios.get("http://localhost:3000/search", {params: queryData});
            // console.log(response.data)
            // navigator.clipboard.writeText(response.data);
            console.log(response)
            setSnippet(response.data.value);
            // await axios.post<FormData>('http://localhost:3000/add', queryData);
            // setSnippet("");
            // setName("");
        }
    }

    const handleClick = async () =>
    {
        await ipcRenderer.invoke('close-me', snippet).then((result) => console.log("INVOKED", result)).catch((error) => console.log(error));
    }

    useEffect(()=>
    {
        readGet();
    }, [])

    const readGet = () =>
    {
        axios.get("http://localhost:3000")
            .then((response: any) =>
            {
                // console.log(response.data)
            setCount(response.data);
            return null;
            })
    }


    return (
        <>
        <div className="container-paste">
            <input className='input-query-paste' value={query} onChange={(e)=>setQuery(e.target.value)} onKeyPress={handleSubmit} placeholder='Search for snippets'/>
            <div><h4 onClick={handleClick} >{snippet}</h4></div>
                      <button onClick={() => readGet()}>
            Retrive Data
          </button>

          <table id="dataTable">

                {count.map((item: {key:string, value: string})  => (
                    <>
                    <tr>
                        <th>{item.key}</th> 
                        </tr><tr>
                        <th>
                            <pre >
                                <code className="">
                                {/* <span Style="max-width='200px'"> */}
                                {item.value}

                                {/* </span> */}
                                </code>
                            </pre>
                        </th>
                    </tr>
                    </>
                    // <div key={item} className="card">
                    // <p>{item}</p>
                    // </div>
            ))}
            </table>

        </div>
        </>
    )
    {/* <textarea value={snippet}  /> */}
}

export default paste;