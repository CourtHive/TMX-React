import { useEffect } from 'react';

export function useOptimizedResize(onResize) {
  useEffect(() => {
    window.addEventListener('optimizedResize', onResize, false);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);
}

export function initOptimizedResizing() {
  (function () {
    var throttle = function (type, name, obj) {
      obj = obj || window;
      var running = false;
      var func = function () {
        if (running) {
          return;
        }
        running = true;
        requestAnimationFrame(function () {
          obj.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      };
      obj.addEventListener(type, func);
    };

    throttle('resize', 'optimizedResize');
  })();
}
