import React, { useState } from 'react';
import { MODELS } from '../utils/models';
import { audioEngine } from '../utils/audioEngine';
import { SoundSetupType } from './SpeakerChuchero';
import {
  openPayPalImmediate,
  validateUnlockCode,
  PAYPAL_PRIMARY_EMAIL,
  PAYPAL_PRIMARY_INVOICE,
  PAID_ITEMS,
} from '../utils/paidItems';

interface VipKitipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: 6 | 8 | 10 | 12;
  onSelectSize: (size: 6 | 8 | 10 | 12) => void;
  soundSetup: SoundSetupType;
  onSelectSetup: (setup: SoundSetupType) => void;
  currentModelId: string;
  onSelectModel: (modelId: string) => void;
  is14Volt: boolean;
  onToggleVolt: (v14: boolean) => void;
  isVip: boolean;
  onToggleVip: (vip: boolean) => void;
  onPlaySynthTest: () => void;
  onOpenPaidStore?: () => void;
  isDoubleUnlocked?: boolean;
  onRequestUnlockDouble?: () => void;
}

export const VipKitipoModal: React.FC<VipKitipoModalProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSelectSize,
  soundSetup,
  onSelectSetup,
  currentModelId,
  onSelectModel,
  is14Volt,
  onToggleVolt,
  isVip,
  onToggleVip,
  onPlaySynthTest,
  onOpenPaidStore,
  isDoubleUnlocked,
  onRequestUnlockDouble,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyCode = () => {
    audioEngine.playBeep(2200, 0.04);
    const res = validateUnlockCode(promoCode);
    if (res.success) {
      onToggleVip(true);
      setPromoMsg(res.message);
    } else {
      setPromoMsg(res.message);
    }
  };

  const handleOpenPayPal = () => {
    audioEngine.playBeep(2100, 0.04);
    // Inmediatamente abre PayPal a negrito08m@gmail.com
    openPayPalImmediate(PAID_ITEMS[0], 5.0);
  };

  const soundOptions = [
    {
      id: 'single',
      name: 'Chuchero Individual',
      desc: '1 chuchero de competencia (6", 8", 10", 12")',
      icon: '🔊',
    },
    {
      id: 'double',
      name: 'Kitipo Doble Estéreo',
      desc: '2 chucheros gemelos con agudos y voces potentes',
      icon: '🔊🔊',
    },
  ];

  return (
    <div className="vm opt show" role="dialog" aria-label="Tienda VIP y Chucheros">
      <div className="vc max-w-2xl max-h-[90vh] overflow-y-auto pr-1">
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

        {/* Header with Luis Miguel Logo */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
          <img
            src="/assets/img/logo-luis-miguel.png"
            alt="Luis Miguel Logo"
            className="w-14 h-14 rounded-2xl object-contain border-2 border-cyan-400 bg-black/80 shadow-lg p-0.5"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">
                Luis Miguel Musicólogo
              </h2>
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                {isVip ? 'VIP ACTIVO' : 'PASE VIP'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Personaliza tus chucheros, muro de 5 bocinas, cajón de bajo y funciones de competencia.
            </p>
          </div>
        </div>

        {/* VIP PASS UPGRADE BANNER (Funciones de Pago) */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-neutral-900 via-indigo-950/40 to-neutral-900 border border-indigo-500/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-amber-400 tracking-widest flex items-center gap-1.5">
              <span>👑</span> Pase de Competencia VIP
            </span>
            <span className="text-[11px] font-extrabold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
              $5.00 USD
            </span>
          </div>

          <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
            Desbloquea el <strong>Modo SPL de Competencia</strong>, alternador de 16.2V con batería de litio,
            Bass Boost Overdrive +18dB y la insignia dorada de Luis Miguel Musicólogo.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-neutral-300">
            <div className="flex items-center gap-1.5 bg-neutral-950/60 p-2 rounded-xl border border-neutral-800">
              <span className="text-emerald-400">✓</span> Kitipo Doble Competencia
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-950/60 p-2 rounded-xl border border-neutral-800">
              <span className="text-emerald-400">✓</span> Turbo Alternador 16.2V
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-950/60 p-2 rounded-xl border border-neutral-800">
              <span className="text-emerald-400">✓</span> Insignia de Oro Luis Miguel
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-950/60 p-2 rounded-xl border border-neutral-800">
              <span className="text-emerald-400">✓</span> Bass Boost Overdrive +18dB
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleOpenPayPal}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              title={`Pagar a PayPal (${PAYPAL_PRIMARY_EMAIL})`}
            >
              <span>💳 Pagar $5 USD en PayPal</span>
            </button>

            {onOpenPaidStore && (
              <button
                onClick={() => {
                  audioEngine.playBeep(2100, 0.03);
                  onOpenPaidStore();
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <span>👑 Todas las Cosas de Pago</span>
              </button>
            )}

            <button
              onClick={() => {
                audioEngine.playBeep(2200, 0.04);
                onToggleVip(!isVip);
              }}
              className={`py-3 px-4 rounded-xl border font-black text-xs transition-all cursor-pointer ${
                isVip
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
              }`}
            >
              {isVip ? '✓ VIP Activo' : 'Activar VIP Inmediato'}
            </button>
          </div>

          {/* Promo code entry */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Código de activación (ej. LUISMIGUEL)"
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none flex-1 focus:border-amber-500"
            />
            <button
              onClick={handleApplyCode}
              className="py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs border border-neutral-700 cursor-pointer"
            >
              Canjear
            </button>
          </div>
          {promoMsg && <p className="text-[11px] text-emerald-400 font-bold mt-1">{promoMsg}</p>}
        </div>

        {/* SOUND SETUP SELECTOR */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mb-2">
          CONFIGURACIÓN DE CHUCHEROS & KITIPOS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {soundOptions.map((opt) => {
            const isSelected = soundSetup === opt.id;
            const isDouble = opt.id === 'double';
            const isLocked = isDouble && !isDoubleUnlocked;

            return (
              <button
                key={opt.id}
                onClick={() => {
                  audioEngine.playBeep(1900, 0.03);
                  if (isLocked) {
                    onRequestUnlockDouble?.();
                  } else {
                    onSelectSetup(opt.id as SoundSetupType);
                  }
                }}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                    : isLocked
                    ? 'border-amber-500/40 bg-neutral-900/80 text-amber-300 hover:border-amber-400'
                    : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div className="font-extrabold text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>{opt.icon}</span>
                    <span>{opt.name}</span>
                  </span>
                  {isSelected && <span className="text-cyan-400">✓</span>}
                  {isLocked && (
                    <span className="text-[10px] font-black bg-amber-500 text-black px-1.5 py-0.5 rounded shadow">
                      🔒 $1.11 / 2020
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-400 mt-1">{opt.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Chuchero size (for single / double mode) */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mb-2">
          TAMAÑO DE BOCINA DE CHUCHERO INDIVIDUAL (PULGADAS)
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[6, 8, 10, 12].map((sz) => (
            <button
              key={sz}
              onClick={() => {
                audioEngine.playBeep(1900, 0.03);
                onSelectSize(sz as 6 | 8 | 10 | 12);
              }}
              className={`p-2.5 rounded-xl text-center border font-extrabold text-xs transition-all cursor-pointer ${
                currentSize === sz
                  ? 'border-amber-400 bg-amber-500/20 text-white'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div>{sz}"</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">BOCINA</div>
            </button>
          ))}
        </div>

        {/* Stereo Models */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mb-2">
          MODELO DEL RADIO ESTÉREO
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4 max-h-44 overflow-y-auto pr-1">
          {Object.values(MODELS).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onSelectModel(m.id);
              }}
              className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-semibold cursor-pointer ${
                currentModelId === m.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <span className="truncate">{m.name}</span>
              {currentModelId === m.id && <span className="text-cyan-400">✓</span>}
            </button>
          ))}
        </div>

        {/* Voltage Mode */}
        <div className="vh font-bold text-xs tracking-wider text-neutral-400 mb-2">
          VOLTAJE DEL SISTEMA DE AUDIO (ALTERNADOR)
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              audioEngine.playBeep(1700, 0.03);
              onToggleVolt(false);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              !is14Volt
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            🔋 12.6V Batería Normal
          </button>
          <button
            onClick={() => {
              audioEngine.playBeep(2100, 0.03);
              onToggleVolt(true);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              is14Volt
                ? 'border-red-400 bg-red-500/20 text-red-200'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            ⚡ {isVip ? '16.2V SPL VIP Extremo' : '14.4V Turbo Alternador'}
          </button>
        </div>

        {/* Demo Subwoofer Test */}
        <button
          onClick={() => {
            audioEngine.playBeep(2100, 0.04);
            onPlaySynthTest();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>💥 Probar Excursión de Bajos y Chucheros (Dembow 808 Test)</span>
        </button>
      </div>
    </div>
  );
};
