import React, { useState } from 'react';
import {
  PaidItem,
  PAID_ITEMS,
  PAYPAL_PRIMARY_EMAIL,
  PAYPAL_PRIMARY_INVOICE,
  getPayPalPaymentUrl,
  openPayPalImmediate,
  validateUnlockCode,
  unlockItemInStorage,
  unlockAllItemsInStorage,
} from '../utils/paidItems';
import { audioEngine } from '../utils/audioEngine';

interface PaidStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedItemIds: string[];
  onUpdateUnlocked: (nextUnlocked: string[]) => void;
  onOverlayMsg: (msg: string) => void;
}

export const PaidStoreModal: React.FC<PaidStoreModalProps> = ({
  isOpen,
  onClose,
  unlockedItemIds,
  onUpdateUnlocked,
  onOverlayMsg,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'audio' | 'voltage' | 'fx' | 'design'>('all');
  const [codeInputValue, setCodeInputValue] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ success?: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleBuyItem = (item: PaidItem) => {
    audioEngine.playBeep(2400, 0.05);
    // Inmediatamente manda a PayPal
    openPayPalImmediate(item);
    onOverlayMsg(`ENVIANDO A PAYPAL ($${item.priceUsd} USD)`);
    setCodeFeedback({
      success: true,
      text: `Se ha abierto tu PayPal para pagar $${item.priceUsd} USD a ${PAYPAL_PRIMARY_EMAIL}. Luego ingresa tu código para desbloquearlo al instante.`,
    });
  };

  const handleDirectInvoice = () => {
    audioEngine.playBeep(2200, 0.04);
    window.open(PAYPAL_PRIMARY_INVOICE, '_blank', 'noopener,noreferrer');
    onOverlayMsg('ABRIENDO FACTURA OFICIAL PAYPAL');
  };

  const handleRedeemCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    audioEngine.playBeep(2100, 0.04);
    const result = validateUnlockCode(codeInputValue);
    if (result.success) {
      onUpdateUnlocked(result.unlockedIds);
      setCodeFeedback({ success: true, text: result.message });
      onOverlayMsg('¡CÓDIGO VIP DESBLOQUEADO!');
      setCodeInputValue('');
    } else {
      setCodeFeedback({ success: false, text: result.message });
    }
  };

  const handleQuickUnlockItem = (itemId: string) => {
    audioEngine.playBeep(2000, 0.03);
    const updated = unlockItemInStorage(itemId);
    onUpdateUnlocked(updated);
    onOverlayMsg('FUNCIÓN ACTIVADA');
  };

  const filteredItems = selectedCategory === 'all'
    ? PAID_ITEMS
    : PAID_ITEMS.filter((i) => i.category === selectedCategory || i.category === 'all');

  const isComboUnlocked = unlockedItemIds.includes('combo_all_access');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-amber-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl shadow-amber-950/40">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center text-2xl">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                  Tienda Oficial VIP & Cosas de Pago
                </h2>
                <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  PayPal Real
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Paga de forma real a través de PayPal (<span className="text-amber-300 font-mono">{PAYPAL_PRIMARY_EMAIL}</span>) o desbloquea con tu código.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playBeep(1800, 0.03);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Global PayPal Direct Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-blue-950/80 border-b border-blue-500/30 p-3 px-4 sm:px-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💳</span>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>PAGO DIRECTO A PAYPAL:</span>
                <span className="text-cyan-300 underline font-mono">{PAYPAL_PRIMARY_EMAIL}</span>
              </div>
              <div className="text-[11px] text-neutral-300">
                Al hacer clic en cualquier cosa de pago te envía inmediatamente a PayPal para pagar.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getPayPalPaymentUrl(undefined, 5.0)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioEngine.playBeep(2100, 0.04)}
              className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-md shadow-blue-900/50 flex items-center gap-1.5 cursor-pointer no-underline"
            >
              <span>💳 PayPal.Me Directo</span>
            </a>
            <button
              onClick={handleDirectInvoice}
              className="py-1.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🧾 Factura Oficial</span>
            </button>
          </div>
        </div>

        {/* Code Activation Section */}
        <div className="p-3.5 px-4 sm:px-5 bg-neutral-900/50 border-b border-neutral-800">
          <form onSubmit={handleRedeemCode} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-2 flex-1 bg-neutral-950 border border-neutral-700 focus-within:border-amber-400 rounded-xl px-3 py-1.5 transition-colors">
              <span className="text-amber-400 text-sm">🔑</span>
              <input
                type="text"
                value={codeInputValue}
                onChange={(e) => setCodeInputValue(e.target.value)}
                placeholder="¿Tienes código de desbloqueo? Escríbelo aquí (ej. CHIPEOVIP, LUISMIGUEL)"
                className="bg-transparent text-white font-bold text-xs w-full outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-neutral-500"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            >
              Desbloquear con Código
            </button>
          </form>

          {codeFeedback && (
            <div
              className={`mt-2 p-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                codeFeedback.success
                  ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/80 border border-red-500/40 text-red-300'
              }`}
            >
              <span>{codeFeedback.success ? '✅' : '⚠️'}</span>
              <span>{codeFeedback.text}</span>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="p-2 sm:px-5 border-b border-neutral-800 bg-neutral-950 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: '⭐ Todas las Cosas de Pago' },
            { id: 'voltage', label: '⚡ Voltaje & Batería' },
            { id: 'audio', label: '🔊 Audio & Chucheros' },
            { id: 'fx', label: '🚨 Sirenas & Efectos' },
            { id: 'design', label: '🎨 Diseños Neón' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Paid Items Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isUnlocked = isComboUnlocked || unlockedItemIds.includes(item.id);
              const isCombo = item.id === 'combo_all_access';

              return (
                <div
                  key={item.id}
                  className={`relative rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                    isCombo
                      ? 'bg-gradient-to-br from-neutral-900 via-amber-950/40 to-neutral-900 border-amber-500 shadow-xl shadow-amber-950/50 md:col-span-2'
                      : isUnlocked
                      ? 'bg-neutral-900/60 border-emerald-500/40 shadow-lg'
                      : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl filter drop-shadow">{item.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-black text-white">{item.name}</h3>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isCombo
                                  ? 'bg-amber-400 text-black'
                                  : 'bg-neutral-800 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5 leading-snug">
                            {item.shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-base font-black text-emerald-400 font-mono">
                          ${item.priceUsd.toFixed(2)} <span className="text-[10px] text-neutral-400 font-sans">USD</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {isUnlocked ? (
                            <span className="text-emerald-400 font-bold">🔓 Desbloqueado</span>
                          ) : (
                            <span className="text-amber-400 font-bold">🔒 De Pago</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 my-3 text-[11px] text-neutral-300">
                      {item.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-neutral-950/70 p-1.5 px-2 rounded-lg border border-neutral-800/80"
                        >
                          <span className={isUnlocked ? 'text-emerald-400' : 'text-amber-400'}>
                            {isUnlocked ? '✓' : '•'}
                          </span>
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Direct PayPal vs Unlock with Code */}
                  <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center gap-2 mt-2">
                    {/* Botón Principal: Pagar Inmediatamente en PayPal */}
                    <button
                      onClick={() => handleBuyItem(item)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                        isCombo
                          ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black hover:brightness-110 shadow-amber-500/30'
                          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 text-white shadow-blue-900/40'
                      }`}
                      title={`Pagar $${item.priceUsd} USD inmediatamente en PayPal (${PAYPAL_PRIMARY_EMAIL})`}
                    >
                      <span>💳</span>
                      <span>
                        Pagar ${item.priceUsd.toFixed(2)} USD en PayPal
                      </span>
                    </button>

                    {/* Botón Alternativo: Desbloquear con Código */}
                    {!isUnlocked ? (
                      <button
                        onClick={() => {
                          setCodeInputValue(item.codes[0] || 'CHIPEOVIP');
                          handleQuickUnlockItem(item.id);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-bold text-xs border border-neutral-700 hover:border-amber-500/50 flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Activar con código o verificar"
                      >
                        <span>🔑</span>
                        <span>Desbloquear</span>
                      </button>
                    ) : (
                      <div className="py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1">
                        <span>✓</span>
                        <span>Activo en tu Sistema</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 px-4 sm:px-5 border-t border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-neutral-400 flex items-center gap-2">
            <span>🛡️</span>
            <span>
              Pagos procesados directamente a <strong className="text-white">{PAYPAL_PRIMARY_EMAIL}</strong> vía PayPal Oficial.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const all = unlockAllItemsInStorage();
                onUpdateUnlocked(all);
                onOverlayMsg('TODO DESBLOQUEADO (MODO DUEÑO)');
              }}
              className="py-1 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 text-[11px] font-mono border border-neutral-800 cursor-pointer"
              title="Desbloquear todo de una vez"
            >
              🔓 Desbloquear Todo
            </button>
            <button
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onClose();
              }}
              className="py-1.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
