import React from "react";

const Keyboard = ({ onKeyPress, disabled, keyStatuses }) => {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = keyStatuses[key.toLowerCase()] || ""; // Get status for the key
            return (
              <button
                key={key}
                className={`key ${status}`} // Apply dynamic class
                onClick={() => onKeyPress(key)}
                disabled={disabled}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;

