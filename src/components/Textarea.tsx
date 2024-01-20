import React, {   } from 'react'

interface TextareaProps {
    text: string;
    onTextSelect: (text: string) => void;  
    placeholder: string;
  }
  
  const Textarea: React.FC<TextareaProps> = ({ text, onTextSelect ,placeholder }) => {
  
    // const wrapHighlight = useCallback(() => {
    //   const highlight = text
      
    //   onTextSelect(
    //     highlight
    //     // text.substring(0, start) +  
    //     // `{<mark>${highlight}</mark>}` +
    //     // text.substring(end)
    //   );
    // }, [text, onTextSelect]);

    // const handleMouseUp = useCallback(() => { 
    //   const textarea = document.getElementById('myTextarea');
    //   const selectionStart = textarea?.selectionStart;
    //   const selectionEnd = textarea?.selectionEnd;
      
    //   if (selectionStart !== null && selectionEnd !== null) {
    //     wrapHighlight(selectionStart, selectionEnd);
    //   }
    // }, [wrapHighlight]);
    
    return (
      <textarea 
        id="myTextarea"
        value={text}
        onChange={(e)=>onTextSelect(e.target.value)}
        placeholder={placeholder}
        // onMouseUp={onTextSelect}  
      />
    );
  }
  
  export default Textarea;