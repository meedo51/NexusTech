import { useCallback, useRef } from 'react';

interface Use3DTiltOptions {
  intensity?: number;
  perspective?: number;
}

export const use3DTilt = <T extends HTMLElement>({ intensity = 15, perspective = 1000 }: Use3DTiltOptions = {}) => {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(${perspective}px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg)`;
  }, [intensity, perspective]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg)`;
  }, [perspective]);

  return { ref, handleMouseMove, handleMouseLeave };
};

export default use3DTilt;
