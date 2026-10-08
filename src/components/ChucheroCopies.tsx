import { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';
import type { TweeterType } from '../types/radio';

interface ChucheroVariantProps {
  size: 6 | 8 | 10 | 12;
  color: string;
  tweeterType: TweeterType;
  variant: 'classic' | 'dual-tweet' | 'triple-tweet' | 'power' | 'midrange';
  isPlaying?: boolean;
}

interface ConeDef {
  k: 'b' | 't' | 'm';
  x: number;
  y: number;
  r: number;
  c: number;
}

// Different speaker cone configurations for each variant
const SPEAKER_VARIANTS: Record<string, Record<number, { w: number; h: number; d: ConeDef[] }>> = {
  classic: {
    6: {
      w: 277,
      h: 705,
      d: [
        { k: 'b', x: 138, y: 140, r: 116, c: 58 },
        { k: 'b', x: 138, y: 562, r: 116, c: 58 },
        { k: 't', x: 139, y: 351, r: 67, c: 30 },
      ],
    },
    8: {
      w: 336,
      h: 825,
      d: [
        { k: 'b', x: 168, y: 169, r: 141, c: 70 },
        { k: 'b', x: 168, y: 654, r: 141, c: 70 },
        { k: 't', x: 98, y: 412, r: 67, c: 30 },
        { k: 't', x: 240, y: 412, r: 67, c: 30 },
      ],
    },
    10: {
      w: 386,
      h: 947,
      d: [
        { k: 'b', x: 193, y: 194, r: 162, c: 81 },
        { k: 'b', x: 193, y: 751, r: 162, c: 81 },
        { k: 't', x: 107, y: 475, r: 67, c: 30 },
        { k: 't', x: 281, y: 475, r: 67, c: 30 },
      ],
    },
    12: {
      w: 502,
      h: 1176,
      d: [
        { k: 'b', x: 251, y: 253, r: 211, c: 106 },
        { k: 'b', x: 251, y: 921, r: 211, c: 106 },
        { k: 't', x: 107, y: 588, r: 67, c: 30 },
        { k: 't', x: 249, y: 588, r: 67, c: 30 },
        { k: 't', x: 391, y: 588, r: 67, c: 30 },
      ],
    },
  },
  'dual-tweet': {
    6: {
      w: 277,
      h: 705,
      d: [
        { k: 'b', x: 138, y: 180, r: 110, c: 55 },
        { k: 'b', x: 138, y: 520, r: 110, c: 55 },
        { k: 'm', x: 100, y: 351, r: 50, c: 25 },
        { k: 'm', x: 178, y: 351, r: 50, c: 25 },
      ],
    },
    8: {
      w: 336,
      h: 825,
      d: [
        { k: 'b', x: 168, y: 169, r: 135, c: 67 },
        { k: 'b', x: 168, y: 654, r: 135, c: 67 },
        { k: 'm', x: 100, y: 412, r: 60, c: 30 },
        { k: 'm', x: 236, y: 412, r: 60, c: 30 },
      ],
    },
    10: {
      w: 386,
      h: 947,
      d: [
        { k: 'b', x: 193, y: 194, r: 155, c: 78 },
        { k: 'b', x: 193, y: 751, r: 155, c: 78 },
        { k: 'm', x: 110, y: 475, r: 65, c: 32 },
        { k: 'm', x: 278, y: 475, r: 65, c: 32 },
      ],
    },
    12: {
      w: 502,
      h: 1176,
      d: [
        { k: 'b', x: 251, y: 253, r: 200, c: 100 },
        { k: 'b', x: 251, y: 921, r: 200, c: 100 },
        { k: 'm', x: 120, y: 588, r: 75, c: 37 },
        { k: 'm', x: 382, y: 588, r: 75, c: 37 },
      ],
    },
  },
  'triple-tweet': {
    6: {
      w: 277,
      h: 705,
      d: [
        { k: 'b', x: 138, y: 150, r: 100, c: 50 },
        { k: 'b', x: 138, y: 550, r: 100, c: 50 },
        { k: 't', x: 80, y: 351, r: 45, c: 22 },
        { k: 't', x: 139, y: 351, r: 45, c: 22 },
        { k: 't', x: 198, y: 351, r: 45, c: 22 },
      ],
    },
    8: {
      w: 336,
      h: 825,
      d: [
        { k: 'b', x: 168, y: 169, r: 125, c: 62 },
        { k: 'b', x: 168, y: 654, r: 125, c: 62 },
        { k: 't', x: 70, y: 412, r: 50, c: 25 },
        { k: 't', x: 168, y: 412, r: 50, c: 25 },
        { k: 't', x: 266, y: 412, r: 50, c: 25 },
      ],
    },
    10: {
      w: 386,
      h: 947,
      d: [
        { k: 'b', x: 193, y: 194, r: 145, c: 72 },
        { k: 'b', x: 193, y: 751, r: 145, c: 72 },
        { k: 't', x: 75, y: 475, r: 55, c: 27 },
        { k: 't', x: 193, y: 475, r: 55, c: 27 },
        { k: 't', x: 311, y: 475, r: 55, c: 27 },
      ],
    },
    12: {
      w: 502,
      h: 1176,
      d: [
        { k: 'b', x: 251, y: 253, r: 190, c: 95 },
        { k: 'b', x: 251, y: 921, r: 190, c: 95 },
        { k: 't', x: 100, y: 588, r: 60, c: 30 },
        { k: 't', x: 251, y: 588, r: 60, c: 30 },
        { k: 't', x: 402, y: 588, r: 60, c: 30 },
      ],
    },
  },
  power: {
    6: {
      w: 277,
      h: 705,
      d: [
        { k: 'b', x: 80, y: 120, r: 105, c: 52 },
        { k: 'b', x: 138, y: 300, r: 105, c: 52 },
        { k: 'b', x: 196, y: 480, r: 105, c: 52 },
        { k: 'b', x: 138, y: 640, r: 105, c: 52 },
        { k: 't', x: 139, y: 351, r: 60, c: 30 },
      ],
    },
    8: {
      w: 336,
      h: 825,
      d: [
        { k: 'b', x: 100, y: 150, r: 130, c: 65 },
        { k: 'b', x: 168, y: 330, r: 130, c: 65 },
        { k: 'b', x: 236, y: 510, r: 130, c: 65 },
        { k: 'b', x: 168, y: 690, r: 130, c: 65 },
        { k: 't', x: 168, y: 412, r: 65, c: 32 },
      ],
    },
    10: {
      w: 386,
      h: 947,
      d: [
        { k: 'b', x: 120, y: 180, r: 150, c: 75 },
        { k: 'b', x: 193, y: 380, r: 150, c: 75 },
        { k: 'b', x: 266, y: 580, r: 150, c: 75 },
        { k: 'b', x: 193, y: 780, r: 150, c: 75 },
        { k: 't', x: 193, y: 475, r: 70, c: 35 },
      ],
    },
    12: {
      w: 502,
      h: 1176,
      d: [
        { k: 'b', x: 150, y: 220, r: 185, c: 92 },
        { k: 'b', x: 251, y: 460, r: 185, c: 92 },
        { k: 'b', x: 352, y: 700, r: 185, c: 92 },
        { k: 'b', x: 251, y: 940, r: 185, c: 92 },
        { k: 't', x: 251, y: 588, r: 80, c: 40 },
      ],
    },
  },
  midrange: {
    6: {
      w: 277,
      h: 705,
      d: [
        { k: 'b', x: 138, y: 140, r: 108, c: 54 },
        { k: 'b', x: 138, y: 562, r: 108, c: 54 },
        { k: 'm', x: 90, y: 280, r: 55, c: 27 },
        { k: 'm', x: 186, y: 280, r: 55, c: 27 },
        { k: 'm', x: 90, y: 420, r: 55, c: 27 },
        { k: 'm', x: 186, y: 420, r: 55, c: 27 },
      ],
    },
    8: {
      w: 336,
      h: 825,
      d: [
        { k: 'b', x: 168, y: 169, r: 133, c: 66 },
        { k: 'b', x: 168, y: 654, r: 133, c: 66 },
        { k: 'm', x: 110, y: 330, r: 65, c: 32 },
        { k: 'm', x: 226, y: 330, r: 65, c: 32 },
        { k: 'm', x: 110, y: 495, r: 65, c: 32 },
        { k: 'm', x: 226, y: 495, r: 65, c: 32 },
      ],
    },
    10: {
      w: 386,
      h: 947,
      d: [
        { k: 'b', x: 193, y: 194, r: 158, c: 79 },
        { k: 'b', x: 193, y: 751, r: 158, c: 79 },
        { k: 'm', x: 130, y: 380, r: 70, c: 35 },
        { k: 'm', x: 256, y: 380, r: 70, c: 35 },
        { k: 'm', x: 130, y: 570, r: 70, c: 35 },
        { k: 'm', x: 256, y: 570, r: 70, c: 35 },
      ],
    },
    12: {
      w: 502,
      h: 1176,
      d: [
        { k: 'b', x: 251, y: 253, r: 205, c: 102 },
        { k: 'b', x: 251, y: 921, r: 205, c: 102 },
        { k: 'm', x: 155, y: 465, r: 80, c: 40 },
        { k: 'm', x: 347, y: 465, r: 80, c: 40 },
        { k: 'm', x: 155, y: 710, r: 80, c: 40 },
        { k: 'm', x: 347, y: 710, r: 80, c: 40 },
      ],
    },
  },
};

export const ChucheroCopies = ({
  size,
  color,
  tweeterType,
  variant,
  isPlaying = false,
}: ChucheroVariantProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const variantSpecs = SPEAKER_VARIANTS[variant] || SPEAKER_VARIANTS.classic;
    const m = variantSpecs[size] || variantSpecs[6];
    canvas.width = m.w;
    canvas.height = m.h;

    if (containerRef.current) {
      const classicSpecs = SPEAKER_VARIANTS.classic;
      const classicModel = classicSpecs[12];
      containerRef.current.style.setProperty('--sw', (0.45 + (0.55 * m.w) / classicModel.w).toFixed(4));
      containerRef.current.style.setProperty('--sc', (0.45 + (0.55 * m.h) / classicModel.h).toFixed(4));
    }

    const img = new Image();
    img.src = `/assets/spk/spk_${size}.webp`;

    let srcData: ImageData | null = null;
    let recCanvas: HTMLCanvasElement | null = null;
    let isDirty = true;
    let animId: number | null = null;
    let lastFrameAt = 0;

    const spkL = { b: 0, m: 0, t: 0 };

    const recolor = (hex: string) => {
      if (!img.complete || !img.naturalWidth) return;
      const W = img.naturalWidth;
      const H = img.naturalHeight;

      if (!srcData) {
        const o = document.createElement('canvas');
        o.width = W;
        o.height = H;
        const c = o.getContext('2d');
        if (!c) return;
        c.drawImage(img, 0, 0);
        srcData = c.getImageData(0, 0, W, H);
      }

      if (!recCanvas) {
        recCanvas = document.createElement('canvas');
        recCanvas.width = W;
        recCanvas.height = H;
      }

      const T = [
        parseInt(hex.slice(1, 3), 16) || 0,
        parseInt(hex.slice(3, 5), 16) || 0,
        parseInt(hex.slice(5, 7), 16) || 0,
      ];

      const d = new Uint8ClampedArray(srcData.data);
      const SPKREF = 185;

      for (let p = 0; p < d.length; p += 4) {
        const r = d[p];
        const g = d[p + 1];
        const b = d[p + 2];
        if (d[p + 3] > 0 && b > r + 30 && b > g * 1.08) {
          const sat = (b - r) / b;
          const w = Math.min(1, (sat - 0.25) / 0.3);
          if (w > 0) {
            const k = Math.min(1.12, b / SPKREF);
            d[p] += (Math.min(255, T[0] * k) - r) * w;
            d[p + 1] += (Math.min(255, T[1] * k) - g) * w;
            d[p + 2] += (Math.min(255, T[2] * k) - b) * w;
          }
        }
      }

      const recCtx = recCanvas.getContext('2d');
      if (recCtx) {
        recCtx.putImageData(new ImageData(d, W, H), 0, 0);
        isDirty = true;
      }
    };

    img.onload = () => {
      recolor(color);
      startAnimation();
    };

    const render = (timestamp: number) => {
      animId = null;
      if (!recCanvas) return;

      if (timestamp - lastFrameAt < 1000 / 30) {
        if (audioEngine.isVisualizationActive() || spkL.b > 0.004 || spkL.m > 0.004 || spkL.t > 0.004 || isDirty) {
          animId = requestAnimationFrame(render);
        }
        return;
      }
      lastFrameAt = timestamp;

      const isActive = audioEngine.isVisualizationActive();
      const levels = audioEngine.readAnalyser();
      const tweeterLevel =
        tweeterType === 'fenolico'
          ? levels.mid
          : tweeterType === 'super'
            ? Math.min(1, levels.treble * 0.72 + levels.mid * 0.4)
            : levels.treble;
      const n = { b: levels.bass, m: levels.mid, t: tweeterLevel };

      let act = isDirty;
      let hasMotion = false;
      for (const k in n) {
        const key = k as 'b' | 'm' | 't';
        const v = n[key];
        spkL[key] += (v - spkL[key]) * (v > spkL[key] ? 0.7 : 0.16);
        if (spkL[key] < 0.004) {
          spkL[key] = 0;
        } else {
          act = true;
        }
        hasMotion ||= spkL[key] > 0;
      }

      if (act) {
        isDirty = false;

        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(recCanvas, 0, 0);

        for (const d of m.d) {
          const v = spkL[d.k];
          if (v <= 0) continue;

          const isBass = d.k === 'b';
          const s1 = 1 + v * (isBass ? 0.075 : 0.05);
          const s2 = 1 + v * (isBass ? 0.16 : 0.11);

          const zoom = (R: number, s: number) => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(d.x, d.y, R, 0, Math.PI * 2);
            ctx.clip();
            ctx.translate(d.x, d.y);
            ctx.scale(s, s);
            ctx.translate(-d.x, -d.y);
            ctx.drawImage(recCanvas!, 0, 0);
            ctx.restore();
          };

          zoom(d.r, s1);
          zoom(d.c, s2);

          const g = ctx.createRadialGradient(d.x, d.y, d.r * 0.55, d.x, d.y, d.r);
          g.addColorStop(0, 'rgba(0,0,0,0)');
          g.addColorStop(1, `rgba(0,0,0,${0.34 * v})`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();

          const h = ctx.createRadialGradient(d.x - d.c * 0.3, d.y - d.c * 0.3, 0, d.x, d.y, d.c);
          h.addColorStop(0, `rgba(255,255,255,${0.2 * v})`);
          h.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = h;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.c, 0, Math.PI * 2);
          ctx.fill();
        }

        const sh = spkL.b * 2.4;
        canvas.style.transform =
          sh > 0.05
            ? `translate(${((Math.random() - 0.5) * sh).toFixed(2)}px, ${((Math.random() - 0.5) * sh).toFixed(2)}px)`
            : '';
      }

      if (isActive || hasMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    const startAnimation = () => {
      if (animId === null) animId = requestAnimationFrame(render);
    };

    const handlePlaybackChange = () => {
      if (audioEngine.isVisualizationActive() || spkL.b > 0.004 || spkL.m > 0.004 || spkL.t > 0.004) {
        startAnimation();
      }
    };

    audioEngine.audio.addEventListener('play', handlePlaybackChange);
    audioEngine.audio.addEventListener('pause', handlePlaybackChange);
    audioEngine.audio.addEventListener('ended', handlePlaybackChange);
    audioEngine.audio.addEventListener('visualchange', handlePlaybackChange);

    return () => {
      audioEngine.audio.removeEventListener('play', handlePlaybackChange);
      audioEngine.audio.removeEventListener('pause', handlePlaybackChange);
      audioEngine.audio.removeEventListener('ended', handlePlaybackChange);
      audioEngine.audio.removeEventListener('visualchange', handlePlaybackChange);
      if (animId !== null) cancelAnimationFrame(animId);
    };
  }, [size, color, tweeterType, variant]);

  return (
    <div className="spk" ref={containerRef}>
      <canvas
        ref={canvasRef}
        aria-label={`Chuchero ${variant} con bocinas personalizadas`}
      />
    </div>
  );
};

export default ChucheroCopies;
