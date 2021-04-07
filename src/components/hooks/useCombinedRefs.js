/**
 * Combines many refs into one. Useful for combining many ref hooks
 */
import { useCallback } from 'react';

export const useCombinedRefs = (...refs) =>
  useCallback(
    (element) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        // Ref can have two types - a function or an object. We treat each case.
        if (typeof ref === 'function') {
          return ref(element);
        }

        // As per https://github.com/facebook/react/issues/13029
        // it should be fine to set current this way.
        ref.current = element;
      }),
    [refs]
  );
