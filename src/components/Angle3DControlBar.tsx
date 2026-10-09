import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

export interface Angle3DState {
  yaw: number; // rotateY in degrees (-180 to 180 or 0 to 360)
  pitch: number; // rotateX in degrees (-90 to 90)
  perspective: number;
  highCapacity: boolean;
  preset: string;
  isContinuousSpin?: boolean;
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
  const [isSpinning, setIsSpinning] = useState(false);
  const spinRef = useRef<number | null>(null);

  // Presets con rotación completa sin barreras
  const presets = [
    { id: 'front', label: '0° Frente', yaw: 0, pitch: 0 },
    { id: 'diag45', label: '45° SPL', yaw: 45, pitch: 10 },
    { id: 'right90', label: '90° Lateral Der.', yaw: 90, pitch: 4 },
    { id: 'back180', label: '180° Vista Trasera', yaw: 180, pitch: 0 },
    { id: 'left270', label: '270° Lateral Izq.', yaw: -90, pitch: 4 },
  ];

  // Efecto de giro continuo automático 360° sin barreras
  useEffect(() => {
    if (!isSpinning) {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
      return;
    }

    let lastTime = performance.now();
    const spinLoop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      onChange({
        ...state,
        yaw: (state.yaw + delta * 35) % 360,
        preset: 'continuous_spin',
      });

      spinRef.current = requestAnimationFrame(spinLoop);
    };

    spinRef.current = requestAnimationFrame(spinLoop);
    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
    };
  }, [isSpinning, state.yaw, onChange]);

  const handleSelectPreset = (p: (typeof presets)[0]) => {
    setIsSpinning(false);
    audioEngine.playBeep(2000, 0.03);
    onChange({
      ...state,
      yaw: p.yaw,
      pitch: p.pitch,
      preset: p.id,
      isContinuousSpin: false,
    });
    onOverlayMsg(`ÁNGULO LIBRE: ${p.label.toUpperCase()}`);
  };

  const handleToggleSpin = () => {
    const next = !isSpinning;
    setIsSpinning(next);
    audioEngine.playBeep(next ? 2400 : 1800, 0.04);
    onOverlayMsg(next ? '🔄 GIRO 360° CONTINUO ACTIVADO' : 'GIRO PAUSADO');
  };

  const handleStepYaw = (delta: number) => {
    setIsSpinning(false);
    audioEngine.playBeep(2100, 0.02);
    const newYaw = Math.round((state.yaw + delta) % 360);
    onChange({
      ...state,
      yaw: newYaw,
      preset: 'custom',
    });
    onOverlayMsg(`ÁNGULO: ${newYaw}°`);
  };

  const handleFlip180 = () => {
    setIsSpinning(false);
    audioEngine.playBeep(2300, 0.04);
    const nextYaw = (state.yaw + 180) % 360;
    onChange({
      ...state,
      yaw: nextYaw,
      preset: 'flip180',
    });
    onOverlayMsg(`VOLTEADO 180°: ${nextYaw}°`);
  };

  const handleResetZero = () => {
    setIsSpinning(false);
    audioEngine.playBeep(1800, 0.03);
    onChange({
      ...state,
      yaw: 0,
      pitch: 0,
      preset: 'front',
    });
    onOverlayMsg('VISTA FRONTAL 0°');
  };

  const handleToggleCapacity = () => {
    const nextVal = !state.highCapacity;
    audioEngine.playBeep(nextVal ? 2400 : 1600, 0.04);
    audioEngine.setHighCapacityMode(nextVal);
    onChange({
      ...state,
      highCapacity: nextVal,
    });
    onOverlayMsg(nextVal ? '⚡ MÁXIMA CAPACIDAD SPL +12dB' : 'CAPACIDAD NORMAL');
  };

  const handleSliderChange = (key: 'yaw' | 'pitch', val: number) => {
    setIsSpinning(false);
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
          <span className="text-xl">📐</span>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
              <span>Ángulo 3D Total & Capacidad de Sonido</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-black border border-emerald-400/40 flex items-center gap-1">
                <span>🔓</span> SIN BARRERA (360° LIBRE)
              </span>
            </div>
            <div className="text-[10px] text-neutral-400">
              Gira la caja de radio y chucheros libremente en 360° en cualquier ángulo o vista trasera.
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
                title={`Voltear a ${p.label} sin límites`}
              >
                <span>{p.label}</span>
              </button>
            );
          })}

          {/* Stepper buttons to rotate without barriers */}
          <div className="flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 rounded-xl p-0.5">
            <button
              onClick={() => handleStepYaw(-15)}
              className="px-2 py-1 hover:bg-neutral-800 text-cyan-300 rounded font-black text-xs cursor-pointer transition-colors"
              title="Girar -15° a la izquierda"
            >
              ◀ -15°
            </button>
            <span className="text-[11px] font-mono font-bold text-white px-1">
              {Math.round(state.yaw)}°
            </span>
            <button
              onClick={() => handleStepYaw(15)}
              className="px-2 py-1 hover:bg-neutral-800 text-cyan-300 rounded font-black text-xs cursor-pointer transition-colors"
              title="Girar +15° a la derecha"
            >
              +15° ▶
            </button>
          </div>

          {/* Quick 180° Flip button */}
          <button
            onClick={handleFlip180}
            className="py-1.5 px-2.5 rounded-xl text-xs font-extrabold bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 cursor-pointer transition-all"
            title="Voltear 180° de inmediato (Ver vista trasera)"
          >
            🔄 180° Invertir
          </button>

          {/* Continuous Spin Toggle */}
          <button
            onClick={handleToggleSpin}
            className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 border ${
              isSpinning
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 shadow-md shadow-purple-900/40 animate-pulse'
                : 'bg-neutral-900 hover:bg-neutral-800 text-purple-300 border-purple-500/30'
            }`}
            title="Giro 360° continuo infinito sin parar"
          >
            <span>🌀</span>
            <span>{isSpinning ? 'Pausar Giro' : 'Giro 360° Auto'}</span>
          </button>

          {/* Toggle Free Sliders (Sin barreras) */}
          <button
            onClick={() => setShowSliders(!showSliders)}
            className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showSliders
                ? 'bg-neutral-800 border-amber-400 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Control deslizante libre sin barreras de ángulo"
          >
            <span>🎚️ Ajuste Fino</span>
          </button>

          {/* Center / Reset to 0° */}
          <button
            onClick={handleResetZero}
            className="py-1.5 px-2.5 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 cursor-pointer"
            title="Centrar de frente (0°)"
          >
            🎯 0° Frente
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
            <span>{state.highCapacity ? 'SPL +12dB [ACTIVO]' : 'Sonar + Capacidad'}</span>
          </button>
        </div>
      </div>

      {/* Expandable 3D Sliders Panel - COMPLETAMENTE SIN BARRERAS (-180° a +180° o 360°) */}
      {showSliders && (
        <div className="bg-neutral-950/95 border border-neutral-800 rounded-2xl p-3.5 mt-2 shadow-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
          <div>
            <div className="flex justify-between font-bold text-neutral-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="text-cyan-400">↔</span>
                <span>Rotación Horizontal (Yaw - 360° Libre Sin Barrera):</span>
              </span>
              <span className="text-cyan-400 font-mono font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                {Math.round(state.yaw)}°
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={state.yaw}
              onChange={(e) => handleSliderChange('yaw', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
              <span>-180° (Atrás)</span>
              <span>-90° (Izq)</span>
              <span className="text-cyan-300 font-bold">0° (Frente)</span>
              <span>+90° (Der)</span>
              <span>+180° (Atrás)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-neutral-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">↕</span>
                <span>Inclinación Vertical (Pitch - 180° Libre Sin Barrera):</span>
              </span>
              <span className="text-amber-400 font-mono font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                {Math.round(state.pitch)}°
              </span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              step="1"
              value={state.pitch}
              onChange={(e) => handleSliderChange('pitch', Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
              <span>-90° (Vista Inferior)</span>
              <span className="text-amber-300 font-bold">0° (Nivel)</span>
              <span>+90° (Vista Cenital Superior)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
