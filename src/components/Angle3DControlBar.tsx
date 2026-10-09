import React, { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';

export interface Angle3DState {
  yaw: number; // rotateY in degrees
  pitch: number; // rotateX in degrees
  perspective: number;
  highCapacity: boolean;
  preset: string;
}

interface Angle3DControlBarProps {
  state: Angle3DState;
  onChange: (next: Angle3DState) => void;
  onOverlayMsg: (msg: string) => void;
}

export const Angle3DControlBar: React.FC<Angle3DControlBarProps> = ({
  state,
  onChange,
  onOverlayMsg,
}) => {
  const [showSliders, setShowSliders] = useState(false);

  const presets = [
    { id: 'front', label: '0° Frente', yaw: 0, pitch: 0 },
    { id: 'angle15', label: '15° Inclinado 3D', yaw: 16, pitch: 6 },
    { id: 'trunk30', label: '30° Vista Baúl', yaw: -28, pitch: 10 },
    { id: 'spl45', label: '45° Proyección SPL', yaw: 36, pitch: 12 },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    audioEngine.playBeep(2000, 0.03);
    onChange({
      ...state,
      yaw: p.yaw,
      pitch: p.pitch,
      preset: p.id,
    });
    onOverlayMsg(`ÁNGULO: ${p.label.toUpperCase()}`);
  };

  const handleToggleCapacity = () => {
    const nextVal = !state.highCapacity;
    audioEngine.playBeep(nextVal ? 2400 : 1600, 0.04);
    audioEngine.setHighCapacityMode(nextVal);
    onChange({
      ...state,
      highCapacity: nextVal,
    });
    onOverlayMsg(nextVal ? 'MÁXIMA CAPACIDAD SPL +12dB' : 'CAPACIDAD NORMAL');
  };

  const handleSliderChange = (key: 'yaw' | 'pitch', val: number) => {
    onChange({
      ...state,
      [key]: val,
      preset: 'custom',
    });
  };

  return (
    <div className="w-full max-w-[1376px] px-2.5 my-2">
      <div className="bg-gradient-to-r from-neutral-950/95 via-neutral-900/95 to-neutral-950/95 border border-cyan-500/40 rounded-2xl p-2.5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Label */}
        <div className="flex items-center gap-2 pl-1">
          <span className="text-base">📐</span>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Ángulo 3D & Capacidad de Sonido</span>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-black border border-cyan-400/40">
                PROYECCIÓN
              </span>
            </div>
            <div className="text-[10px] text-neutral-400">
              Gira la caja de radio y chucheros a diferentes ángulos para mayor acústica.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Preset Angle Buttons */}
          {presets.map((p) => {
            const isActive = state.preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer select-none flex items-center gap-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40 border border-cyan-400 ring-1 ring-cyan-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                }`}
                title={`Voltear a ${p.label}`}
              >
                <span>{p.label}</span>
              </button>
            );
          })}

          {/* Toggle Fine Sliders */}
          <button
            onClick={() => setShowSliders(!showSliders)}
            className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showSliders
                ? 'bg-neutral-800 border-amber-400 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Ajuste fino de rotación libre 3D"
          >
            <span>🔄 Giro Libre</span>
          </button>

          {/* High Capacity SPL Overdrive Toggle */}
          <button
            onClick={handleToggleCapacity}
            className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-lg select-none border ${
              state.highCapacity
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black border-amber-300 shadow-amber-500/40 animate-pulse'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}
            title="Sonar con más capacidad (Proyección acústica de competencia)"
          >
            <span>⚡</span>
            <span>{state.highCapacity ? 'Más Capacidad SPL [ACTIVO]' : 'Activar Más Capacidad'}</span>
          </button>
        </div>
      </div>

      {/* Expandable 3D Sliders Panel */}
      {showSliders && (
        <div className="bg-neutral-950/90 border border-neutral-800 rounded-2xl p-3 mt-2 shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex justify-between font-bold text-neutral-300 mb-1">
              <span>Giro Horizontal (Yaw / Ángulo lateral):</span>
              <span className="text-cyan-400 font-mono">{state.yaw}°</span>
            </div>
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={state.yaw}
              onChange={(e) => handleSliderChange('yaw', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between font-bold text-neutral-300 mb-1">
              <span>Inclinación Vertical (Pitch / Altura):</span>
              <span className="text-cyan-400 font-mono">{state.pitch}°</span>
            </div>
            <input
              type="range"
              min="-20"
              max="25"
              step="1"
              value={state.pitch}
              onChange={(e) => handleSliderChange('pitch', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
