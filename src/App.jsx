import React, { useState, useEffect } from "react";
import "./App.css";
import Grid from "./Components/Grid";
import Keyboard from "./Components/Keyboard";



function App() {
  const [wordList, setWordList] = useState([]); // Stores the list of words
  const [targetWord, setTargetWord] = useState(""); // Random target word
  const [isResetting, setIsResetting] = useState(false);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [keyStatuses, setKeyStatuses] = useState({});

  const updateKeyStatuses = (guess, feedback) => {
    const newStatuses = { ...keyStatuses }; // Copy the current keyStatuses
  
    feedback.forEach((status, index) => {
      const letter = guess[index];
  
      // Prioritize "correct" > "present" > "absent"
      if (status === "correct") {
        newStatuses[letter] = "correct";
      } else if (status === "present" && newStatuses[letter] !== "correct") {
        newStatuses[letter] = "present";
      } else if (!newStatuses[letter]) {
        newStatuses[letter] = "absent";
      }
    });
  
    setKeyStatuses(newStatuses); // Update the keyStatuses state
  };
  

  const updateGuess = (event) => {
    const key = event.key.toLowerCase();
  
    if (isAnimating || isGameOver) return; // Prevent input during animation or game over
  
    if (/^[a-z]$/.test(key)) {
      setCurrentGuess((prev) => (prev.length < 5 ? prev + key : prev));
    } else if (key === "backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key === "enter" && currentGuess.length === 5) {
      setIsAnimating(true); // Lock input during animation
  
      const feedback = checkGuess(currentGuess);
  
      updateKeyStatuses(currentGuess, feedback); // Update the keyStatuses object

      setGuesses((prev) => {
        const newGuesses = [...prev, { word: currentGuess, feedback }];
  
        // Delay game-over logic to match the flip animation
        setTimeout(() => {
          if (currentGuess.toLowerCase() === targetWord.toLowerCase()) {
            setIsGameOver(true); // Win condition
          } else if (newGuesses.length >= 6) {
            setIsGameOver(true); // Loss condition
          }
        }, 2500); // Delay matches animation duration (2.5s)
  
        return newGuesses;
      });
  
      setCurrentGuess("");
  
      // Unlock input after animation duration
      setTimeout(() => {
        setIsAnimating(false);
      }, 2100);
    }
  };  

  const checkGuess = (guess) => {
    const feedback = [];
    const targetArray = targetWord.toLowerCase().split(""); // Convert targetWord to lowercase
    const guessArray = guess.toLowerCase().split(""); // Convert guess to lowercase
  
    // First pass: Check for correct letters in correct positions
    guessArray.forEach((letter, i) => {
      if (letter === targetArray[i]) {
        feedback.push("correct");
        targetArray[i] = null; // Mark the letter as used
      } else {
        feedback.push(null); // Placeholder
      }
    });
  
    // Second pass: Check for correct letters in wrong positions
    guessArray.forEach((letter, i) => {
      if (feedback[i] === null) {
        if (targetArray.includes(letter)) {
          feedback[i] = "present";
          targetArray[targetArray.indexOf(letter)] = null; // Mark as used
        } else {
          feedback[i] = "absent";
        }
      }
    });
  
    return feedback; // Array of "correct", "present", "absent"
  };  

  useEffect(() => {
    window.addEventListener("keydown", updateGuess);
  
    // Cleanup the listener on unmount
    return () => window.removeEventListener("keydown", updateGuess);
  }, [updateGuess, currentGuess, guesses, targetWord]);  

  useEffect(() => {
    // Fetch word list from the public folder
    fetch("/wordList.txt")
      .then((response) => response.text())
      .then((text) => {
        const words = text.split("\n").map((word) => word.trim());
        setWordList(words);

        // Select a random word as the target
        setTargetWord(words[Math.floor(Math.random() * words.length)]);
      });
  }, []);

  const restartGame = () => {
    setIsResetting(true); // Disable flip animations during reset
  
    // Reset the game state after a brief delay
    setTimeout(() => {
      setCurrentGuess("");
      setGuesses([]); // Clear guesses to remove feedback
      setIsGameOver(false);
      setTargetWord(wordList[Math.floor(Math.random() * wordList.length)]); // Pick a new target word
      setIsResetting(false); // Re-enable animations after reset
    }, 100); // Add a small delay to ensure CSS changes propagate
  };
  

  return (
    <div>
      <h1>Wordle</h1>
      {isGameOver && (
        <div className="game-over">
          {guesses[guesses.length - 1]?.word === targetWord ? (
            <p>🎉 Congratulations! You guessed the word!</p>
          ) : (
            <p>😢 Game Over! The correct word was "{targetWord}".</p>
          )}
        </div>
      )}
      
      {isGameOver && <button onClick={restartGame}>Play Again</button>}
      
      <Grid guesses={guesses} currentGuess={currentGuess} isResetting={isResetting} />
      <Keyboard onKeyPress = {""} disabled = {""}keyStatuses={keyStatuses}/>
    </div>
  );
}

export default App;
