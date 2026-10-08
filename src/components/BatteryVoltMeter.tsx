import { useEffect, useState, useMemo } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface BatteryVoltMeterProps {
  isOn: boolean;
  baseVoltage?: number; // 12.6 or 14.4
}

const VSEG: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abdeg',
  '3': 'abcdg',
  '4': 'bcfg',
  '5': 'acdfg',
  '6': 'acdefg',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
  ' ': '',
};

export const BatteryVoltMeter = ({ isOn, baseVoltage = 12.6 }: BatteryVoltMeterProps) => {
  const [voltage, setVoltage] = useState(baseVoltage);

  useEffect(() => {
    if (!isOn) return;

    let curV = baseVoltage;
    const interval = setInterval(() => {
      const { avgBass } = audioEngine.readAnalyser();
      const target = baseVoltage - 2.4 * Math.pow(avgBass, 1.4) + (Math.random() - 0.5) * 0.05;
      curV += (target - curV) * (target < curV ? 0.6 : 0.15);
      setVoltage(Math.max(9.5, Math.min(15.5, curV)));
    }, 70);

    return () => clearInterval(interval);
  }, [isOn, baseVoltage]);

  const str = useMemo(() => {
    if (!isOn) return '    ';
    const x = voltage.toFixed(1);
    return x.length < 4 ? ' ' + x : x;
  }, [voltage, isOn]);

  // Shapes for 7 segments
  const W = 28;
  const H = 50;
  const T = 6;
  const G = 1.6;

  const hz = (x1: number, x2: number, y: number) => [
    [x1, y],
    [x1 + T / 2, y - T / 2],
    [x2 - T / 2, y - T / 2],
    [x2, y],
    [x2 - T / 2, y + T / 2],
    [x1 + T / 2, y + T / 2],
  ];

  const vt = (x: number, y1: number, y2: number) => [
    [x, y1],
    [x + T / 2, y1 + T / 2],
    [x + T / 2, y2 - T / 2],
    [x, y2],
    [x - T / 2, y2 - T / 2],
    [x - T / 2, y1 + T / 2],
  ];

  const shapes: Record<string, number[][]> = {
    a: hz(T / 2 + G, W - T / 2 - G, T / 2),
    g: hz(T / 2 + G, W - T / 2 - G, H / 2),
    d: hz(T / 2 + G, W - T / 2 - G, H - T / 2),
    f: vt(T / 2, T / 2 + G, H / 2 - G),
    b: vt(W - T / 2, T / 2 + G, H / 2 - G),
    e: vt(T / 2, H / 2 + G, H - T / 2 - G),
    c: vt(W - T / 2, H / 2 + G, H - T / 2 - G),
  };

  const digits = [str[0] || ' ', str[1] || ' ', str[3] || ' '];
  const offsets = [0, 34, 76];

  return (
    <div className="vmp">
      <div className="vmh" title="Voltímetro digital del sistema de car audio">
        <svg
          id="vms"
          className={isOn ? '' : 'off'}
          viewBox="0 0 112 52"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(8,1) skewX(-6)">
            {digits.map((ch, idx) => {
              const ox = offsets[idx];
              const lit = VSEG[ch] || '';
              return (
                <g key={idx}>
                  {Object.entries(shapes).map(([k, pts]) => {
                    const isLit = isOn && lit.includes(k);
                    const ptsStr = pts.map((p) => `${p[0] + ox},${p[1]}`).join(' ');
                    return (
                      <polygon
                        key={k}
                        points={ptsStr}
                        className={isLit ? 'vl' : 'vo'}
                      />
                    );
                  })}
                </g>
              );
            })}
            {/* Decimal point dot */}
            <circle
              cx={68}
              cy={H - 3}
              r={3.2}
              className={isOn ? 'vl' : 'vo'}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
