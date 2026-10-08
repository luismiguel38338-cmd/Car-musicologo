import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onFinish?: () => void;
  brandName?: string;
}

export const LoadingScreen = ({ onFinish, brandName = 'MUSICÓLOGOS' }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  const msgs = [
    'ENCENDIENDO LUCES...',
    'CALIBRANDO ECUALIZADOR...',
    'CONECTANDO AUDIO...',
    'AJUSTANDO VOLTAJE...',
    'CASI LISTO...',
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // Snappy authentic experience

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(1, elapsed / duration);
      setProgress(Math.floor(p * 100));

      const idx = Math.min(msgs.length - 1, Math.floor(p * msgs.length));
      setMsgIndex(idx);

      if (p >= 1) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          setHidden(true);
          onFinish?.();
        }, 700);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <div
      id="ld"
      className={fadeOut ? 'out' : ''}
      onClick={() => {
        setFadeOut(true);
        setTimeout(() => {
          setHidden(true);
          onFinish?.();
        }, 300);
      }}
      title="Click para saltar"
    >
      <div className="ldc">
        <div className="ldl">
          <div className="w-28 h-28 rounded-2xl bg-black/80 flex items-center justify-center p-1.5 shadow-2xl border-2 border-cyan-400">
            <img
              src="/assets/img/logo-luis-miguel.png"
              alt="Luis Miguel Musicólogo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(59,159,230,0.8)]"
            />
          </div>
        </div>
        <div className="ldt" id="ldt">
          {msgs[msgIndex]}
        </div>
        <div className="ldb">
          <i id="ldbar" style={{ width: `${progress}%` }}></i>
        </div>
        <div className="ldp" id="ldp">
          {progress}%
        </div>
      </div>
    </div>
  );
};
