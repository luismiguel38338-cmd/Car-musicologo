import React from 'react';
import { MODELS } from '../utils/models';
import { audioEngine } from '../utils/audioEngine';

interface VipKitipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: 6 | 8 | 10 | 12;
  onSelectSize: (size: 6 | 8 | 10 | 12) => void;
  currentModelId: string;
  onSelectModel: (modelId: string) => void;
  is14Volt: boolean;
  onToggleVolt: (v14: boolean) => void;
  onPlaySynthTest: () => void;
}

export const VipKitipoModal: React.FC<VipKitipoModalProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSelectSize,
  currentModelId,
  onSelectModel,
  is14Volt,
  onToggleVolt,
  onPlaySynthTest,
}) => {
  if (!isOpen) return null;

  const sizes: Array<{ size: 6 | 8 | 10 | 12; title: string; desc: string }> = [
    { size: 6, title: '6" Chuchero Original', desc: '2 medios de 6 pulgadas + 1 tweeter' },
    { size: 8, title: '8" Kitipo Pro', desc: '2 medios de 8 pulgadas + 2 tweeters bala' },
    { size: 10, title: '10" Chuchero Competencia', desc: '2 medios de 10 pulgadas + 2 drivers fenolicos' },
    { size: 12, title: '12" Mega Kitipo con Bajos', desc: '2 subwoofers de 12 pulgadas + 3 drivers' },
  ];

  return (
    <div className="vm opt show" role="dialog" aria-label="Personalización y Kitipos">
      <div className="vc max-w-xl">
        <button
          className="vx"
          aria-label="Cerrar"
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onClose();
          }}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-amber-400">
          ⭐ Personalización & Kitipos de Car Audio
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          Ajusta el chuchero, cambia el modelo del estéreo o activa el modo turbo de alternador a 14.4V.
        </p>

        {/* Chuchero size */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mb-2">
          TAMAÑO DE BOCINAS (CHUCHEROS & KITIPOS)
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {sizes.map((s) => (
            <button
              key={s.size}
              onClick={() => {
                audioEngine.playBeep(1900, 0.03);
                onSelectSize(s.size);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                currentSize === s.size
                  ? 'border-amber-400 bg-amber-500/20 text-white shadow-lg shadow-amber-500/20'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <div className="font-bold text-sm flex items-center justify-between">
                {s.title}
                {currentSize === s.size && <span className="text-amber-400">✓</span>}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Stereo Models */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mb-2">
          MODELO DE ESTÉREO DE CAR AUDIO
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4 max-h-52 overflow-y-auto pr-1">
          {Object.values(MODELS).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onSelectModel(m.id);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-semibold ${
                currentModelId === m.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <span>{m.name}</span>
              {currentModelId === m.id && <span className="text-cyan-400">✓</span>}
            </button>
          ))}
        </div>

        {/* Voltage Mode */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mb-2">
          VOLTAJE DEL SISTEMA DE AUDIO
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              audioEngine.playBeep(1700, 0.03);
              onToggleVolt(false);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
              !is14Volt
                ? 'border-blue-500 bg-blue-500/20 text-blue-200'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            12.6V BATERÍA NORMAL
          </button>
          <button
            onClick={() => {
              audioEngine.playBeep(2100, 0.03);
              onToggleVolt(true);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
              is14Volt
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md shadow-emerald-500/20'
                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
            }`}
          >
            ⚡ 14.4V ALTERNADOR TURBO SPL
          </button>
        </div>

        {/* Bass Test Loop */}
        <div className="pt-2 border-t border-neutral-800">
          <button
            onClick={() => {
              audioEngine.playBeep(2200, 0.04);
              onPlaySynthTest();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 font-bold text-white text-sm shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-2"
          >
            🔊 BASS TEST DEMBOW 808 (Prueba los Subwoofers)
          </button>
        </div>
      </div>
    </div>
  );
};
