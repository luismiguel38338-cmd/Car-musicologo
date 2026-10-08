export interface RadioModelDef {
  id: string;
  name: string;
  src?: string;
  ar?: string;
  kb?: [number, number, number, number]; // [x, y, w, h] %
  lcd?: [number, number, number, number];
  cov?: string;
  bh: number;
  dc: number;
  hs?: Array<[string, [number, number, number, number], string]>;
}

export interface Track {
  title: string;
  artist: string;
  url: string;
  file?: string;
  isStream?: boolean;
  isSynth?: boolean;
  synthType?: 'bass50' | 'dembow808' | 'sweep';
}

export interface PlaylistFolder {
  name: string;
  tracks: Track[];
}

export interface ColorDef {
  n: string;
  hr?: number; // undefined means RAINBOW
}

export interface CaseColorDef {
  name: string;
  hex: string;
}

export interface EqUnitVals {
  sub: number;
  vol: number;
  fader: number;
  loud: number;
  b0: number; // 50Hz
  b1: number; // 125Hz
  b2: number; // 316Hz
  b3: number; // 750Hz
  b4: number; // 2.2KHz
  b5: number; // 6KHz
  b6: number; // 16KHz
  [key: string]: number;
}

export interface EqUnitState {
  vals: EqUnitVals;
  byp: boolean;
  custom: Record<string, number>;
}
