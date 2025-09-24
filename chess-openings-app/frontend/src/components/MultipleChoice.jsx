import React, { useState } from 'react';
import { getMove } from '../api/openingsClient';

/**
 * Simple multiple-choice demo that fetches a single opening by index.
 * Not used by the main quiz, but handy for testing the API.
 *
 * @param {{
 *   setType?: 'starter'|'level2'|'wacky',
 *   onPick?: (opening: {name:string,moves:string[],description:string}) => void
 * }} props
 */
 
const MultipleChoice = ({ setType = 'starter', onPick }) => {
  const [lastMove, setLastMove] = useState(null);
   const choices = [1, 2, 3, 4].map(n => `Move ${n}`);
 
  const handlePick = async (choiceIdx) => {
    try {
      const moveNumber = choiceIdx + 1; // example mapping: button 0 => move #1
      const move = await getMove(setType, moveNumber);
      setLastMove(move);
      onPick?.(move);
    } catch (e) {
      console.error('Failed to fetch move', e);
    }
  };
 
   return (
     <div>
       {choices.map((label, idx) => (
         <button key={idx} onClick={() => handlePick(idx)} style={{ marginRight: 8 }}>
           {label}
         </button>
       ))}
      {lastMove && (
        <div style={{ marginTop: 8 }}>
          <strong>Chosen move:</strong>
          <pre style={{ background:'#f6f8fa', padding:8 }}>
            {JSON.stringify(lastMove, null, 2)}
          </pre>
        </div>
      )}
     </div>
   );
 };
 
 export default MultipleChoice;
