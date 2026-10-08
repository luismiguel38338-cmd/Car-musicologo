import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { audioEngine } from '../utils/audioEngine';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal = ({ isOpen, onClose }: ApkInstallModalProps) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    audioEngine.playBeep(2200, 0.04);
    if (isInstallable) {
      await install();
    }
  };

  const copyCapacitorCommands = () => {
    const text = 'npm run build\nnpx cap sync android\nnpx cap open android';
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="vm opt show" role="dialog" aria-label="Instalar APK Android">
      <div className="vc max-w-lg">
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

        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-500 to-teal-700 flex items-center justify-center text-3xl shadow-lg border-2 border-emerald-400">
            🤖
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            Instalar APK Android
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Instala la aplicación directamente en tu celular Android como una app nativa con pantalla completa.
          </p>
        </div>

        {isInstalled ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-center mb-4">
            <span className="text-emerald-400 font-bold text-sm">
              ✓ ¡La aplicación ya está instalada en tu dispositivo!
            </span>
          </div>
        ) : (
          <div className="space-y-3 mb-5">
            {isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black text-base shadow-xl shadow-green-900/50 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>📲 Instalar APK Ahora en Android</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>📱</span> Pasos para instalar en tu celular Android:
                </div>
                <ol className="text-[12px] text-neutral-300 space-y-1.5 pl-4 list-decimal">
                  <li>
                    Abre el menú de tu navegador Chrome (los <strong>3 puntos verticales ⋮</strong> arriba a la derecha).
                  </li>
                  <li>
                    Toca en <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                  </li>
                  <li>
                    ¡Listo! Se creará el APK nativo en tu cajón de aplicaciones de Android.
                  </li>
                </ol>
              </div>
            )}

            {isIOS && (
              <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-800/60 text-xs text-blue-200">
                <strong>En iPhone / iPad:</strong> Presiona el botón <strong>Compartir (icono con flecha)</strong> en Safari y selecciona <strong>"Agregar al inicio"</strong>.
              </div>
            )}
          </div>
        )}

        {/* Developer Android APK Compilation Guide */}
        <div className="border-t border-neutral-800 pt-3">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>⚙️ Compilación de APK nativo (Capacitor)</span>
            <button
              onClick={copyCapacitorCommands}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              {copied ? '¡Copiado!' : 'Copiar comandos'}
            </button>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 font-mono text-[11px] text-neutral-300 space-y-1">
            <div className="text-neutral-500"># Compilar para Android APK:</div>
            <div>npm run build</div>
            <div>npx cap sync android</div>
            <div>npx cap open android</div>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2">
            El proyecto incluye configuración lista de Capacitor y Web App Manifest para generar el archivo APK o AAB firmado con Android Studio.
          </p>
        </div>
      </div>
    </div>
  );
};
