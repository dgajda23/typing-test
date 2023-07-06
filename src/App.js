import "./App.css";
import { generate } from "random-words";
import useKeyPress from "./hooks/useKeyPress";
import React, { useState, useEffect } from "react";
import { currentTime } from "./utils/time";

const initialWords = generate(10).join(" ");
const countdownSeconds = 60;

function App() {
    const [leftPadding, setLeftPadding] = useState(
        new Array(20).fill(" ").join("")
    );
    const [outgoingChars, setOutgoingChars] = useState("");
    const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
    const [incomingChars, setIncomingChars] = useState(initialWords.substr(1));

    const [startTime, setStartTime] = useState();
    const [wordCount, setWordCount] = useState(0);
    const [wpm, setWpm] = useState(0);

    const [accuracy, setAccuracy] = useState(0);
    const [typedChars, setTypedChars] = useState("");

    const [countdown, setCountdown] = useState(countdownSeconds);

    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (countdown > 0 && startTime && !gameOver) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        } else if (countdown === 0 && !gameOver) {
            endGame();
        }
    }, [countdown, startTime, gameOver]);

    useKeyPress((key) => {
        if (!startTime) {
            setStartTime(currentTime());
            startCountdown();
        }

        let updatedOutgoingChars = outgoingChars;
        let updatedIncomingChars = incomingChars;

        if (key === currentChar && !gameOver) {
            if (leftPadding.length > 0) {
                setLeftPadding(leftPadding.substring(1));
            }

            updatedOutgoingChars += currentChar;
            setOutgoingChars(updatedOutgoingChars);

            setCurrentChar(incomingChars.charAt(0));

            updatedIncomingChars = incomingChars.substring(1);
            if (updatedIncomingChars.split(" ").length < 10) {
                updatedIncomingChars += " " + generate();
            }
            setIncomingChars(updatedIncomingChars);

            if (incomingChars.charAt(0) === " ") {
                setWordCount(wordCount + 1);

                const durationInMinutes = (currentTime() - startTime) / 60000.0;

                setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
            }
        }
        if (!gameOver) {
            const updatedTypedChars = typedChars + key;
            setTypedChars(updatedTypedChars);
            setAccuracy(
                (
                    (updatedOutgoingChars.length * 100) /
                    updatedTypedChars.length
                ).toFixed(2)
            );
        }
    });

    const startCountdown = () => {
        setCountdown(countdownSeconds);
    };

    const endGame = () => {
        setGameOver(true);
    };

    const retryGame = () => {
        setGameOver(false);
        setOutgoingChars("");
        setCurrentChar(initialWords.charAt(0));
        setIncomingChars(initialWords.substr(1));
        setStartTime(undefined);
        setWordCount(0);
        setWpm(0);
        setAccuracy(0);
        setTypedChars("");
        startCountdown();
        setLeftPadding(new Array(20).fill(" ").join(""));
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="Title">Start typing to begin!</h1>
            </header>
            <div className="App-content">
                <div className="typing">
                    <h2 className="Countdown">Time left: {countdown}</h2>
                    <p className="Character">
                        <span className="Character-out">
                            {(leftPadding + outgoingChars).slice(-20)}
                        </span>
                        <span className="Character-current">{currentChar}</span>
                        <span>{incomingChars.substr(0, 20)}</span>
                    </p>
                    <h3>
                        WPM: {wpm} | ACC: {accuracy}
                    </h3>
                </div>
                {gameOver && (
                    <div className="Game-over">
                        <h1 className="Game-over-message">Game Over!</h1>
                        <p>Accuracy: {accuracy}%</p>
                        <p>WPM: {wpm}</p>
                        <button className="Retry-button" onClick={retryGame}>
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
