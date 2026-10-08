import { audioEngine } from '../utils/audioEngine';
import { OwnerPaymentConfig } from './DonationConfigModal';

interface PromoSidebarProps {
  onOpenVip: () => void;
  onOpenKitipo: () => void;
  onOpenDonation: () => void;
  onOpenDonationConfig: () => void;
  onOpenApk: () => void;
  paymentConfig: OwnerPaymentConfig;
}

export const PromoSidebar = ({
  onOpenVip,
  onOpenKitipo,
  onOpenDonation,
  onOpenDonationConfig,
  onOpenApk,
  paymentConfig,
}: PromoSidebarProps) => {
  return (
    <div className="promo">
      {/* Download / Install APK on Android */}
      <div className="pc">
        <button
          className="w-full py-3.5 px-4 rounded-3xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-green-500 shadow-lg shadow-emerald-950/60 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-400/40 cursor-pointer"
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

      {/* Kitipo y Bajos Box */}
      <div className="pc">
        <button
          className="kitb w-full py-3.5 px-5 rounded-full font-bold text-base text-cyan-200 bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-500/40 shadow-lg shadow-cyan-950/50 hover:brightness-110 active:scale-95 transition-all"
          id="kitb"
          onClick={() => {
            audioEngine.playBeep(2000, 0.03);
            onOpenKitipo();
          }}
        >
          🔊 Chucheros & Kitipos <span className="beta text-xs bg-amber-400 text-black px-1.5 py-0.5 rounded font-black ml-1">SPL</span>
        </button>
        <p>Bocinas de 6", 8", 10" y 12" con suspensión y respuesta de bajo real.</p>
      </div>

      {/* Direct Payment / PayPal Invoice Button */}
      <div className="pc">
        <a
          className="donb flex items-center justify-center gap-2 cursor-pointer no-underline"
          id="donb"
          href="https://www.paypal.com/invoice/p/#GZ9P8RYCZX64484J"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => audioEngine.playBeep(2100, 0.04)}
        >
          💳 Pagar Factura PayPal
        </a>
        <p>
          Formato de pago oficial de <strong className="text-emerald-400">Luis Miguel Musicólogo</strong>.
        </p>
      </div>

      {/* Official Discord Server for Future Updates */}
      <div className="pc">
        <a
          className="disb flex items-center justify-center gap-2 cursor-pointer no-underline bg-[#5865F2] hover:bg-[#4752c4] text-white font-black py-3 rounded-2xl"
          href="https://discord.gg/FYxevNeSp"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => audioEngine.playBeep(2000, 0.03)}
        >
          💬 Entrar a mi Discord
        </a>
        <p>
          Únete a mi servidor de Discord para pedir futuras actualizaciones, nuevas funciones y música.
        </p>
      </div>
    </div>
  );
};
