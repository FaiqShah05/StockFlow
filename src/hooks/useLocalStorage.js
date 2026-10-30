import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return typeof initialValue === "function" ? initialValue() : initialValue;
      }
      throw error;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
