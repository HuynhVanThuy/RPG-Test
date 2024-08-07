import React, { useCallback, useRef, useState } from "react";
import "./index.css";
import Ball from "./ball";

const gameStatus = {
  start: {
    text: "LET'S PLAY",
    color: "black",
  },
  win: {
    text: "ALL CLEARED",
    color: "green",
  },
  end: {
    text: "GAME OVER",
    color: "red",
  },
};

const initStatus = {
  isCorrect: true,
  curNum: 0,
};

const Layout = () => {
  const bgRef = useRef(undefined);
  const intervalRef = useRef(null);
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [balls, setBalls] = useState([]);
  const [status, setStatus] = useState(initStatus);
  const [gameTitle, setGameTitle] = useState(gameStatus.start);

  const randNum = () => {
    return `${Math.floor(Math.random() * 90) + 1}%`;
  };

  // Countdown
  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1)));
    }, 100);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const resetTimer = useCallback(() => {
    stopTimer();
    setTime(0);
  }, []);

  const restartGame = useCallback(() => {
    if (points > 0) {
      const ballsProps = [...Array(points)].map((_, i) => {
        return {
          num: i + 1,
          styles: {
            top: randNum(),
            left: randNum(),
            background: "white",
            zIndex: points - i,
          },
        };
      });
      setStatus(initStatus);
      setBalls(ballsProps);
      setGameTitle(gameStatus.start);
      resetTimer();
      startTimer();
    }
  }, [points, resetTimer]);

  const handleTouchBall = (num) => {
    const isCorrect = num - status.curNum === 1;
    // Game over
    if (!isCorrect) {
      setGameTitle(gameStatus.end);
      setStatus(initStatus);
      stopTimer();
      return;
    }
    if (isCorrect) {
      setBalls(
        balls.map((ball) => ({
          ...ball,
          className: ball.num <= num ? "fade-out" : ball.className,
        }))
      );
      // You are winner
      if (num === balls.length) {
        setGameTitle(gameStatus.win);
        stopTimer();
        return;
      }
      setStatus({
        isCorrect: isCorrect,
        curNum: num,
      });
    }
  };

  return (
    <div className="layout-container">
      <h2 style={{ color: gameTitle.color }}>{gameTitle.text}</h2>
      <div className="point-grid">
        <p>Points:</p>
        <input
          value={points}
          onChange={(e) => setPoints(+e.currentTarget.value || 0)}
        />
        <p>Time:</p>
        <p>{time}s</p>
        <button onClick={restartGame} type="button" disabled={points === 0}>
          {gameTitle.text === gameStatus.start.text && status.curNum === 0
            ? "Play"
            : "Restart"}
        </button>
      </div>
      <div
        className="bg-container"
        ref={bgRef}
        style={{
          pointerEvents: gameTitle !== gameStatus.start ? "none" : "all",
        }}
      >
        {balls.map((item) => {
          return (
            <Ball
              onClick={() => handleTouchBall(item.num)}
              key={item.num}
              num={item.num}
              style={{ ...item.styles }}
              className={item.className}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
