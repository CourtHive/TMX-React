import { useEffect, useState } from 'react';

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handleSetDebounce = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handleSetDebounce);
    };
  }, [value, delay]);

  return debouncedValue;
}
