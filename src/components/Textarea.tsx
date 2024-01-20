import React, { forwardRef, useCallback  } from 'react'

interface TextareaProps {
    text: string;
    onTextSelect: (text: [number, number]) => void;  
    checkValidHighlight: (selectionStart: number, selectionEnd: number) => void;
    placeholder: string;
    variableData: VariableData[];
  }

  interface VariableData
{
  varName: string,
  index: number,
  text: string
}

  
  const Textarea= forwardRef<HTMLTextAreaElement, TextareaProps>(({ variableData, text, onTextSelect , checkValidHighlight, placeholder  }, ref) => {
  
    const wrapHighlight = useCallback((start: number, end: number) => {
      const highlight = text.substring(start, end)
      
      onTextSelect([start, end]);
    }, [text, onTextSelect]);


    const handleMouseUp = useCallback(() => { 
      const textarea = document.getElementById('myTextarea');
      const selectionStart = textarea?.selectionStart;
      const selectionEnd = textarea?.selectionEnd;

      console.log("FUNCTION ENTER", selectionStart)
      checkValidHighlight(selectionStart, selectionEnd);
      
      if (selectionStart !== null && selectionEnd !== null) {
        wrapHighlight(selectionStart, selectionEnd);
      }
    }, [wrapHighlight, variableData, checkValidHighlight]);
    
    return (
      <textarea 
        id="myTextarea"
        value={text}
        ref={ref}
        // onChange={(e)=>onTextSelect(e.target.value)}
        placeholder={placeholder}
        onMouseUp={handleMouseUp}  
      />
    );
  })
  
  export default Textarea;