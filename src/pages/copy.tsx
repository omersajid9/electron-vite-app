import React, { useState, useEffect, useRef } from 'react';
import Textarea from '../components/Textarea';
import getFromClipboard from '../helper/clipboard';

import axios from 'axios'


// Todo convert form data from string to proper data type
interface FormData
{
  key: string,
  value: string,
  variableData: VariableData[]
}

interface VariableData
{
  varName: string,
  index: number,
  text: string
}

interface Match 
{
  index: number;
  text: string; 
}


function findAllMatches(text: string, regex: RegExp): Match[] 
{
  const matches: Match[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) 
  {
    matches.push({index: match.index, text: match[0]});
  }
  return matches;
}


function copy()
{
  
    const [snippet, setSnippet] = useState("");
    const [name, setName] = useState("");
    
    const [variableData, setVariableData] = useState<VariableData[]>([]);

    const [currentVar, setCurrentVar] = useState("");
    const [currentHlt, setCurrentHlt] = useState([]);

    const ref = useRef<HTMLTextAreaElement>(null);

    const checkValidHighlight = (selectionStart: number, selectionEnd: number) =>
    {
      if (variableData.length > 0)
      {
        console.log("VARDATA", variableData)
        var toRemove: VariableData[] = [];
        for (let i = 0; i < variableData.length; i++)
        {
          const varData = variableData[i];
          const range = [varData.index, varData.text.length + varData.index];
          if (!(selectionStart > range[1] || selectionEnd < range[0]))
          {
            toRemove.push(varData);
            console.log("CANCELLING", varData)
          }
          else
          {
            console.log("NOT CANCELLING", varData)
          }
  
        }
        console.log("CALLLLLLLL", toRemove, variableData)
  
        var filteredArray = variableData;
        toRemove.forEach((val) =>
        {
          filteredArray = filteredArray.filter(item => item.index != val.index);
        })
        if (toRemove)
        {
          setVariableData(filteredArray)
        }

      }

    }


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
    useEffect(()=>
    {
      console.log("USE", variableData);
    })

    const handleHighlight = (event: React.KeyboardEvent<HTMLInputElement>) =>
    {
      if (event.key == "Enter")
      {
        const text = snippet;
        const startIndex = currentHlt[0];
        const endIndex = currentHlt[1];
    

          const next = text.substring(startIndex, endIndex).replace(/[.*+?^${}()|]/g, '\\$&')
          var URLRegExp = new RegExp(""+next+"", "g");
          const res = findAllMatches(text, URLRegExp)

          var temp: VariableData[] = [];
          res.forEach((match) =>
          {
            temp.push({varName: currentVar, index: match.index, text: match.text})
          })
      
          setVariableData(prevData => [...prevData, ...temp]);
      }
    }

    const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => 
    {
        if (event.key == "Enter")
        {
            const formdata: FormData =  {
                key: name,
                value: snippet,
                variableData: variableData
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
          <Textarea variableData={variableData} checkValidHighlight={checkValidHighlight} ref={ref} text={snippet} onTextSelect={setCurrentHlt} placeholder="Enter a snippet" />
          <div>
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleReload}>Reload</button>
          </div>
          <h2>{snippet.substring(currentHlt[0], currentHlt[1])}</h2>
          <input className='input-name-copy' value={currentVar} onChange={(e)=>setCurrentVar(e.target.value)} onKeyPress={handleHighlight}  placeholder='Enter a variable name'/>
          {variableData.map((item) => (
                    <>
                    <tr>
                        <th>{item.varName + "(" + item.index + ")"}</th> 
                        </tr><tr>
                        <th>
                            <pre >
                                <code className="">
                                {/* <span Style="max-width='200px'"> */}
                                {snippet.substring(item.index, item.index+item.text.length)}
                                {/* </span> */}
                                </code>
                            </pre>
                        </th>
                    </tr>
                    </>
          ))}
       
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
