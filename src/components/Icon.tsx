import React, { memo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * A tiny, self-contained 24px stroke icon set. Drawing these with react-native-svg
 * avoids shipping and linking an icon font just for ~20 glyphs, and keeps every
 * icon colour-driven by the theme.
 */

type Shape =
  | { kind: 'path'; d: string }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

const p = (d: string): Shape => ({ kind: 'path', d });
const c = (cx: number, cy: number, r: number): Shape => ({ kind: 'circle', cx, cy, r });
const r = (x: number, y: number, width: number, height: number, rx = 2): Shape => ({
  kind: 'rect', x, y, width, height, rx,
});

const ICONS = {
  home: [p('M3 9.5 12 2.5l9 7V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'), p('M9.5 22v-8h5v8')],
  list: [p('M8 6h13M8 12h13M8 18h13'), p('M3.5 6h.01M3.5 12h.01M3.5 18h.01')],
  settings: [p('M4 21v-6M4 11V3M12 21v-9M12 8V3M20 21v-4M20 13V3'), p('M1.5 15h5M9.5 8h5M17.5 17h5')],
  user: [p('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'), c(12, 7, 4)],
  mail: [r(2, 4.5, 20, 15, 3), p('M2.6 6.3 12 13l9.4-6.7')],
  calendar: [r(3, 4.5, 18, 17, 3), p('M16 2.5v4M8 2.5v4M3 10.5h18')],
  globe: [c(12, 12, 9.2), p('M2.8 12h18.4'), p('M12 2.8a14 14 0 0 1 3.6 9.2 14 14 0 0 1-3.6 9.2 14 14 0 0 1-3.6-9.2A14 14 0 0 1 12 2.8z')],
  search: [c(11, 11, 7.5), p('M21 21l-4.3-4.3')],
  close: [p('M18 6 6 18M6 6l12 12')],
  check: [p('M20 6.5 9.2 17.3 4 12.1')],
  chevronRight: [p('M9.5 18.5 16 12 9.5 5.5')],
  chevronDown: [p('M5.5 9 12 15.5 18.5 9')],
  image: [r(3, 3, 18, 18, 3), c(8.7, 8.7, 1.6), p('M21 15.5 16.2 10.7 5 21.5')],
  alert: [p('M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'), p('M12 9.5v4M12 17.2h.01')],
  inbox: [p('M22 12.5h-5.5l-1.7 3H9.2l-1.7-3H2'), p('M5.6 5.6 2 12.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6.5l-3.6-6.9A2 2 0 0 0 16.6 4.5H7.4a2 2 0 0 0-1.8 1.1z')],
  copy: [r(9, 9, 12.5, 12.5, 3), p('M5 15.5H4.2A2.2 2.2 0 0 1 2 13.3V4.7A2.2 2.2 0 0 1 4.2 2.5h8.6A2.2 2.2 0 0 1 15 4.7v.8')],
  sun: [c(12, 12, 4.6), p('M12 1.5v2.2M12 20.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M1.5 12h2.2M20.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6')],
  moon: [p('M21 12.9A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.9z')],
  smartphone: [r(5.5, 2, 13, 20, 3), p('M12 18.2h.01')],
  refresh: [p('M22 4.5v6h-6M2 19.5v-6h6'), p('M19.6 9.2A8.5 8.5 0 0 0 5.6 6L2 10.5m20 3-3.6 4.4A8.5 8.5 0 0 1 4.4 14.9')],
  trash: [p('M3.5 6h17M9 6V4.3a1.8 1.8 0 0 1 1.8-1.8h2.4A1.8 1.8 0 0 1 15 4.3V6'), p('M18.5 6v13.7a1.8 1.8 0 0 1-1.8 1.8H7.3a1.8 1.8 0 0 1-1.8-1.8V6')],
  swap: [p('M11 4.5H4.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V13'), p('M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z')],
  info: [c(12, 12, 9.2), p('M12 16.2v-4.4M12 8.2h.01')],
  arrowUp: [p('M12 19.5V5M5.5 11.5 12 5l6.5 6.5')],
  lock: [r(3.5, 10.5, 17, 11, 3), p('M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5')],
  shield: [p('M12 2.5 4 6v6c0 5 3.4 8.4 8 9.5 4.6-1.1 8-4.5 8-9.5V6z'), p('M9.2 12.2l2 2 3.6-3.8')],
  camera: [
    p('M4 8.3a2 2 0 0 1 2-2h1.3l1-1.7a2 2 0 0 1 1.8-1h3.8a2 2 0 0 1 1.8 1l1 1.7H18a2 2 0 0 1 2 2v9.2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z'),
    c(12, 13, 3.6),
  ],
  tag: [
    p('M20.5 11.4 12.6 3.5a2 2 0 0 0-1.4-.6H4.5A1.5 1.5 0 0 0 3 4.4v6.7c0 .5.2 1 .6 1.4l7.9 7.9a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8z'),
    c(8, 8, 1.6),
  ],
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
}

const IconComponent: React.FC<IconProps> = ({ name, size = 22, color, strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {ICONS[name].map((shape, index) => {
      const common = {
        stroke: color,
        strokeWidth,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
      };
      if (shape.kind === 'path') {
        return <Path key={index} d={shape.d} {...common} />;
      }
      if (shape.kind === 'circle') {
        return <Circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />;
      }
      return (
        <Rect
          key={index}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          {...common}
        />
      );
    })}
  </Svg>
);

export const Icon = memo(IconComponent);
