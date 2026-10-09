import { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

export type SoundSetupType = 'single' | 'double';

interface SpeakerChucheroProps {
  setup: SoundSetupType;
  size: 6 | 8 | 10 | 12;
  color: string;
  isVip: boolean;
  onOpenVipModal: () => void;
  onSelectSetup: (setup: SoundSetupType) => void;
  isDoubleUnlocked?: boolean;
  onRequestUnlockDouble?: () => void;
}

interface ConeDef {
  k: 'b' | 't';
  x: number;
  y: number;
  r: number;
  c: number;
}

const SPKM: Record<number, { w: number; h: number; d: ConeDef[] }> = {
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
};

export const SpeakerChuchero = ({
  setup,
  size,
  color,
  onOpenVipModal,
  onSelectSetup,
  isDoubleUnlocked,
  onRequestUnlockDouble,
}: SpeakerChucheroProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spkImg = new Image();
    spkImg.src = `/assets/spk/spk_${size}.webp`;

    let srcData: ImageData | null = null;
    let recCanvas: HTMLCanvasElement | null = null;
    let isDirty = true;
    let animId: number;

    const spkL = { b: 0, m: 0, t: 0 };
    const m = SPKM[size] || SPKM[6];

    if (setup === 'single') {
      canvas.width = m.w;
      canvas.height = m.h;
    } else {
      canvas.width = m.w * 2 + 24;
      canvas.height = m.h;
    }

    if (containerRef.current) {
      containerRef.current.style.setProperty('--sw', (0.45 + (0.55 * m.w) / SPKM[12].w).toFixed(4));
      containerRef.current.style.setProperty('--sc', (0.45 + (0.55 * m.h) / SPKM[12].h).toFixed(4));
    }

    const recolor = (hex: string) => {
      if (!spkImg.complete || !spkImg.naturalWidth) return;
      const W = spkImg.naturalWidth;
      const H = spkImg.naturalHeight;

      if (!srcData) {
        const o = document.createElement('canvas');
        o.width = W;
        o.height = H;
        const c = o.getContext('2d');
        if (!c) return;
        c.drawImage(spkImg, 0, 0);
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

    spkImg.onload = () => recolor(color);

    const drawChucheroUnit = (ox: number, oy: number) => {
      if (!recCanvas) return;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.drawImage(recCanvas, 0, 0);

      // Cones physical excursion
      for (const d of m.d) {
        const v = spkL[d.k];
        if (v <= 0) continue;

        const isBass = d.k === 'b';
        const s1 = 1 + v * (isBass ? 0.08 : 0.05);
        const s2 = 1 + v * (isBass ? 0.17 : 0.11);

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

        // Edge shadow
        const g = ctx.createRadialGradient(d.x, d.y, d.r * 0.55, d.x, d.y, d.r);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, `rgba(0,0,0,${0.34 * v})`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        // Highlight center cap
        const h = ctx.createRadialGradient(d.x - d.c * 0.3, d.y - d.c * 0.3, 0, d.x, d.y, d.c);
        h.addColorStop(0, `rgba(255,255,255,${0.2 * v})`);
        h.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = h;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.c, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const render = () => {
      animId = requestAnimationFrame(render);

      const levels = audioEngine.readAnalyser();
      const n = { b: levels.bass, m: levels.mid, t: levels.treble };

      for (const k in n) {
        const key = k as 'b' | 'm' | 't';
        const v = n[key];
        spkL[key] += (v - spkL[key]) * (v > spkL[key] ? 0.72 : 0.18);
        if (spkL[key] < 0.003) spkL[key] = 0;
      }

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (setup === 'single') {
        drawChucheroUnit(0, 0);
      } else {
        drawChucheroUnit(0, 0);
        drawChucheroUnit(m.w + 24, 0);
      }

      // Box vibration shake on heavy bass
      const sh = spkL.b * 2.4;
      canvas.style.transform =
        sh > 0.05
          ? `translate(${((Math.random() - 0.5) * sh).toFixed(2)}px, ${((Math.random() - 0.5) * sh).toFixed(2)}px)`
          : '';
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [setup, size, color]);

  const setups = [
    { id: 'single', name: '1 Chuchero', icon: '🔊' },
    { id: 'double', name: 'Kitipo Doble', icon: '🔊🔊' },
  ];

  return (
    <div className="w-full flex flex-col items-center my-2 max-w-[1376px] px-2.5">
      {/* Quick Setup Switcher */}
      <div className="w-full max-w-sm bg-neutral-950/80 border border-neutral-800 rounded-2xl p-1.5 mb-2 shadow-lg backdrop-blur-md flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 pl-2 text-[11px] font-bold text-neutral-400">
          <span>🔊</span>
          <span>CHUCHEROS:</span>
        </div>
        <div className="flex items-center gap-1">
          {setups.map((s) => {
            const isSelected = setup === s.id;
            const isDouble = s.id === 'double';
            const isLocked = isDouble && !isDoubleUnlocked;

            return (
              <button
                key={s.id}
                onClick={() => {
                  audioEngine.playBeep(2000, 0.03);
                  if (isLocked) {
                    onRequestUnlockDouble?.();
                  } else {
                    onSelectSetup(s.id as SoundSetupType);
                  }
                }}
                className={`py-1 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-all select-none cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : isLocked
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                }`}
                title={
                  isLocked
                    ? 'Poner los 2 chucheros ($1.11 USD o código gratis: 2020)'
                    : `Seleccionar ${s.name}`
                }
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
                {isLocked && (
                  <span className="text-[9px] bg-amber-500 text-black font-black px-1 py-0.2 rounded ml-0.5">
                    $1.11 / 2020
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={onOpenVipModal}
            className="py-1 px-2.5 rounded-xl text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
            title="Personalizar tamaños y funciones VIP"
          >
            ⚙️ {size}"
          </button>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="spk" id="spk" ref={containerRef}>
        <canvas
          ref={canvasRef}
          id="spkc"
          aria-label="Chuchero y Kitipo dominicano"
          className="max-w-full h-auto drop-shadow-2xl"
        />
      </div>
    </div>
  );
};
