import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Decorative animations shorten (or drop) when the system asks for reduced
 * motion. Nothing in the UI depends on an animation to be understandable.
 */
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (mounted) {
          setReduced(value);
        }
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      setReduced(value);
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
};
