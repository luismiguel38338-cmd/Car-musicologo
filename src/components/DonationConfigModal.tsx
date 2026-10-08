import { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';

export interface OwnerPaymentConfig {
  ownerName: string;
  paypalUrl: string; // e.g. https://www.paypal.me/tuusuario
  paypalEmail: string;
  donationAmount: string;
  donationMessage: string;
  whatsapp: string;
  instagram: string;
}

interface DonationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OwnerPaymentConfig;
  onSaveConfig: (cfg: OwnerPaymentConfig) => void;
}

export const DonationConfigModal = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}: DonationConfigModalProps) => {
  const [tab, setTab] = useState<'donate' | 'settings'>('donate');
  const [tempCfg, setTempCfg] = useState<OwnerPaymentConfig>(config);
  const [customAmount, setCustomAmount] = useState(config.donationAmount || '5');

  if (!isOpen) return null;

  const handleOpenPayPal = (amount: string) => {
    audioEngine.playBeep(2100, 0.04);
    let target = config.paypalUrl?.trim() || 'https://www.paypal.com/invoice/p/#GZ9P8RYCZX64484J';
    if (!target.startsWith('http')) {
      target = `https://${target}`;
    }
    // If it's a paypal.me link with amount
    if (target.includes('paypal.me') && !target.endsWith(amount) && !target.endsWith(`${amount}USD`)) {
      target = target.replace(/\/+$/, '') + `/${amount}USD`;
    }
    window.open(target, '_blank');
  };

  const handleSave = () => {
    audioEngine.playBeep(2000, 0.03);
    onSaveConfig(tempCfg);
    setTab('donate');
  };

  return (
    <div className="vm opt show" role="dialog" aria-label="Donaciones y Pagos">
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

        {/* Tab switch */}
        <div className="flex gap-2 mb-4 border-b border-neutral-800 pb-3">
          <button
            onClick={() => setTab('donate')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              tab === 'donate'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/30'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            💚 Apoyar & Donación
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              tab === 'settings'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-700/30'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            ⚙️ Configurar Mi PayPal
          </button>
        </div>

        {tab === 'donate' ? (
          <div>
            <div className="text-center mb-5">
              <span className="text-4xl inline-block mb-2">💚</span>
              <h2 className="text-xl font-black text-white">
                {config.ownerName || 'Musicólogos Studio'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                {config.donationMessage ||
                  'Tu apoyo ayuda a mantener este servidor de car audio y la música en vivo sonando.'}
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['5', '10', '20', '50'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomAmount(amt)}
                  className={`py-2.5 rounded-xl font-black text-sm border transition-all ${
                    customAmount === amt
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  ${amt} USD
                </button>
              ))}
            </div>

            {/* Custom Amount input */}
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 mb-4">
              <span className="text-neutral-500 text-sm font-bold">$</span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Otro monto"
                className="bg-transparent text-white font-bold text-sm w-full outline-none"
              />
              <span className="text-neutral-500 text-xs font-bold">USD</span>
            </div>

            {/* Direct PayPal Button */}
            <button
              onClick={() => handleOpenPayPal(customAmount)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0079C1] to-[#00457C] hover:from-[#0089DC] hover:to-[#00559C] text-white font-black text-base tracking-wide shadow-xl shadow-blue-900/40 transition-all active:scale-98 flex items-center justify-center gap-2 mb-3 cursor-pointer"
            >
              <span>Abrir Factura y Pagar con</span>
              <span className="font-extrabold italic bg-white text-[#003087] px-2 py-0.5 rounded text-sm">
                PayPal
              </span>
            </button>

            {config.whatsapp && (
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 text-xs font-bold transition-all"
              >
                📱 Contactar por WhatsApp: {config.whatsapp}
              </a>
            )}

            <div className="text-center mt-3">
              <button
                onClick={() => setTab('settings')}
                className="text-[11px] text-neutral-500 hover:text-amber-400 underline transition-colors"
              >
                ¿Eres el dueño? Haz clic aquí para poner tu propio PayPal y datos
              </button>
            </div>
          </div>
        ) : (
          /* Settings tab for the owner */
          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Tu Nombre o Marca (DJ / Proyecto):
              </label>
              <input
                type="text"
                value={tempCfg.ownerName}
                onChange={(e) => setTempCfg({ ...tempCfg, ownerName: e.target.value })}
                placeholder="Radio Musicólogos Oficial"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Enlace de tu PayPal.me:
              </label>
              <input
                type="text"
                value={tempCfg.paypalUrl}
                onChange={(e) => setTempCfg({ ...tempCfg, paypalUrl: e.target.value })}
                placeholder="https://www.paypal.me/tu_usuario"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Introduce el enlace de tu PayPal.me para recibir las donaciones directamente en tu cuenta.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Correo Electrónico de PayPal (Opcional):
              </label>
              <input
                type="email"
                value={tempCfg.paypalEmail}
                onChange={(e) => setTempCfg({ ...tempCfg, paypalEmail: e.target.value })}
                placeholder="tucorreo@ejemplo.com"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Mensaje personalizado para tus oyentes:
              </label>
              <textarea
                value={tempCfg.donationMessage}
                onChange={(e) => setTempCfg({ ...tempCfg, donationMessage: e.target.value })}
                rows={2}
                placeholder="Escribe un mensaje para tus seguidores..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  WhatsApp (Opcional):
                </label>
                <input
                  type="text"
                  value={tempCfg.whatsapp}
                  onChange={(e) => setTempCfg({ ...tempCfg, whatsapp: e.target.value })}
                  placeholder="+1 809 000 0000"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Instagram / Discord:
                </label>
                <input
                  type="text"
                  value={tempCfg.instagram}
                  onChange={(e) => setTempCfg({ ...tempCfg, instagram: e.target.value })}
                  placeholder="@tuusuario"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-xs text-white shadow-lg shadow-amber-600/30 hover:brightness-110 transition-all"
              >
                💾 Guardar Mis Datos de PayPal
              </button>
              <button
                onClick={() => setTab('donate')}
                className="py-3 px-4 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 font-bold text-xs hover:bg-neutral-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
