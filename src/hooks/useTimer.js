// src/hooks/useTimer.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing a countdown timer
 * @param {number} initialTime - Initial time in seconds (default: 0)
 * @returns {object} Timer state and controls
 */
export function useTimer(initialTime = 0) {
  const [timer, setTimer] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startTimer = (seconds) => {
    setTimer(seconds);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimer(0);
  };

  const resetTimer = () => {
    setTimer(initialTime);
    setIsActive(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  return {
    timer,
    isActive,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime
  };
}

export default useTimer;