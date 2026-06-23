import { useEffect, useState } from 'react';

interface UseMouseParallaxOptions {
  speed?: number;
}

export const useMouseParallax = (speed: number = 0.05) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * speed;
      const y = (e.clientY - window.innerHeight / 2) * speed;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [speed]);

  return offset;
};

export default useMouseParallax;
