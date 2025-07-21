import React, { useState, useRef, useEffect } from 'react';
import '../styles/BottomSheet.css';

const snapPoints = {
  closed: 100,
  half: window.innerHeight / 2,
  full: window.innerHeight - 80,
};

function BottomSheet() {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const startTop = useRef(0);
  const animationRef = useRef(null);
  const [currentTop, setCurrentTop] = useState(snapPoints.closed);

  const getClosestSnap = (position) => {
    const values = Object.values(snapPoints);
    return values.reduce((prev, curr) =>
      Math.abs(curr - position) < Math.abs(prev - position) ? curr : prev
    );
  };

  const animateTo = (target) => {
    cancelAnimationFrame(animationRef.current);
    const stiffness = 0.2;
    const damping = 0.7;
    let velocity = 0;

    const step = () => {
      const dist = target - currentTop;
      velocity = velocity * damping + dist * stiffness;
      const newTop = currentTop + velocity;

      if (Math.abs(dist) < 0.5 && Math.abs(velocity) < 0.5) {
        setCurrentTop(target);
        return;
      }

      setCurrentTop(newTop);
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  };

  const handleDragStart = (e) => {
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    startTop.current = currentTop;
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragging);
    document.addEventListener('touchend', handleDragEnd);
  };

  const handleDragging = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = clientY - startY.current;
    const newTop = Math.min(Math.max(startTop.current + delta, snapPoints.closed), snapPoints.full);
    setCurrentTop(newTop);
  };

  const handleDragEnd = () => {
    const snapTo = getClosestSnap(currentTop);
    animateTo(snapTo);
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragging);
    document.removeEventListener('touchend', handleDragEnd);
  };

  const snapTo = (point) => animateTo(snapPoints[point]);

  useEffect(() => {
    sheetRef.current.style.top = `${currentTop}px`;
  }, [currentTop]);

  return (
    <>
      <div className="bottom-sheet" ref={sheetRef}>
        <div className="sheet-header">
          <div
            className="drag-handle"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          />
          <div className="header-buttons">
            <button onClick={() => snapTo('closed')}>Close</button>
            <button onClick={() => snapTo('half')}>Half</button>
            <button onClick={() => snapTo('full')}>Open</button>
          </div>
        </div>
        <div className="sheet-content">
          <h2>🎉 Welcome to Bottom Sheet</h2>
          <p>This is a sample content area that adjusts based on the snap point.</p>
          <p>Try dragging the handle or using the buttons above to test transitions.</p>
          <p>Make sure everything is visible and responsive across devices.</p>
          <p>🔧 Fully customizable and built with pure React!</p>
        </div>
      </div>
    </>
  );
}

export default BottomSheet;