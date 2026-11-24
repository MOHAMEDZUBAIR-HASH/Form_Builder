import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search input).
 * Delays updating the debounced value until after the specified delay (default: 400ms)
 * has passed since the user stopped typing.
 *
 * @param {any} value - The input value to debounce
 * @param {number} delay - The delay duration in milliseconds (default: 400ms)
 * @returns {any} debouncedValue
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value changes before the delay ends (user is still typing)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
