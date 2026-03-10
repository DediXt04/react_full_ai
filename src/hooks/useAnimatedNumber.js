import { useState, useEffect, useRef } from "react";

export default function useAnimatedNumber(target, duration = 400) {
  const [display, setDisplay] = useState(target);
  const raf = useRef(null);

  useEffect(() => {
    const start = display;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(start + diff * eased));

      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return display;
}
