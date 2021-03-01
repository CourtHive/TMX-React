import { useState, useEffect } from 'react';

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export function useCurrentWidth(onWidthChange) {
  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    let timeoutId = null;

    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };

    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  if (typeof onWidthChange === 'function') onWidthChange();
  return width;
}
