import React, { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';
import {
  openPayPalImmediate,
  unlockDoubleChucheros,
  PAYPAL_PRIMARY_EMAIL,
  PAID_ITEMS,
} from '../utils/paidItems';

interface DoubleChucheroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
  onOverlayMsg: (msg: string) => void;
}

export const DoubleChucheroModal: React.FC<DoubleChucheroModalProps> = ({
  isOpen,
  onClose,
  onUnlocked,
  onOverlayMsg,
}) => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handlePayPayPal = () => {
    audioEngine.playBeep(2300, 0.04);
    const item = PAID_ITEMS.find((i) => i.id === 'kitipo_titanium');
    openPayPalImmediate(item, 1.11);
    onOverlayMsg('ABRIENDO PAYPAL ($1.11 USD)');
  };

  const handleApplyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = code.trim().toUpperCase();

    if (cleaned === '2020' || cleaned === 'CHIPEOVIP' || cleaned === 'LUISMIGUEL' || cleaned === 'NEGRITO08') {
      audioEngine.playBeep(2400, 0.06);
      unlockDoubleChucheros();
      setSuccessMsg('¡Código 2020 correcto! Los 2 chucheros han sido desbloqueados GRATIS.');
      setErrorMsg('');
      onOverlayMsg('¡2 CHUCHEROS DESBLOQUEADOS GRATIS!');
      setTimeout(() => {
        onUnlocked();
        onClose();
      }, 700);
    } else {
      audioEngine.playBeep(1600, 0.04);
      setErrorMsg('Código incorrecto. Ingresa el código 2020 o realiza el pago de $1.11 USD en PayPal.');
      setSuccessMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-amber-500/50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-amber-950/40 p-5 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
            🔊🔊
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            Poner los 2 Chucheros
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Configuración estéreo Kitipo Doble con agudos y voces de competencia para sonar a más de 300 metros.
          </p>
        </div>

        {/* Price & PayPal Card */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-blue-500/40 rounded-2xl p-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest mb-1">
            <span>⚡ TARIFA OFICIAL</span>
          </div>
          <div className="text-3xl font-black text-white font-mono my-1">
            $1.11 <span className="text-sm font-sans text-emerald-400 font-bold">USD</span>
          </div>
          <div className="text-[11px] text-neutral-400 mb-3">
            $1 punto 11 centavos a través de PayPal oficial ({PAYPAL_PRIMARY_EMAIL})
          </div>

          <button
            onClick={handlePayPayPal}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>💳 Pagar $1.11 USD en PayPal</span>
          </button>
        </div>

        {/* Code Unlock Card (Free with code 2020) */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-neutral-200 mb-1.5">
            <span className="text-amber-400">🔑</span>
            <span>¿Tienes código para usarlo gratis?</span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-2.5">
            Si recibiste el código de activación, introdúcelo aquí para poner los 2 chucheros gratis:
          </p>

          <form onSubmit={handleApplyCode} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código (ej. 2020)"
              className="bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none flex-1 uppercase tracking-wider"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black font-black text-xs cursor-pointer transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Desbloquear Gratis
            </button>
          </form>

          {errorMsg && (
            <p className="text-[11px] text-red-400 font-bold mt-2 bg-red-950/60 p-1.5 rounded-lg border border-red-800/40">
              ⚠️ {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-[11px] text-emerald-400 font-bold mt-2 bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-800/40">
              ✅ {successMsg}
            </p>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-3.5 text-center text-[10px] text-neutral-500">
          Código de cortesía: <strong className="text-amber-300 font-mono">2020</strong> para usuarios autorizados.
        </div>
      </div>
    </div>
  );
};
