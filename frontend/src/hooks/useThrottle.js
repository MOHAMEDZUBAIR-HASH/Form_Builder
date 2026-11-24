import { useRef, useCallback } from 'react';

/**
 * Custom hook to throttle any action/function (e.g. API trigger or button click).
 * Ensures that the callback is invoked at most once within the specified limit (default: 1000ms),
 * completely preventing accidental double-clicks, multiple submissions, and API spam.
 *
 * @param {Function} callback - The callback function to execute
 * @param {number} limit - Throttle limit in milliseconds (default: 1000ms)
 * @returns {Function} throttledCallback
 */
export const useThrottle = (callback, limit = 1000) => {
  const lastRan = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastRan.current >= limit) {
        lastRan.current = now;
        callback(...args);
      }
    },
    [callback, limit]
  );
};

export default useThrottle;
