import { ChucheroCopies } from './ChucheroCopies';
import type { SpeakerSize, TweeterType } from '../types/radio';

interface ChucherosGridProps {
  size: SpeakerSize;
  color: string;
  tweeterType: TweeterType;
  isPlaying?: boolean;
}

export const ChucherosGrid = ({ size, color, tweeterType, isPlaying = false }: ChucherosGridProps) => {
  const variants: Array<'classic' | 'dual-tweet' | 'triple-tweet' | 'power' | 'midrange'> = [
    'classic',
    'dual-tweet',
    'triple-tweet',
    'power',
    'midrange',
  ];

  const variantLabels: Record<string, string> = {
    classic: 'CLÁSICO',
    'dual-tweet': 'DUAL TWEET',
    'triple-tweet': 'TRIPLE TWEET',
    power: 'POWER',
    midrange: 'MIDRANGE',
  };

  return (
    <div className="w-full max-w-[1376px] px-2.5 mt-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-wider">
          5 Configuraciones de Chucheros
        </h2>
        <p className="text-xs text-neutral-500 mt-2">Cada variante con diferentes disposiciones de bocinas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 auto-rows-max justify-items-center">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-neutral-900/40 border border-neutral-800 hover:border-cyan-600/50 transition-all">
            <span className="text-[10px] font-bold text-cyan-300 tracking-widest uppercase">
              {variantLabels[variant]}
            </span>
            <div className="flex justify-center items-center h-64">
              <ChucheroCopies
                size={8}
                color={color}
                tweeterType={tweeterType}
                variant={variant}
                isPlaying={isPlaying}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
