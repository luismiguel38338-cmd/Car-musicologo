import React from 'react';
import { COLORS, CASE_COLORS, SPEAKER_COLORS } from '../utils/models';
import { audioEngine } from '../utils/audioEngine';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColorIndex: number;
  onSelectColor: (idx: number) => void;
  currentCaseColor: string;
  onSelectCaseColor: (hex: string) => void;
  currentSpeakerColor: string;
  onSelectSpeakerColor: (hex: string) => void;
  eqCount: number;
  onSetEqCount: (count: number) => void;
  onResetColors: () => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  currentColorIndex,
  onSelectColor,
  currentCaseColor,
  onSelectCaseColor,
  currentSpeakerColor,
  onSelectSpeakerColor,
  eqCount,
  onSetEqCount,
  onResetColors,
}) => {
  if (!isOpen) return null;

  const colStyle = (hr?: number) =>
    hr === undefined
      ? 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)'
      : `hsl(${205 + hr}, 100%, 60%)`;

  return (
    <div className="vm opt show" id="optm" role="dialog" aria-label="Opciones">
      <div className="vc">
        <button
          className="vx"
          id="optx"
          aria-label="Cerrar"
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onClose();
          }}
        >
          ✕
        </button>
        <h2 className="opt text-xl font-bold mb-2">⚙️ Opciones</h2>
        <p className="vs text-sm text-neutral-400 mb-4">
          Cambia colores y ecualizadores. Ves el resultado en vivo y se guarda en este navegador.
        </p>

        {/* ILLUMI LIGHTS */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mt-4 mb-2">
          LUCES (ILLUMI)
        </div>
        <div className="sw flex flex-wrap gap-2.5 items-center mb-4" id="sw">
          {COLORS.map((c, i) => (
            <button
              key={c.n}
              style={{ background: colStyle(c.hr) }}
              className={currentColorIndex === i ? 'on' : ''}
              title={c.n}
              onClick={() => {
                audioEngine.playBeep(1900, 0.03);
                onSelectColor(i);
              }}
            />
          ))}
        </div>

        {/* CASE COLOR */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mt-4 mb-2">
          CAJA DEL RADIO
        </div>
        <div className="sw flex flex-wrap gap-2.5 items-center mb-4" id="sw2">
          {CASE_COLORS.map((c) => (
            <button
              key={c.hex}
              style={{ background: c.hex }}
              className={currentCaseColor.toLowerCase() === c.hex.toLowerCase() ? 'on' : ''}
              title={c.name}
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onSelectCaseColor(c.hex);
              }}
            />
          ))}
          <label className="cpk" title="Color personalizado">
            <input
              type="color"
              value={currentCaseColor}
              onChange={(e) => onSelectCaseColor(e.target.value)}
            />
          </label>
        </div>

        {/* SPEAKER COLOR */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mt-4 mb-2">
          CHUCHERO / BOCINA
        </div>
        <div className="sw flex flex-wrap gap-2.5 items-center mb-4" id="sw3">
          {SPEAKER_COLORS.map((c) => (
            <button
              key={c.hex}
              style={{ background: c.hex }}
              className={currentSpeakerColor.toLowerCase() === c.hex.toLowerCase() ? 'on' : ''}
              title={c.name}
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onSelectSpeakerColor(c.hex);
              }}
            />
          ))}
          <label className="cpk" title="Color personalizado">
            <input
              type="color"
              value={currentSpeakerColor}
              onChange={(e) => onSelectSpeakerColor(e.target.value)}
            />
          </label>
        </div>

        {/* EQUALIZERS */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mt-4 mb-2">
          ECUALIZADORES PARAMÉTRICOS
        </div>
        <div className="eqc flex items-center gap-3 mb-6">
          <button
            id="eqm"
            aria-label="Quitar ecualizador"
            disabled={eqCount <= 1}
            onClick={() => {
              audioEngine.playBeep(1700, 0.03);
              onSetEqCount(Math.max(1, eqCount - 1));
            }}
          >
            −
          </button>
          <b id="eqn" className="text-sm font-bold text-neutral-200">
            {eqCount}/5
          </b>
          <button
            id="eqa"
            aria-label="Agregar ecualizador"
            disabled={eqCount >= 5}
            onClick={() => {
              audioEngine.playBeep(2100, 0.03);
              onSetEqCount(Math.min(5, eqCount + 1));
            }}
          >
            +
          </button>
        </div>

        <button
          className="vrs w-full py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700 transition-colors"
          id="optrs"
          onClick={() => {
            audioEngine.playBeep(1600, 0.03);
            onResetColors();
          }}
        >
          Restablecer colores por defecto
        </button>
      </div>
    </div>
  );
};
