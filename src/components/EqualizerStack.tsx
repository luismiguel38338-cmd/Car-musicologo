import React, { useRef } from 'react';
import { EqUnitState } from '../types/radio';
import { audioEngine, BANDS } from '../utils/audioEngine';

interface EqualizerStackProps {
  units: EqUnitState[];
  isOn: boolean;
  onUnitsChange: (updated: EqUnitState[]) => void;
  onOverlayMsg: (msg: string) => void;
}

interface KnobConfig {
  id: string;
  lab: string;
  d: number;
  min: number;
  max: number;
  step: number;
  isBipolar: boolean;
  format: (val: number) => string;
}

export const EqualizerStack = ({
  units,
  isOn,
  onUnitsChange,
  onOverlayMsg,
}: EqualizerStackProps) => {
  const dragRef = useRef<{
    unitIdx: number;
    paramId: string;
    startY: number;
    startVal: number;
    min: number;
    max: number;
    step: number;
    format: (v: number) => string;
    lab: string;
  } | null>(null);

  const knobConfigs: KnobConfig[] = [
    {
      id: 'sub',
      lab: 'SUB LEVEL',
      d: 9.65,
      min: -12,
      max: 12,
      step: 0.5,
      isBipolar: true,
      format: (x) => (x > 0 ? '+' : '') + Math.round((x / 12) * 100) + '%',
    },
    {
      id: 'vol',
      lab: 'VOLUME',
      d: 9.55,
      min: 0,
      max: 1,
      step: 0.01,
      isBipolar: false,
      format: (x) => Math.round(x * 150) + '%',
    },
    // AUX S/W is rendered as special switch
    {
      id: 'fader',
      lab: 'FADER',
      d: 7.3,
      min: -12,
      max: 12,
      step: 0.5,
      isBipolar: true,
      format: (x) => (x === 0 ? 'CENTRO' : (x > 0 ? 'F' : 'R') + Math.round((Math.abs(x) / 12) * 100) + '%'),
    },
    ...BANDS.map((b, i) => ({
      id: 'b' + i,
      lab: b[0],
      d: 7.25,
      min: -12,
      max: 12,
      step: 0.5,
      isBipolar: true,
      format: (x: number) => (x > 0 ? '+' : '') + x.toFixed(1) + 'dB',
    })),
  ];

  const handlePointerDown = (
    e: React.PointerEvent,
    unitIdx: number,
    cfg: KnobConfig
  ) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      unitIdx,
      paramId: cfg.id,
      startY: e.clientY,
      startVal: units[unitIdx].vals[cfg.id] ?? (cfg.id === 'vol' ? 0.72 : 0),
      min: cfg.min,
      max: cfg.max,
      step: cfg.step,
      format: cfg.format,
      lab: cfg.lab,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { unitIdx, paramId, startY, startVal, min, max, step, format, lab } = dragRef.current;
    const dy = startY - e.clientY;
    const range = max - min;
    const rawVal = startVal + (dy / 120) * range;
    const stepped = Math.min(max, Math.max(min, Math.round(rawVal / step) * step));

    if (stepped !== units[unitIdx].vals[paramId]) {
      const copy = [...units];
      copy[unitIdx] = {
        ...copy[unitIdx],
        vals: {
          ...copy[unitIdx].vals,
          [paramId]: stepped,
        },
      };
      onUnitsChange(copy);
      audioEngine.applyUnits(copy);
      onOverlayMsg(`${lab} ${format(stepped)}`);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      dragRef.current = null;
    }
  };

  const handleWheel = (
    e: React.WheelEvent,
    unitIdx: number,
    cfg: KnobConfig
  ) => {
    e.preventDefault();
    const dir = e.deltaY < 0 ? 1 : -1;
    const curVal = units[unitIdx].vals[cfg.id] ?? (cfg.id === 'vol' ? 0.72 : 0);
    const stepped = Math.min(cfg.max, Math.max(cfg.min, curVal + dir * cfg.step * 2));
    if (stepped !== curVal) {
      const copy = [...units];
      copy[unitIdx] = {
        ...copy[unitIdx],
        vals: {
          ...copy[unitIdx].vals,
          [cfg.id]: stepped,
        },
      };
      onUnitsChange(copy);
      audioEngine.applyUnits(copy);
      audioEngine.playBeep(1800 + stepped * 15, 0.02);
      onOverlayMsg(`${cfg.lab} ${cfg.format(stepped)}`);
    }
  };

  const handleClickKnob = (
    e: React.MouseEvent,
    unitIdx: number,
    cfg: KnobConfig
  ) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const isTop = clickY < rect.height / 2;
    const curVal = units[unitIdx].vals[cfg.id] ?? (cfg.id === 'vol' ? 0.72 : 0);
    const delta = isTop ? cfg.step * 2 : -cfg.step * 2;
    const stepped = Math.min(cfg.max, Math.max(cfg.min, curVal + delta));
    if (stepped !== curVal) {
      const copy = [...units];
      copy[unitIdx] = {
        ...copy[unitIdx],
        vals: {
          ...copy[unitIdx].vals,
          [cfg.id]: stepped,
        },
      };
      onUnitsChange(copy);
      audioEngine.applyUnits(copy);
      audioEngine.playBeep(1900, 0.02);
      onOverlayMsg(`${cfg.lab} ${cfg.format(stepped)}`);
    }
  };

  const handleDblClick = (unitIdx: number, cfg: KnobConfig) => {
    const defVal = cfg.id === 'vol' ? 0.72 : 0;
    const copy = [...units];
    copy[unitIdx] = {
      ...copy[unitIdx],
      vals: {
        ...copy[unitIdx].vals,
        [cfg.id]: defVal,
      },
    };
    onUnitsChange(copy);
    audioEngine.applyUnits(copy);
    audioEngine.playBeep(2100, 0.03);
    onOverlayMsg(`${cfg.lab} 0dB`);
  };

  const toggleBypass = (unitIdx: number) => {
    const copy = [...units];
    copy[unitIdx] = {
      ...copy[unitIdx],
      byp: !copy[unitIdx].byp,
    };
    onUnitsChange(copy);
    audioEngine.applyUnits(copy);
    audioEngine.playBeep(1600, 0.03);
    onOverlayMsg(copy[unitIdx].byp ? 'EQ BYPASS' : 'EQ ACTIVO');
  };

  const getKnobAngles = (val: number, min: number, max: number, isBipolar: boolean) => {
    const norm = (val - min) / (max - min);
    const pos = norm * 270;
    const s = isBipolar ? Math.min(135, pos) : 0;
    const e = isBipolar ? Math.max(135, pos) : pos;
    const rot = pos - 135;
    return { s, e, rot };
  };

  const XS = [6.39, 17.6, 26.59, 33.47, 40.61, 48.49, 56.23, 63.9, 71.62, 79.45, 87.29];

  return (
    <div
      id="eqs"
      className={isOn ? '' : 'poff'}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {units.map((unit, uIdx) => (
        <div key={uIdx} className="eqw">
          <div className="eqp">
            <div className="eqplate">
              <div className="eqbody">
                {/* SUB LEVEL Knob */}
                {(() => {
                  const cfg = knobConfigs[0];
                  const val = unit.vals[cfg.id] ?? 0;
                  const { s, e, rot } = getKnobAngles(val, cfg.min, cfg.max, cfg.isBipolar);
                  return (
                    <div
                      className="kc"
                      style={{
                        left: `${XS[0]}cqw`,
                        ['--d' as string]: `${cfg.d}cqw`,
                        ['--fs' as string]: '2cqw',
                        ['--g' as string]: '0.15cqw',
                      }}
                    >
                      <div
                        className="kl cursor-pointer"
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                      >
                        {cfg.lab}
                      </div>
                      <div
                        className="kn2"
                        style={{ width: `${cfg.d}cqw` }}
                        onPointerDown={(ev) => handlePointerDown(ev, uIdx, cfg)}
                        onWheel={(ev) => handleWheel(ev, uIdx, cfg)}
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                        onDoubleClick={() => handleDblClick(uIdx, cfg)}
                        title={`${cfg.lab}: arrastra arriba/abajo, rueda o clic`}
                      >
                        <div className="kglow">
                          <div
                            className="kring"
                            style={{
                              ['--s' as string]: `${s}deg`,
                              ['--e' as string]: `${e}deg`,
                            }}
                          ></div>
                        </div>
                        <div className="kbody"></div>
                        <div className="kcap" style={{ transform: `rotate(${rot}deg)` }}>
                          <i></i>
                        </div>
                      </div>
                      <div
                        className="kv cursor-pointer"
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                      >
                        {cfg.format(val)}
                      </div>
                    </div>
                  );
                })()}

                {/* VOLUME Knob */}
                {(() => {
                  const cfg = knobConfigs[1];
                  const val = unit.vals[cfg.id] ?? 0.72;
                  const { s, e, rot } = getKnobAngles(val, cfg.min, cfg.max, cfg.isBipolar);
                  return (
                    <div
                      className="kc"
                      style={{
                        left: `${XS[1]}cqw`,
                        ['--d' as string]: `${cfg.d}cqw`,
                        ['--fs' as string]: '2cqw',
                        ['--g' as string]: '0.15cqw',
                      }}
                    >
                      <div
                        className="kl cursor-pointer"
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                      >
                        {cfg.lab}
                      </div>
                      <div
                        className="kn2"
                        style={{ width: `${cfg.d}cqw` }}
                        onPointerDown={(ev) => handlePointerDown(ev, uIdx, cfg)}
                        onWheel={(ev) => handleWheel(ev, uIdx, cfg)}
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                        onDoubleClick={() => handleDblClick(uIdx, cfg)}
                        title={`${cfg.lab}: arrastra arriba/abajo, rueda o clic`}
                      >
                        <div className="kglow">
                          <div
                            className="kring"
                            style={{
                              ['--s' as string]: `${s}deg`,
                              ['--e' as string]: `${e}deg`,
                            }}
                          ></div>
                        </div>
                        <div className="kbody"></div>
                        <div className="kcap" style={{ transform: `rotate(${rot}deg)` }}>
                          <i></i>
                        </div>
                      </div>
                      <div
                        className="kv cursor-pointer"
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                      >
                        {cfg.format(val)}
                      </div>
                    </div>
                  );
                })()}

                {/* AUX S/W (Bypass Toggle) */}
                <div
                  className="kc"
                  style={{
                    left: `${XS[2]}cqw`,
                    ['--d' as string]: '5.9cqw',
                    ['--fs' as string]: '1.8cqw',
                    ['--g' as string]: '0.65cqw',
                  }}
                >
                  <div className="kl cursor-pointer" onClick={() => toggleBypass(uIdx)}>
                    AUX S/W
                  </div>
                  <div
                    className={`kn2 cursor-pointer ${unit.byp ? 'byp' : ''}`}
                    style={{ width: '5.9cqw' }}
                    onClick={() => toggleBypass(uIdx)}
                    title="EQ Activo / Bypass (clic para alternar)"
                  >
                    <div className="kglow">
                      <div className="kring"></div>
                    </div>
                    <div className="kbody"></div>
                    <div
                      className="kcap"
                      style={{ transform: `rotate(${unit.byp ? -90 : 0}deg)` }}
                    >
                      <i></i>
                    </div>
                  </div>
                  <div className="kv cursor-pointer" onClick={() => toggleBypass(uIdx)}>
                    {unit.byp ? 'BYPASS' : 'ACTIVO'}
                  </div>
                </div>

                {/* FADER & Frequency Bands */}
                {knobConfigs.slice(2).map((cfg, cIdx) => {
                  const val = unit.vals[cfg.id] ?? 0;
                  const { s, e, rot } = getKnobAngles(val, cfg.min, cfg.max, cfg.isBipolar);
                  const xPos = XS[cIdx + 3] || 90;
                  return (
                    <div
                      key={cfg.id}
                      className="kc"
                      style={{
                        left: `${xPos}cqw`,
                        ['--d' as string]: `${cfg.d}cqw`,
                        ['--fs' as string]: '1.7cqw',
                        ['--g' as string]: '0.75cqw',
                      }}
                    >
                      <div
                        className="kl cursor-pointer"
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                      >
                        {cfg.lab}
                      </div>
                      <div
                        className="kn2"
                        style={{ width: `${cfg.d}cqw` }}
                        onPointerDown={(ev) => handlePointerDown(ev, uIdx, cfg)}
                        onWheel={(ev) => handleWheel(ev, uIdx, cfg)}
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                        onDoubleClick={() => handleDblClick(uIdx, cfg)}
                        title={`${cfg.lab}: arrastra, rueda o clic`}
                      >
                        <div className="kglow">
                          <div
                            className="kring"
                            style={{
                              ['--s' as string]: `${s}deg`,
                              ['--e' as string]: `${e}deg`,
                            }}
                          ></div>
                        </div>
                        <div className="kbody"></div>
                        <div className="kcap" style={{ transform: `rotate(${rot}deg)` }}>
                          <i></i>
                        </div>
                      </div>
                      <div
                        className="kv cursor-pointer"
                        onClick={(ev) => handleClickKnob(ev, uIdx, cfg)}
                      >
                        {cfg.format(val)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
