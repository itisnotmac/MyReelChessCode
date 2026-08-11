import React, { useState, useEffect, useRef } from 'react';

const MODULE_ICONS = ['♙', '♞', '♛'];
const MODULE_COUNT = 3;
const ANGLE_PER_MODULE = 360 / MODULE_COUNT;

/**
 * Invisible 3D sphere / carousel with module cards floating around the Y axis.
 * Drag to rotate, tap a card to select that module.
 * Responsive radius scales up on tablet / desktop.
 */
export default function LessonSphere({ sections, onSelect, getSectionProgress }) {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [radius, setRadius] = useState(130);
  const rotationRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startRotation: 0, moved: false });

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w >= 1024) setRadius(260);
      else if (w >= 768) setRadius(190);
      else setRadius(130);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  const handlePointerDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX, startRotation: rotationRef.current, moved: false };
    setIsAnimating(false);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 4) dragRef.current.moved = true;
    const newRotation = dragRef.current.startRotation + delta * 0.6;
    rotationRef.current = newRotation;
    setRotation(newRotation);
  };

  const handlePointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsAnimating(true);
    const nearest = Math.round(rotationRef.current / ANGLE_PER_MODULE) * ANGLE_PER_MODULE;
    rotationRef.current = nearest;
    setRotation(nearest);
  };

  const handleModuleClick = (index) => {
    if (dragRef.current.moved) return;
    onSelect(index);
  };

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: `${radius * 2 + 80}px` }}>
      <div
        style={{ perspective: `${radius * 3.5}px`, touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="relative"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: isAnimating ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          }}
        >
          {sections.map((section, i) => {
            const worldAngle = ((i * ANGLE_PER_MODULE + rotation) % 360 + 360) % 360;
            const cos = Math.cos(worldAngle * Math.PI / 180);
            const opacity = Math.max(0.15, cos * 0.5 + 0.5);
            const scale = 0.75 + 0.25 * Math.max(0, cos);
            const sp = getSectionProgress(section);
            const isFront = cos > 0.5;

            return (
              <div
                key={section.name}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotateY(${i * ANGLE_PER_MODULE}deg) translateZ(${radius}px)` }}
              >
                <button
                  onClick={() => handleModuleClick(i)}
                  className="rcu-glow flex flex-col items-center gap-2 px-5 py-6 rounded-2xl border backdrop-blur-md transition-colors cursor-pointer"
                  style={{
                    width: `${radius * 1.5}px`,
                    borderColor: isFront ? 'rgba(58,175,169,0.4)' : 'rgba(255,255,255,0.1)',
                    backgroundColor: isFront ? 'rgba(58,175,169,0.1)' : 'rgba(0,0,0,0.4)',
                    opacity,
                    transform: `scale(${scale})`,
                  }}
                >
                  <span className="text-3xl text-[#3AAFA9]">{MODULE_ICONS[i]}</span>
                  <p className="text-base font-bold tracking-[0.15em] uppercase text-white/90" style={{ fontFamily: "'Old Standard TT', serif" }}>
                    {section.name}
                  </p>
                  <p className="text-[10px] text-white/40 text-center leading-relaxed px-2">{section.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 w-14 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${sp.percent}%`, background: 'linear-gradient(90deg, #3AAFA9, #A8E6E3)' }} />
                    </div>
                    <span className="text-[9px] text-white/30">{sp.done}/{sp.total}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[10px] text-white/20 mt-4 tracking-wider">drag to rotate · tap to enter</p>
    </div>
  );
}