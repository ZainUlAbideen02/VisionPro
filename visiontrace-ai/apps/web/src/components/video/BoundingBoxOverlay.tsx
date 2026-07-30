'use client';

import React from 'react';

export interface BoundingBoxItem {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x_min, y_min, x_max, y_max] normalized (0.0 to 1.0)
}

interface BoundingBoxOverlayProps {
  isVisible: boolean;
  detectedObjects?: BoundingBoxItem[];
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  isVisible,
  detectedObjects = [
    { label: 'Terminal Window', confidence: 0.94, bbox: [0.12, 0.15, 0.88, 0.82] },
    { label: 'Code Editor', confidence: 0.88, bbox: [0.18, 0.22, 0.82, 0.76] },
    { label: 'Status Badge', confidence: 0.91, bbox: [0.72, 0.08, 0.95, 0.18] }
  ]
}) => {
  if (!isVisible || !detectedObjects || detectedObjects.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <svg className="w-full h-full">
        {detectedObjects.map((obj, index) => {
          const [xMin, yMin, xMax, yMax] = obj.bbox;
          const leftPct = `${xMin * 100}%`;
          const topPct = `${yMin * 100}%`;
          const widthPct = `${(xMax - xMin) * 100}%`;
          const heightPct = `${(yMax - yMin) * 100}%`;

          const colorScheme = index % 2 === 0 ? '#00EB8D' : '#5B6CFF';

          return (
            <g key={index}>
              {/* Glowing Bounding Rectangle */}
              <rect
                x={leftPct}
                y={topPct}
                width={widthPct}
                height={heightPct}
                fill={`${colorScheme}15`}
                stroke={colorScheme}
                strokeWidth="2.5"
                rx="6"
                className="transition-all duration-300 animate-pulse"
                style={{
                  filter: `drop-shadow(0 0 8px ${colorScheme}80)`
                }}
              />

              {/* Floating Detection Badge */}
              <foreignObject x={leftPct} y={`calc(${topPct} - 28px)`} width="220" height="32">
                <div 
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-pill text-[10px] font-mono font-bold text-black shadow-lg w-fit transition-transform transform hover:scale-105"
                  style={{ backgroundColor: colorScheme }}
                >
                  <span>{obj.label}</span>
                  <span className="bg-black/20 text-black px-1.5 py-0.2 rounded-pill font-mono">
                    {Math.round(obj.confidence * 100)}%
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
