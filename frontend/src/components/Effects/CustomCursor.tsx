import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clickPos, setClickPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePos = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleClick = (e: MouseEvent) => {
      setClickPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => setClickPos({ x: -100, y: -100 }), 500);
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    document.addEventListener('mousemove', updatePos);
    document.addEventListener('click', handleClick);
    document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      document.removeEventListener('mousemove', updatePos);
      document.removeEventListener('click', handleClick);
    };
  }, [isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <>
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-200 ease-out"
        style={{
          left: pos.x - 12,
          top: pos.y - 12,
          width: isHovering ? 40 : 24,
          height: isHovering ? 40 : 24,
          borderRadius: '50%',
          border: '2px solid rgba(102, 126, 234, 0.5)',
          background: 'rgba(102, 126, 234, 0.1)',
          transform: `scale(${isHovering ? 1.5 : 1})`,
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.3s, height 0.3s, opacity 0.3s, transform 0.3s',
        }}
      />
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: pos.x - 2,
          top: pos.y - 2,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#00f5ff',
          boxShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
      {clickPos.x > 0 && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: clickPos.x - 15,
            top: clickPos.y - 15,
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '2px solid rgba(0, 245, 255, 0.5)',
            animation: 'clickRipple 0.5s ease-out forwards',
          }}
        />
      )}
      <style>{`
        @keyframes clickRipple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
