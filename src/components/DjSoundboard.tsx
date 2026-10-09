import { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { openPayPalImmediate, PAID_ITEMS } from '../utils/paidItems';

interface DjSoundboardProps {
  onTrigger: (fxName: string) => void;
  unlockedItems: string[];
  onOpenPaidStore: () => void;
}

export const DjSoundboard = ({
  onTrigger,
  unlockedItems,
  onOpenPaidStore,
}: DjSoundboardProps) => {
  const [activeFx, setActiveFx] = useState<string | null>(null);

  const isSirensUnlocked =
    unlockedItems.includes('combo_all_access') ||
    unlockedItems.includes('sirenas_chipeo_pack');

  const trigger = (name: string, fn: () => void, isPaid?: boolean) => {
    if (isPaid && !isSirensUnlocked) {
      audioEngine.playBeep(2200, 0.04);
      // Manda inmediatamente a PayPal a negrito08m@gmail.com
      const sirenItem = PAID_ITEMS.find((i) => i.id === 'sirenas_chipeo_pack');
      openPayPalImmediate(sirenItem, 2.5);
      onTrigger('ENVIANDO A PAYPAL ($2.50 USD)...');
      onOpenPaidStore();
      return;
    }

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
      isPaid: false,
      action: () => audioEngine.playAirHorn(),
    },
    {
      id: 'siren',
      name: 'SIRENA FX',
      icon: '🚨',
      color: 'from-red-600 to-rose-700',
      border: 'border-red-400',
      isPaid: false,
      action: () => audioEngine.playPoliceSiren(),
    },
    {
      id: 'subdrop',
      name: 'SUB DROP 30Hz',
      icon: '💥',
      color: 'from-purple-600 to-indigo-700',
      border: 'border-purple-400',
      isPaid: false,
      action: () => audioEngine.playSubDrop(),
    },
    {
      id: 'laser',
      name: 'LÁSER FX',
      icon: '⚡',
      color: 'from-cyan-500 to-blue-600',
      border: 'border-cyan-400',
      isPaid: false,
      action: () => audioEngine.playLaserFx(),
    },
    {
      id: 'scratch',
      name: 'SCRATCH DJ',
      icon: '🔄',
      color: 'from-emerald-600 to-teal-700',
      border: 'border-emerald-400',
      isPaid: false,
      action: () => audioEngine.playScratch(),
    },
    // VIP Dominican Chipeo Sound Effects (De Pago o Código)
    {
      id: 'sirena_rd',
      name: 'POLICÍA RD FX',
      icon: '🚓',
      color: 'from-blue-600 via-indigo-600 to-red-600',
      border: 'border-blue-400',
      isPaid: true,
      price: '$2.50',
      action: () => audioEngine.playPoliceSirenDominicana(),
    },
    {
      id: 'claxon_spl',
      name: 'CORNETA SPL',
      icon: '🎺',
      color: 'from-amber-600 via-orange-600 to-yellow-500',
      border: 'border-amber-400',
      isPaid: true,
      price: '$2.50',
      action: () => audioEngine.playClaxonCornetaSPL(),
    },
    {
      id: 'dembow_roll',
      name: 'DEMBOW STEMS',
      icon: '🥁',
      color: 'from-emerald-500 to-lime-600',
      border: 'border-lime-400',
      isPaid: true,
      price: '$2.50',
      action: () => audioEngine.playDembowRoll(),
    },
  ];

  return (
    <div className="w-full max-w-[1376px] px-2.5 my-2">
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between px-2 mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[11px] font-black tracking-widest text-neutral-300 uppercase">
              DJ Soundboard & Efectos de Chipeo Dominicano
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioEngine.playBeep(2100, 0.03);
                onOpenPaidStore();
              }}
              className="text-[10px] text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              title="Abrir Tienda VIP y Cosas de Pago"
            >
              <span>👑 Cosas de Pago / Códigos</span>
            </button>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider hidden sm:inline">
              Live Launchpad
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {pads.map((pad) => {
            const isPressed = activeFx === pad.name;
            const isLocked = pad.isPaid && !isSirensUnlocked;

            return (
              <button
                key={pad.id}
                onClick={() => trigger(pad.name, pad.action, pad.isPaid)}
                className={`group relative overflow-hidden py-3 px-1.5 rounded-xl text-center border transition-all duration-150 select-none cursor-pointer ${
                  isPressed
                    ? `bg-gradient-to-b ${pad.color} ${pad.border} text-white shadow-lg shadow-amber-500/30 scale-98 ring-2 ring-white/50`
                    : isLocked
                    ? 'bg-neutral-950/90 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-neutral-900'
                    : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/80'
                }`}
                title={
                  isLocked
                    ? `Bloqueado (${pad.price} USD) - Haz clic para pagar de inmediato en PayPal o desbloquear con código`
                    : `Disparar sonido ${pad.name}`
                }
              >
                {/* Lock Badge if paid */}
                {isLocked && (
                  <div className="absolute top-1 right-1 bg-amber-500 text-black text-[8px] font-black px-1 rounded flex items-center gap-0.5 shadow">
                    <span>🔒</span>
                    <span>PAGO</span>
                  </div>
                )}

                <div className="text-xl mb-0.5 filter drop-shadow transition-transform group-hover:scale-110">
                  {pad.icon}
                </div>
                <div className="text-[9px] font-black tracking-wider truncate">
                  {pad.name}
                </div>
                {pad.isPaid && (
                  <div className="text-[8px] font-mono text-amber-400">
                    {isLocked ? pad.price : '✓ PRO'}
                  </div>
                )}

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
