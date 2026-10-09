export interface ChipeoProfile {
  level: number;
  xp: number;
  xpNextLevel: number;
  soundQuality: number; // percentage 60 - 100
  rankTitle: string;
  totalEqTweaks: number;
  totalPlayTimeSeconds: number;
  badges: string[];
}

export const CHIPEO_RANKS: Array<{ level: number; title: string; minXp: number; nextXp: number; minQuality: number }> = [
  { level: 1, title: 'Novato del Chipeo', minXp: 0, nextXp: 100, minQuality: 60 },
  { level: 2, title: 'Chipero de Esquina', minXp: 100, nextXp: 250, minQuality: 68 },
  { level: 3, title: 'Afinador de Voces & Tweeter', minXp: 250, nextXp: 450, minQuality: 74 },
  { level: 4, title: 'Kitipo Pro SPL', minXp: 450, nextXp: 750, minQuality: 80 },
  { level: 5, title: 'Bajo Pesado 808 Master', minXp: 750, nextXp: 1150, minQuality: 85 },
  { level: 6, title: 'Veterano de Competencia', minXp: 1150, nextXp: 1650, minQuality: 89 },
  { level: 7, title: 'Capo del Car Audio RD', minXp: 1650, nextXp: 2300, minQuality: 93 },
  { level: 8, title: 'Leyenda del Chipeo Quisqueyano', minXp: 2300, nextXp: 3100, minQuality: 96 },
  { level: 9, title: 'Rey Supremo del SPL', minXp: 3100, nextXp: 4200, minQuality: 98 },
  { level: 10, title: 'Máster Luis Miguel Car Audio', minXp: 4200, nextXp: 9999, minQuality: 100 },
];

export const getChipeoProfile = (email: string): ChipeoProfile => {
  const key = `musicologos_chipeo_${email || 'default'}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}

  return {
    level: 1,
    xp: 25,
    xpNextLevel: 100,
    soundQuality: 65,
    rankTitle: 'Novato del Chipeo',
    totalEqTweaks: 0,
    totalPlayTimeSeconds: 0,
    badges: ['Primer Chuchero'],
  };
};

export const saveChipeoProfile = (email: string, profile: ChipeoProfile) => {
  const key = `musicologos_chipeo_${email || 'default'}`;
  try {
    localStorage.setItem(key, JSON.stringify(profile));
  } catch {}
};

export const addChipeoXP = (
  email: string,
  current: ChipeoProfile,
  xpGain: number,
  qualityGain = 1
): { updated: ChipeoProfile; leveledUp: boolean } => {
  let newXp = current.xp + xpGain;
  let newQuality = Math.min(100, current.soundQuality + qualityGain);
  let newLevel = current.level;
  let leveledUp = false;

  // Determine current rank based on total XP
  for (let i = CHIPEO_RANKS.length - 1; i >= 0; i--) {
    const rank = CHIPEO_RANKS[i];
    if (newXp >= rank.minXp) {
      if (rank.level > current.level) {
        leveledUp = true;
      }
      newLevel = rank.level;
      newQuality = Math.max(newQuality, rank.minQuality);
      break;
    }
  }

  const currentRankInfo = CHIPEO_RANKS.find((r) => r.level === newLevel) || CHIPEO_RANKS[0];

  const updated: ChipeoProfile = {
    ...current,
    level: newLevel,
    xp: newXp,
    xpNextLevel: currentRankInfo.nextXp,
    soundQuality: newQuality,
    rankTitle: currentRankInfo.title,
  };

  saveChipeoProfile(email, updated);
  return { updated, leveledUp };
};
