import { useState, useEffect } from "react";
import {
  COUNTUP_DURATION_MS,
  COUNTUP_INTERVAL_MS,
} from "../constants/calculationConstants";

/**
 * Custom hook to animate a numeric value from 0 up to a target number.
 *
 * @param target The final number to count up to.
 * @returns The current animated display value.
 */
export function useCountUp(target: number): number {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = COUNTUP_DURATION_MS;
    const incrementTime = COUNTUP_INTERVAL_MS;
    const steps = duration / incrementTime;
    const stepValue = end / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return displayValue;
}
