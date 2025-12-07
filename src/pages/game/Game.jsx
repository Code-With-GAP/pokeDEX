// src/Game.jsx
import { useState, useEffect } from "react";
import { pokemonList } from "./data";

export default function Game() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const shuffled = [...pokemonList].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10)); 
  }, []);

  if (finished) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">Game Over!</h1>
        <p className="text-2xl mt-4">Your Score: {score} / 10</p>
        <button 
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const current = questions[index];

  const handleCheck = () => {
    setReveal(true);
    if (guess.trim().toLowerCase() === current.name) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (index === 9) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setGuess("");
      setReveal(false);
    }
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-6">Who's That Pokémon?</h1>

      {/* Pokémon shadow */}
      <img
        src={current.img}
        alt="pokemon"
        className={`mx-auto w-48 h-48 ${reveal ? "" : "brightness-0"} transition-all`}
      />

      {/* Input */}
      {!reveal ? (
        <div className="mt-6">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter Pokémon name"
            className="border px-3 py-2 rounded text-lg"
          />
          <button
            onClick={handleCheck}
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Reveal
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">
            It's <span className="capitalize">{current.name}</span>!
          </h2>
          <button
            onClick={nextQuestion}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next →
          </button>
        </div>
      )}

      <p className="mt-4 text-xl">Question {index + 1} / 10</p>
    </div>
  );
}
