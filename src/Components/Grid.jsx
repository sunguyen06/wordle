import React from "react";

const Grid = ({ guesses, currentGuess, isResetting }) => {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div key={rowIndex} className="guess-row">
          {Array.from({ length: 5 }).map((_, colIndex) => {
            const wordObj = guesses[rowIndex]; // Current row data
            const letter =
              rowIndex === guesses.length
                ? currentGuess[colIndex] || "" // Show currentGuess in the active row
                : wordObj?.word[colIndex] || ""; // Show guessed letters
            const status = isResetting ? "" : wordObj?.feedback?.[colIndex] || ""; // Skip feedback during reset

            return (
              <div
                key={colIndex}
                className={`guess-cell ${status} ${isResetting ? "no-flip" : ""}`}
                style={{ "--i": colIndex }}
              >
                <div className="front">{letter}</div>
                <div className="back">{letter}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
