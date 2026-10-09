import { audioEngine } from '../utils/audioEngine';
import { OwnerPaymentConfig } from './DonationConfigModal';
import { openPayPalImmediate, PAYPAL_PRIMARY_EMAIL } from '../utils/paidItems';

interface PromoSidebarProps {
  onOpenVip: () => void;
  onOpenKitipo: () => void;
  onOpenDonation: () => void;
  onOpenDonationConfig: () => void;
  onOpenApk: () => void;
  paymentConfig: OwnerPaymentConfig;
  onOpenPaidStore: () => void;
}

export const PromoSidebar = ({
  onOpenVip,
  onOpenKitipo,
  onOpenApk,
  paymentConfig,
  onOpenPaidStore,
}: PromoSidebarProps) => {
  return (
    <div className="promo">
      {/* Cosas de Pago VIP & Desbloqueo */}
      <div className="pc border-amber-500/50 bg-gradient-to-b from-neutral-900 via-amber-950/20 to-neutral-900 shadow-xl shadow-amber-950/30">
        <button
          className="w-full py-3.5 px-4 rounded-3xl font-black text-sm text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-lg shadow-amber-500/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-yellow-300 cursor-pointer"
          onClick={() => {
            audioEngine.playBeep(2300, 0.04);
            onOpenPaidStore();
          }}
        >
          <span>👑 Cosas de Pago VIP</span>
        </button>
        <p className="text-amber-200/90 text-xs mt-1.5 text-center">
          Artículos de pago real ($1.99 - $9.99) o desbloqueo instantáneo con código.
        </p>
      </div>

      {/* Direct Immediate PayPal Button */}
      <div className="pc">
        <button
          className="donb w-full flex items-center justify-center gap-2 cursor-pointer no-underline bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black py-3 rounded-2xl shadow-lg shadow-blue-900/50 border border-blue-400/50 hover:brightness-110 active:scale-95 transition-all"
          id="donb"
          onClick={() => {
            audioEngine.playBeep(2100, 0.04);
            openPayPalImmediate(undefined, 5.0);
          }}
          title={`Pagar inmediatamente en PayPal a ${PAYPAL_PRIMARY_EMAIL}`}
        >
          <span>💳 Pagar a Mi PayPal</span>
        </button>
        <p>
          Envía el pago de inmediato a la cuenta oficial <strong className="text-emerald-400">{PAYPAL_PRIMARY_EMAIL}</strong>.
        </p>
      </div>

      {/* Download / Install APK on Android */}
      <div className="pc">
        <button
          className="w-full py-3 px-4 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-emerald-600 to-green-500 shadow-lg shadow-emerald-950/60 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-400/40 cursor-pointer"
          onClick={() => {
            audioEngine.playBeep(2200, 0.04);
            onOpenApk();
          }}
        >
          <span>📲 Descargar APK Android</span>
        </button>
        <p>Instala la aplicación en tu celular Android con pantalla completa y sin navegador.</p>
      </div>

      {/* Studio Audio Customization */}
      <div className="pc">
        <button
          className="vipb w-full"
          id="vipb"
          onClick={() => {
            audioEngine.playBeep(2100, 0.03);
            onOpenVip();
          }}
        >
          ⭐ Personalización PRO
        </button>
        <p>Modelos de radio, chucheros y voltajes para tu car audio.</p>
      </div>

      {/* Kitipos y Chucheros Box */}
      <div className="pc">
        <button
          className="kitb w-full py-3 px-4 rounded-2xl font-bold text-xs text-cyan-200 bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-500/40 shadow-lg shadow-cyan-950/50 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          id="kitb"
          onClick={() => {
            audioEngine.playBeep(2000, 0.03);
            onOpenKitipo();
          }}
        >
          🔊 Chucheros & Kitipos <span className="beta text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black ml-1">SPL</span>
        </button>
        <p>Bocinas de 6", 8", 10" y 12" con suspensión y respuesta de bajo real.</p>
      </div>

      {/* Official Discord Server for Future Updates */}
      <div className="pc">
        <a
          className="disb flex items-center justify-center gap-2 cursor-pointer no-underline bg-[#5865F2] hover:bg-[#4752c4] text-white font-black py-2.5 rounded-2xl text-xs"
          href="https://discord.gg/FYxevNeSp"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => audioEngine.playBeep(2000, 0.03)}
        >
          💬 Entrar a mi Discord
        </a>
        <p>
          Únete a mi servidor de Discord para pedir futuras actualizaciones y chipeo.
        </p>
      </div>
    </div>
  );
};
