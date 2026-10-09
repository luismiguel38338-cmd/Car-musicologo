import React from 'react';
import { ChipeoProfile, CHIPEO_RANKS } from '../utils/chipeoSystem';
import { audioEngine } from '../utils/audioEngine';

interface ChipeoProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChipeoProfile;
  email: string;
  onOptimizeQuality: () => void;
  onLogout: () => void;
}

export const ChipeoProfileModal: React.FC<ChipeoProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  email,
  onOptimizeQuality,
  onLogout,
}) => {
  if (!isOpen) return null;

  const currentRank = CHIPEO_RANKS.find((r) => r.level === profile.level) || CHIPEO_RANKS[0];
  const nextRank = CHIPEO_RANKS.find((r) => r.level === profile.level + 1);

  const prevXp = currentRank.minXp;
  const targetXp = profile.xpNextLevel;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((profile.xp - prevXp) / Math.max(1, targetXp - prevXp)) * 100))
  );

  return (
    <div className="vm opt show" role="dialog" aria-label="Perfil de Chipeo">
      <div className="vc max-w-lg bg-gradient-to-b from-[#16181f] via-[#0f1117] to-[#08090c] border border-cyan-500/50 shadow-2xl rounded-3xl p-6 relative">
        {/* Close Button */}
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

        {/* Top Header Card */}
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-neutral-800">
          <div className="w-16 h-16 rounded-2xl bg-black border-2 border-cyan-400 p-1 shadow-xl shadow-cyan-950/60 flex items-center justify-center relative">
            <img
              src="/assets/img/logo-luis-miguel.png"
              alt="Luis Miguel"
              className="w-full h-full object-contain filter drop-shadow"
            />
            <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md">
              LVL {profile.level}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                {email.split('@')[0]}
              </h2>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-cyan-400/40">
                CHIPERO
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate">{email}</p>
            <div className="text-xs font-black text-amber-400 mt-0.5 flex items-center gap-1">
              <span>🏆</span>
              <span>{profile.rankTitle}</span>
            </div>
          </div>
        </div>

        {/* CHIPEO LEVEL & SOUND QUALITY METERS */}
        <div className="space-y-4 mb-5">
          {/* Sound Quality Meter */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-3.5 shadow-inner">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-black uppercase text-neutral-300 tracking-wider flex items-center gap-1.5">
                <span>🔊</span> Calidad de Sonido
              </span>
              <span className="font-black text-emerald-400 font-mono text-sm">
                {profile.soundQuality}% Hi-Fi
              </span>
            </div>
            <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-500"
                style={{ width: `${profile.soundQuality}%` }}
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5">
              Ajusta las perillas del ecualizador y mantén el volumen sin distorsión para subir tu calidad.
            </p>
          </div>

          {/* Chipeo Level & EXP Progress */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-3.5 shadow-inner">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                <span>👑</span> Nivel de Chipeo {profile.level}
              </span>
              <span className="font-bold text-neutral-400 text-xs font-mono">
                {profile.xp} / {profile.xpNextLevel} XP
              </span>
            </div>
            <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {nextRank && (
              <p className="text-[11px] text-cyan-400 font-semibold mt-1.5">
                Próximo rango: <strong>{nextRank.title}</strong> al alcanzar {nextRank.minXp} XP.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              audioEngine.playBeep(2200, 0.04);
              onOptimizeQuality();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <span>⚡ Afinar y Subir Calidad de Chipeo (+35 XP)</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playBeep(1800, 0.03);
              onLogout();
            }}
            className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-neutral-800 font-bold text-xs cursor-pointer transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
