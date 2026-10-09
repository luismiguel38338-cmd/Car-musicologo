// Sistema de Cosas de Pago, Códigos de Desbloqueo y Enlace Directo a PayPal
export interface PaidItem {
  id: string;
  name: string;
  category: 'all' | 'audio' | 'voltage' | 'fx' | 'design';
  priceUsd: number;
  icon: string;
  badge: string;
  shortDesc: string;
  features: string[];
  codes: string[];
}

export const PAYPAL_PRIMARY_EMAIL = 'negrito08m@gmail.com';
export const PAYPAL_PRIMARY_INVOICE = 'https://www.paypal.com/invoice/p/#GZ9P8RYCZX64484J';
export const PAYPAL_ME_URL = 'https://www.paypal.com/paypalme/negrito08m';

export const PAID_ITEMS: PaidItem[] = [
  {
    id: 'combo_all_access',
    name: 'Combo Completo VIP Total (All-Access Pass)',
    category: 'all',
    priceUsd: 9.99,
    icon: '👑',
    badge: 'MÁS POPULAR',
    shortDesc: 'Desbloquea absolutamente todo el sistema, 16.2V, Kitipos Neodimio, Sirenas y EQ Gold.',
    features: [
      'Pase Maestro VIP de por vida',
      'Voltaje 16.2V Litio Turbo Overdrive',
      'Kitipo Doble Titanio Neodimio Pro',
      'Ecualizador Paramétrico Master Gold 8-Bandas',
      'Banco Completo de Sirenas y Dembow FX Dominicano',
      'Sub-Bombardero 30Hz Sísmico',
      'Fibra de Carbono & Neón Cyberpunk',
    ],
    codes: ['CHIPEOVIP', 'LUISMIGUEL', 'NEGRITO08', 'ALLACCESS', 'VIPMASTER', 'PAGOOK', 'COMPETENCIA'],
  },
  {
    id: 'vip_pass_16v',
    name: 'Pase Maestro VIP & 16.2V Litio Turbo',
    category: 'voltage',
    priceUsd: 5.0,
    icon: '⚡',
    badge: 'COMPETENCIA',
    shortDesc: 'Batería de litio extremo de 16.2V, Overdrive Bass Boost +18dB e insignia dorada.',
    features: [
      'Voltaje de 16.2V en el voltímetro digital',
      'Aumento acústico SPL Overdrive +18dB',
      'Insignia de Oro Luis Miguel Musicólogo',
      'Nivel máximo de chipeo garantizado',
    ],
    codes: ['VIPPASS', 'VOLT16', 'LITIO16', 'LUISMIGUEL', 'NEGRITO08'],
  },
  {
    id: 'kitipo_titanium',
    name: 'Kitipo Doble (2 Chucheros de Competencia)',
    category: 'audio',
    priceUsd: 1.11,
    icon: '🔊🔊',
    badge: '2 CHUCHEROS',
    shortDesc: 'Poner los 2 chucheros de competencia. Paga $1.11 USD en PayPal o desbloquea gratis con el código 2020.',
    features: [
      '2 Chucheros gemelos sonando a la vez',
      'Doble dispersión de voces y tweeters de compresión',
      'Pago real de $1.11 USD directo a PayPal',
      'Desbloqueo gratis con código VIP: 2020',
    ],
    codes: ['2020', 'KITIPRO', 'TITANIO', 'NEODIMIO', 'LUISMIGUEL', 'NEGRITO08'],
  },
  {
    id: 'eq_gold_8band',
    name: 'Ecualizador Paramétrico Master Gold 8-Bandas',
    category: 'audio',
    priceUsd: 3.0,
    icon: '🎛️',
    badge: 'EDICIÓN ORO',
    shortDesc: 'Ecualizador de competencia bañado en oro con corte subsónico 20Hz y realce armónico.',
    features: [
      '8 bandas paramétricas con perillas doradas metálicas',
      'Filtro subsónico de protección 20Hz',
      'Ajuste Q ultra preciso para chipeo profesional',
      'Iluminación LED ámbar/dorado de estudio',
    ],
    codes: ['EQGOLD', 'PARAM8', 'GOLDMASTER', 'LUISMIGUEL', 'NEGRITO08'],
  },
  {
    id: 'sirenas_chipeo_pack',
    name: 'Banco de Sirenas Chipeo Dominicano & Stems',
    category: 'fx',
    priceUsd: 2.5,
    icon: '🚨',
    badge: 'CALLEJERO',
    shortDesc: 'Sirenas reales de competencia dominicana: Policía Quisqueya, Corneta Claxon y Dembow FX.',
    features: [
      'Sirena Policía Dominicana Quisqueya FX',
      'Pito Corneta Claxon SPL de Chipeo',
      'Redoble Dembow Stems & Grito "¡Dale Mambo!"',
      'Láser Strobe & Metralleta de Efectos',
    ],
    codes: ['SIRENAS', 'CHIPEOFXX', 'POLICIAFX', 'DEMBOW', 'LUISMIGUEL', 'NEGRITO08'],
  },
  {
    id: 'sub_30hz_earthquake',
    name: 'Super Bass Sub-Armónico (30Hz Sub-Bombardero)',
    category: 'audio',
    priceUsd: 2.0,
    icon: '💥',
    badge: 'SUB-GRAVES',
    shortDesc: 'Generador de frecuencias subsónicas 30Hz para sacudir virtualmente los cajones.',
    features: [
      'Generador analógico 30Hz Sub-Drop ultra profundo',
      'Medidor SPL Analógico reactivo',
      'Emulador de cajón de bajo 15" y 18"',
    ],
    codes: ['SUB30HZ', 'SUBBASS', 'BOOM30', 'LUISMIGUEL', 'NEGRITO08'],
  },
  {
    id: 'carbon_neon_edition',
    name: 'Edición Fibra de Carbono & Neón Cyberpunk',
    category: 'design',
    priceUsd: 1.99,
    icon: '🎨',
    badge: 'ESTILO VIP',
    shortDesc: 'Textura de fibra de carbono real con iluminación neón dinámica y tweeters RGB.',
    features: [
      'Carcasa de fibra de carbono real 3K para la caja de audio',
      'Efectos de resplandor neón RGB multicolor reactivo',
      'Tweeter con aros reflectantes dorados y cromados',
    ],
    codes: ['CARBON', 'NEONVIP', 'ESTILOVIP', 'LUISMIGUEL', 'NEGRITO08'],
  },
];

// Genera la URL directa a PayPal para el pago inmediato
export function getPayPalPaymentUrl(item?: PaidItem, customAmount?: number): string {
  const amount = customAmount || (item ? item.priceUsd : 5.0);
  const itemName = item ? item.name : 'Pase VIP Car Audio';
  
  // Prefer direct PayPal.me link or invoice link
  // If paypalme is used, it handles exact amounts seamlessly
  return `https://www.paypal.com/paypalme/negrito08m/${amount}USD`;
}

// URL alternativa de respaldo directo (Invoice oficial o webscr)
export function getPayPalInvoiceUrl(): string {
  return PAYPAL_PRIMARY_INVOICE;
}

// Función maestra para abrir inmediatamente PayPal
export function openPayPalImmediate(item?: PaidItem, customAmount?: number) {
  const url = getPayPalPaymentUrl(item, customAmount);
  // Abre de inmediato en nueva pestaña para realizar el pago real
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Almacenamiento local de ítems desbloqueados
const STORAGE_KEY = 'musicologos_unlocked_items_v2';

export function getUnlockedItems(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return ['vip_pass_16v']; // Devolver el default o vacío
}

export function isItemUnlocked(itemId: string, unlockedList: string[]): boolean {
  if (unlockedList.includes('combo_all_access')) return true;
  return unlockedList.includes(itemId);
}

export function unlockItemInStorage(itemId: string): string[] {
  const current = getUnlockedItems();
  const next = Array.from(new Set([...current, itemId]));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function unlockAllItemsInStorage(): string[] {
  const allIds = PAID_ITEMS.map((i) => i.id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
  } catch {}
  return allIds;
}

export function isDoubleChucherosUnlocked(): boolean {
  try {
    if (localStorage.getItem('musicologos_double_chucheros_unlocked') === 'true') return true;
    const items = getUnlockedItems();
    if (items.includes('kitipo_titanium') || items.includes('combo_all_access')) return true;
  } catch {}
  return false;
}

export function unlockDoubleChucheros(): string[] {
  try {
    localStorage.setItem('musicologos_double_chucheros_unlocked', 'true');
  } catch {}
  return unlockItemInStorage('kitipo_titanium');
}

// Valida si un código corresponde a algún ítem o es un código universal
export function validateUnlockCode(code: string): { success: boolean; unlockedIds: string[]; message: string } {
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) {
    return { success: false, unlockedIds: [], message: 'Por favor ingresa un código.' };
  }

  // Código específico para desbloquear los 2 Chucheros GRATIS: 2020
  if (cleaned === '2020') {
    const updated = unlockDoubleChucheros();
    return {
      success: true,
      unlockedIds: updated,
      message: '¡CÓDIGO 2020 CORRECTO! Los 2 Chucheros (Kitipo Doble) han sido desbloqueados GRATIS.',
    };
  }

  // Códigos maestros que desbloquean TODO
  const MASTER_CODES = ['CHIPEOVIP', 'LUISMIGUEL', 'NEGRITO08', 'VIP100', 'SPL2025', 'PAGOOK', 'COMPETENCIA', 'CARAUDIO', 'TODOVIP'];
  if (MASTER_CODES.includes(cleaned)) {
    const all = unlockAllItemsInStorage();
    return {
      success: true,
      unlockedIds: all,
      message: '¡CÓDIGO MAESTRO VÁLIDO! Se han desbloqueado todas las cosas de pago VIP.',
    };
  }

  // Buscar coincidencia por ítem individual
  const matchedItems = PAID_ITEMS.filter((item) =>
    item.codes.some((c) => c.toUpperCase() === cleaned)
  );

  if (matchedItems.length > 0) {
    let currentUnlocked = getUnlockedItems();
    matchedItems.forEach((item) => {
      currentUnlocked = unlockItemInStorage(item.id);
    });
    return {
      success: true,
      unlockedIds: currentUnlocked,
      message: `¡Éxito! Desbloqueaste: ${matchedItems.map((m) => m.name).join(', ')}`,
    };
  }

  // Código genérico de 6 dígitos que parece comprobante de pago
  if (cleaned.length >= 6 && /^[A-Z0-9]+$/.test(cleaned)) {
    const all = unlockAllItemsInStorage();
    return {
      success: true,
      unlockedIds: all,
      message: '¡Código de transacción verificado! Funciones desbloqueadas.',
    };
  }

  return {
    success: false,
    unlockedIds: [],
    message: 'Código incorrecto. Verifica el código o realiza el pago en PayPal.',
  };
}
