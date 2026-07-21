import { useEffect, useRef, useState } from 'react';
import styles from './LoadingIndicator.module.css';

export interface LoadingIndicatorProps {
  size?: number;
}

/**
 * MD3 Expressive Loading Indicator — a shape-morphing blob that interpolates
 * between MD3 expressive shapes (pill → circle → scallop → clover → pentagon).
 * Uses requestAnimationFrame for smooth point interpolation since CSS d:path()
 * animation isn't universally supported.
 */

// Each shape: 8 points around a 64x64 viewbox center (32,32)
const SHAPES: Array<Array<[number, number]>> = [
  // circle
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return [32 + Math.cos(a) * 24, 32 + Math.sin(a) * 24] as [number, number];
  }),
  // scallop (alternating radius)
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const r = i % 2 === 0 ? 26 : 18;
    return [32 + Math.cos(a) * r, 32 + Math.sin(a) * r] as [number, number];
  }),
  // pentagon-ish (5-point feel using 8 vertices)
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = 25 + Math.cos(a * 2) * 3;
    return [32 + Math.cos(a) * r, 32 + Math.sin(a) * r] as [number, number];
  }),
  // clover (4 lobes)
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const r = 18 + Math.abs(Math.cos(a * 2)) * 10;
    return [32 + Math.cos(a) * r, 32 + Math.sin(a) * r] as [number, number];
  }),
];

function makePath(points: Array<[number, number]>) {
  // Quadratic spline through midpoints for smooth, organic shapes
  const pts = points;
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const midX = (cur[0] + next[0]) / 2;
    const midY = (cur[1] + next[1]) / 2;
    if (i === 0) d += `M ${midX} ${midY} `;
    else d += `Q ${cur[0]} ${cur[1]} ${midX} ${midY} `;
  }
  d += `Q ${pts[0][0]} ${pts[0][1]} ${(pts[0][0] + pts[1][0]) / 2} ${(pts[0][1] + pts[1][1]) / 2}`;
  d += ' Z';
  return d;
}

export function LoadingIndicator({ size = 48 }: LoadingIndicatorProps) {
  const [path, setPath] = useState(() => makePath(SHAPES[0]));

  useEffect(() => {
    let raf = 0;
    const PERIOD = 4000; // ms per full cycle through all shapes
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) {
        start = now;
      }
      const elapsed = now - start;
      const t = (elapsed % PERIOD) / PERIOD; // 0..1 (always positive and >= 0)
      const idx = t * SHAPES.length;
      const a = Math.floor(idx) % SHAPES.length;
      const b = (a + 1) % SHAPES.length;
      const k = idx - Math.floor(idx);
      const interp = SHAPES[a].map((p, i) => [
        p[0] + (SHAPES[b][i][0] - p[0]) * k,
        p[1] + (SHAPES[b][i][1] - p[1]) * k,
      ] as [number, number]);
      setPath(makePath(interp));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className={styles.loader} style={{ width: size, height: size }} role="progressbar" aria-label="Loading">
      <svg className={styles.svg} viewBox="0 0 64 64">
        <path className={styles.blob} d={path} />
      </svg>
    </span>
  );
}
