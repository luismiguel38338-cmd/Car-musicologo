import { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface DjSoundboardProps {
  onTrigger: (fxName: string) => void;
}

export const DjSoundboard = ({ onTrigger }: DjSoundboardProps) => {
  const [activeFx, setActiveFx] = useState<string | null>(null);

  const trigger = (name: string, fn: () => void) => {
    setActiveFx(name);
    fn();
    onTrigger(name);
    setTimeout(() => {
      setActiveFx((cur) => (cur === name ? null : cur));
    }, 450);
  };

  const pads = [
    {
      id: 'horn',
      name: 'AIR HORN',
      icon: '📢',
      color: 'from-amber-500 to-yellow-600',
      border: 'border-amber-400',
      action: () => audioEngine.playAirHorn(),
    },
    {
      id: 'siren',
      name: 'SIRENA FX',
      icon: '🚨',
      color: 'from-red-600 to-rose-700',
      border: 'border-red-400',
      action: () => audioEngine.playPoliceSiren(),
    },
    {
      id: 'subdrop',
      name: 'SUB DROP 30Hz',
      icon: '💥',
      color: 'from-purple-600 to-indigo-700',
      border: 'border-purple-400',
      action: () => audioEngine.playSubDrop(),
    },
    {
      id: 'laser',
      name: 'LÁSER FX',
      icon: '⚡',
      color: 'from-cyan-500 to-blue-600',
      border: 'border-cyan-400',
      action: () => audioEngine.playLaserFx(),
    },
    {
      id: 'scratch',
      name: 'SCRATCH DJ',
      icon: '🔄',
      color: 'from-emerald-600 to-teal-700',
      border: 'border-emerald-400',
      action: () => audioEngine.playScratch(),
    },
  ];

  return (
    <div className="w-full max-w-[1376px] px-2.5 my-2">
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[11px] font-black tracking-widest text-neutral-300 uppercase">
              DJ Soundboard & Efectos de Car Audio
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
            Live Launchpad
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {pads.map((pad) => {
            const isPressed = activeFx === pad.name;
            return (
              <button
                key={pad.id}
                onClick={() => trigger(pad.name, pad.action)}
                className={`group relative overflow-hidden py-3 px-2 rounded-xl text-center border transition-all duration-150 select-none active:scale-95 ${
                  isPressed
                    ? `bg-gradient-to-b ${pad.color} ${pad.border} text-white shadow-lg shadow-amber-500/30 scale-98 ring-2 ring-white/50`
                    : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/80'
                }`}
              >
                <div className="text-xl mb-0.5 filter drop-shadow transition-transform group-hover:scale-110">
                  {pad.icon}
                </div>
                <div className="text-[10px] font-black tracking-wider truncate">
                  {pad.name}
                </div>
                <div
                  className={`absolute inset-0 bg-white/20 opacity-0 transition-opacity ${
                    isPressed ? 'opacity-100' : ''
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
