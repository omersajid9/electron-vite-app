import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosResponseHeaders } from 'axios';
import { ipcRenderer } from 'electron'

interface Query {
    name: string
}

interface VariableData
{
  varName: string,
  index: number,
  text: string
}


interface ResponseData
{
    key: string,
    value: string,
    variableData: VariableData[]
}

interface InputState
{
    varName: string,
    varPoints: number[],
    replace: string,
    origText:string
}

interface InputStates
{
    array: InputState[]
}


function accumulateDuplicates(items: VariableData[]) {

    const setArray: InputState[] = [];
    const vars_used: string[] = [];

    items.forEach((item) =>
    {
        const ind : number = vars_used.indexOf(item.varName);
        if (ind >= 0)
        {
            setArray[ind].varPoints.push(item.index);
        }
        else
        {
            const input: InputState = {varName: item.varName, origText: item.text, varPoints: [item.index], replace:""};
            setArray.push(input);
            vars_used.push(item.varName);
        }
    })
    return setArray;
}
  


function paste()
{
    const [query, setQuery] = useState("");
    const [snippet, setSnippet] = useState("");

    const [allSnippets, setAllSnippets] = useState<ResponseData[]>([]);
    const [currentSnippet, setCurrentSnippet] = useState<ResponseData>();

    const [inputStates, setInputStates] = useState<InputStates>({array: [] });

    useEffect(()=>
    {
        // const set
        if (currentSnippet)
        {
            const sortedSnippet = currentSnippet?.variableData.sort((a, b) => b.index - a.index)
            setInputStates({array: accumulateDuplicates(sortedSnippet)});
        }
    }, [currentSnippet])

    const formatString = () =>
    {
        if (currentSnippet)
        {
            var newString = currentSnippet?.value;
            console.log("FORMAT", inputStates)
            inputStates.array.forEach((value) =>
            {
                const inputState = value;
    
                inputState.varPoints.forEach((point) =>
                {
                    newString = newString.substring(0, point) + inputState.replace + newString.substring(point+inputState.origText.length);
                })
                
            })
            return newString;

        }
    }

    useEffect(()=>
    {
        handleSubmit();
        console.log("SNIPPET", snippet)
    }, [query])


    const handleSubmit = async () => 
    {        
            const queryData: Query =  {
                "name": query
            };
            const response = await axios.get("http://localhost:3000/search", {params: queryData.name.length > 0 ? queryData : { "name": "*"}});
            console.log("YOOOO", response.data)
            const data = response.data.hits[0]?.document;

            if (data)
            {
                console.log("DAATATATA", data)
                const res: ResponseData[] = [];
                response.data.hits.forEach((a: any)=> {res.push(a.document);});
                setAllSnippets(res)



                setCurrentSnippet(data);
                setSnippet(data.value);
                modifyText(data)
            }
            else
            {
                console.log("ELSESESESE", data)
                setAllSnippets([])
                setCurrentSnippet(undefined);
                setSnippet("");
            }
            
            // // await axios.post<FormData>('http://localhost:3000/add', queryData);
            // // setSnippet("");
            // // setName("");
            // navigator.clipboard.writeText(response.data);
    }

    const modifyText = (data: ResponseData) =>
    {
        if (data?.variableData)
        {
            var origString = data.value;
            const vardata = data.variableData.sort((a, b)=> b.index - a.index);
            vardata.forEach((eachVar) =>
            {
                origString = origString.substring(0, eachVar.index) + eachVar.varName + origString.substring(eachVar.index+eachVar.text.length)
            })
            setSnippet(origString)

            console.log("SORTED", vardata);
            return origString
        }
    }

    const setInputValue = (index: number, value: InputState) => {
        const array = [...inputStates.array]; 
        array[index] = value;
        setInputStates({array});
      }

    
    // cd home/hello

    const handleClick = async () =>
    {
        console.log(formatString())
        await ipcRenderer.invoke('close-me', formatString()).then((result) => console.log("INVOKED", result)).catch((error) => console.log(error));
    }

    // useEffect(()=>
    // {
    //     readGet();
    // }, [])

    // const readGet = () =>
    // {
    //     axios.get<ResponseData[]>("http://localhost:3000")
    //         .then((response: AxiosResponse<ResponseData[]>) =>
    //         {
    //             // console.log(response.data)
    //         setAllSnippets(response.data);
    //         // return null;
    //         })
    // }
    return (
        <>
        <div className="container-paste">
            <input className='input-query-paste' value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='Search for snippets'/>
            {/* <div><h4 onClick={handleClick} >{snippet}</h4></div> */}




            {/* {inputStates.array.map((vardata: InputState, index: number) =>
            (
                <>
                <input 
                    className='input-query-paste'
                    key={index}  
                    value={inputStates.array[index].replace || ""}
                    onChange={(e) => setInputValue(index, {replace: e.target.value, varName: vardata.varName, varPoints: vardata.varPoints, origText: vardata.origText})} 
                    placeholder={vardata.varName + "(" + vardata.origText + ")"}
                />  
                </>
            ))} */}






            {/* <button onClick={() => readGet()}>
            Retrive Data
          </button> */}

        <table id="dataTable">

                {allSnippets.map((item: ResponseData)  => (
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
                    <br/>
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