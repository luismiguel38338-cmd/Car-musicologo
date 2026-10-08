import { EqUnitState } from '../types/radio';

export const BANDS: Array<[string, number]> = [
  ['50Hz', 50],
  ['125Hz', 125],
  ['316Hz', 316],
  ['750Hz', 750],
  ['2.2KHz', 2200],
  ['6KHz', 6000],
  ['16KHz', 16000],
];

export const EQ_PRESETS = [
  { name: 'DEMBOW CALLE', loud: 1.2, sub: 9, bands: [8, 6, 2, -1, 3, 5, 7] },
  { name: 'SPL COMPETICION', loud: 1.5, sub: 12, bands: [12, 10, 4, 0, 2, 4, 6] },
  { name: 'BACHATEO FINO', loud: 0.4, sub: 4, bands: [4, 5, 3, 2, 4, 6, 5] },
  { name: 'SALSA DURA', loud: 0.6, sub: 6, bands: [5, 4, 1, 3, 5, 6, 6] },
  { name: 'POWERFUL', loud: 0.5, sub: 5, bands: [6, 5, 2, 0, 1, 3, 4] },
  { name: 'ESTUDIO FLAT', loud: 0, sub: 0, bands: [0, 0, 0, 0, 0, 0, 0] },
];

export interface EqNodeGroup {
  ld: BiquadFilterNode;
  lh: BiquadFilterNode;
  sb: BiquadFilterNode;
  sbc: BiquadFilterNode;
  hp1: BiquadFilterNode;
  hp2: BiquadFilterNode;
  fd: BiquadFilterNode;
  bands: BiquadFilterNode[];
  mg: GainNode;
  in: BiquadFilterNode;
  out: GainNode;
}

class AudioEngine {
  public audio: HTMLAudioElement;
  private ac: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private bus: GainNode | null = null;
  private unitNodes: EqNodeGroup[] = [];
  private freqBuffer: Uint8Array<ArrayBuffer> | null = null;
  private synthInterval: number | null = null;
  private isSynthPlaying = false;
  private eqQ = 1.2;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';
  }

  public initContext(): boolean {
    if (this.ac) {
      if (this.ac.state === 'suspended') {
        this.ac.resume().catch(() => {});
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      const ac = new AudioCtx();
      const cp = ac.createDynamicsCompressor();
      const an = ac.createAnalyser();
      an.fftSize = 2048;
      an.smoothingTimeConstant = 0.6;
      cp.threshold.value = -4;
      cp.knee.value = 6;
      cp.ratio.value = 12;
      cp.attack.value = 0.003;
      cp.release.value = 0.2;

      const bus = ac.createGain();
      bus.connect(cp);
      cp.connect(an);
      an.connect(ac.destination);

      const src = ac.createMediaElementSource(this.audio);

      this.ac = ac;
      this.compressor = cp;
      this.analyser = an;
      this.bus = bus;
      this.source = src;
      return true;
    } catch (e) {
      console.warn('AudioContext init error:', e);
      return false;
    }
  }

  public wireUnits(units: EqUnitState[]) {
    if (!this.ac || !this.source || !this.bus) return;

    // Disconnect old nodes
    try {
      this.source.disconnect();
    } catch {}

    this.unitNodes.forEach((u) => {
      try {
        u.out.disconnect();
      } catch {}
    });

    const ac = this.ac;
    const mkFilter = (type: BiquadFilterType, freq: number, q?: number) => {
      const b = ac.createBiquadFilter();
      b.type = type;
      b.frequency.value = freq;
      if (q !== undefined) b.Q.value = q;
      return b;
    };

    this.unitNodes = units.map(() => {
      const ld = mkFilter('lowshelf', 120);
      const lh = mkFilter('highshelf', 8000);
      const fd = mkFilter('highshelf', 3500);
      const sb = mkFilter('lowshelf', 100);
      const sbc = mkFilter('lowshelf', 250);
      const hp1 = mkFilter('highpass', 15, 0.707);
      const hp2 = mkFilter('highpass', 15, 0.707);
      const bands = BANDS.map((b) => mkFilter('peaking', b[1], this.eqQ));
      const mg = ac.createGain();

      const chain = [ld, lh, sb, sbc, hp1, hp2, fd, ...bands, mg];
      chain.reduce((prev, cur) => {
        prev.connect(cur);
        return cur;
      });

      return {
        ld,
        lh,
        sb,
        sbc,
        hp1,
        hp2,
        fd,
        bands,
        mg,
        in: ld,
        out: mg,
      };
    });

    this.unitNodes.forEach((u) => {
      this.source!.connect(u.in);
      u.out.connect(this.bus!);
    });

    this.bus.gain.setTargetAtTime(1 / Math.max(1, units.length), ac.currentTime, 0.03);
    this.applyUnits(units);
  }

  public applyUnits(units: EqUnitState[]) {
    if (!this.ac || !this.unitNodes.length) return;
    const tt = this.ac.currentTime;

    units.forEach((u, idx) => {
      const n = this.unitNodes[idx];
      if (!n) return;
      const z = u.byp;
      const V = u.vals;
      const s = (param: AudioParam, val: number) => {
        try {
          param.setTargetAtTime(val, tt, 0.03);
        } catch {}
      };

      s(n.ld.gain, z ? 0 : V.loud * 12);
      s(n.lh.gain, z ? 0 : V.loud * 8);
      s(n.fd.gain, z ? 0 : V.fader < 0 ? V.fader * 0.9 : V.fader * 0.25);

      const sv = z ? 0 : V.sub;
      const hf = 15 * Math.pow(160 / 15, Math.max(-sv, 0) / 12);
      s(n.sb.gain, Math.max(sv, 0) * 1.8);
      s(n.sbc.gain, Math.min(sv, 0) * 4);
      s(n.hp1.frequency, hf);
      s(n.hp2.frequency, hf);

      n.bands.forEach((b, bi) => {
        s(b.gain, z ? 0 : (V['b' + bi] ?? 0) * 1.4);
      });

      s(n.mg.gain, (V.vol ?? 0.72) * 1.8);
    });
  }

  public setVolume(val0To62: number, maxVol = 62) {
    const fraction = Math.max(0, Math.min(1, val0To62 / maxVol));
    this.audio.volume = fraction;
  }

  public playBeep(freq = 1900, duration = 0.04) {
    if (!this.ac) return;
    try {
      const osc = this.ac.createOscillator();
      const gain = this.ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ac.currentTime);
      gain.gain.setValueAtTime(0.09, this.ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ac.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ac.destination);
      osc.start();
      osc.stop(this.ac.currentTime + duration);
    } catch {}
  }

  public readAnalyser(): { bass: number; mid: number; treble: number; avgBass: number } {
    if (!this.analyser || !this.ac || (this.audio.paused && !this.isSynthPlaying)) {
      return { bass: 0, mid: 0, treble: 0, avgBass: 0 };
    }

    if (!this.freqBuffer || this.freqBuffer.length !== this.analyser.frequencyBinCount) {
      this.freqBuffer = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
    }

    this.analyser.getByteFrequencyData(this.freqBuffer);
    const hz = this.ac.sampleRate / this.analyser.fftSize;

    const avg = (f1: number, f2: number) => {
      const i1 = Math.max(1, Math.round(f1 / hz));
      const i2 = Math.max(i1, Math.round(f2 / hz));
      let s = 0;
      for (let i = i1; i <= i2; i++) {
        s += this.freqBuffer![i];
      }
      return s / (i2 - i1 + 1) / 255;
    };

    const nz = (x: number, o: number, sp: number) => Math.max(0, Math.min(1, (x - o) / sp));

    const rawB = avg(30, 160);
    const b = Math.pow(nz(rawB, 0.28, 0.52), 1.15);
    const m = nz(avg(160, 2400), 0.22, 0.48);
    const t = nz(avg(2500, 12000), 0.16, 0.45);

    return { bass: b, mid: m, treble: t, avgBass: rawB };
  }

  // Synthesized Dembow / 808 Sub Bass Generator for Bass Testing
  public startDembowBassSynth() {
    this.stopSynth();
    if (!this.initContext() || !this.ac) return;

    this.isSynthPlaying = true;
    let step = 0;
    const bpm = 118;
    const stepMs = (60 / bpm / 4) * 1000;

    this.synthInterval = window.setInterval(() => {
      if (!this.ac || !this.isSynthPlaying) return;
      const cur = this.ac.currentTime;

      // Heavy 808 Dembow Kick on steps 0, 6, 8, 12
      const isKick = step === 0 || step === 6 || step === 8 || step === 12;
      // Snare on steps 4, 10, 14
      const isSnare = step === 4 || step === 10 || step === 14;

      if (isKick) {
        const osc = this.ac.createOscillator();
        const g = this.ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, cur);
        osc.frequency.exponentialRampToValueAtTime(45, cur + 0.18);
        g.gain.setValueAtTime(0.9, cur);
        g.gain.exponentialRampToValueAtTime(0.001, cur + 0.35);
        osc.connect(g);
        if (this.unitNodes[0]) {
          g.connect(this.unitNodes[0].in);
        } else if (this.bus) {
          g.connect(this.bus);
        }
        osc.start(cur);
        osc.stop(cur + 0.36);
      }

      if (isSnare) {
        const osc = this.ac.createOscillator();
        const g = this.ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, cur);
        osc.frequency.exponentialRampToValueAtTime(90, cur + 0.1);
        g.gain.setValueAtTime(0.4, cur);
        g.gain.exponentialRampToValueAtTime(0.001, cur + 0.12);
        osc.connect(g);
        if (this.unitNodes[0]) {
          g.connect(this.unitNodes[0].in);
        } else if (this.bus) {
          g.connect(this.bus);
        }
        osc.start(cur);
        osc.stop(cur + 0.13);
      }

      step = (step + 1) % 16;
    }, stepMs);
  }

  public stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthPlaying = false;
  }

  // DJ Soundboard: Reggaeton / Dembow Air Horn
  public playAirHorn() {
    if (!this.initContext() || !this.ac) return;
    const cur = this.ac.currentTime;
    const freqs = [277, 349, 440, 554]; // Classic brass chord
    const dur = 0.55;

    freqs.forEach((f) => {
      const osc = this.ac!.createOscillator();
      const g = this.ac!.createGain();
      const filter = this.ac!.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, cur);
      osc.frequency.linearRampToValueAtTime(f * 1.02, cur + 0.1);
      osc.frequency.linearRampToValueAtTime(f * 0.98, cur + dur);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(f * 1.8, cur);
      filter.Q.setValueAtTime(3.5, cur);

      g.gain.setValueAtTime(0.001, cur);
      g.gain.linearRampToValueAtTime(0.18, cur + 0.04);
      g.gain.setValueAtTime(0.16, cur + dur - 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, cur + dur);

      osc.connect(filter);
      filter.connect(g);

      if (this.unitNodes[0]) {
        g.connect(this.unitNodes[0].in);
      } else if (this.bus) {
        g.connect(this.bus);
      } else {
        g.connect(this.ac!.destination);
      }

      osc.start(cur);
      osc.stop(cur + dur);
    });
  }

  // DJ Soundboard: Sirena Policial Car Audio
  public playPoliceSiren() {
    if (!this.initContext() || !this.ac) return;
    const cur = this.ac.currentTime;
    const osc = this.ac.createOscillator();
    const g = this.ac.createGain();
    const dur = 0.85;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(580, cur);
    osc.frequency.linearRampToValueAtTime(1180, cur + 0.22);
    osc.frequency.linearRampToValueAtTime(580, cur + 0.44);
    osc.frequency.linearRampToValueAtTime(1180, cur + 0.66);
    osc.frequency.linearRampToValueAtTime(580, cur + dur);

    g.gain.setValueAtTime(0.001, cur);
    g.gain.linearRampToValueAtTime(0.25, cur + 0.05);
    g.gain.setValueAtTime(0.22, cur + dur - 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, cur + dur);

    osc.connect(g);
    if (this.unitNodes[0]) {
      g.connect(this.unitNodes[0].in);
    } else if (this.bus) {
      g.connect(this.bus);
    } else {
      g.connect(this.ac.destination);
    }

    osc.start(cur);
    osc.stop(cur + dur);
  }

  // DJ Soundboard: Láser FX
  public playLaserFx() {
    if (!this.initContext() || !this.ac) return;
    const cur = this.ac.currentTime;
    const osc = this.ac.createOscillator();
    const g = this.ac.createGain();
    const dur = 0.22;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2600, cur);
    osc.frequency.exponentialRampToValueAtTime(140, cur + dur);

    g.gain.setValueAtTime(0.3, cur);
    g.gain.exponentialRampToValueAtTime(0.0001, cur + dur);

    osc.connect(g);
    if (this.unitNodes[0]) {
      g.connect(this.unitNodes[0].in);
    } else if (this.bus) {
      g.connect(this.bus);
    } else {
      g.connect(this.ac.destination);
    }

    osc.start(cur);
    osc.stop(cur + dur);
  }

  // DJ Soundboard: 808 Sub Drop Boom (30Hz Subwoofer Test)
  public playSubDrop() {
    if (!this.initContext() || !this.ac) return;
    const cur = this.ac.currentTime;
    const osc = this.ac.createOscillator();
    const g = this.ac.createGain();
    const dur = 1.3;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, cur);
    osc.frequency.exponentialRampToValueAtTime(32, cur + 0.4);
    osc.frequency.setValueAtTime(32, cur + dur);

    g.gain.setValueAtTime(0.95, cur);
    g.gain.setValueAtTime(0.9, cur + 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, cur + dur);

    osc.connect(g);
    if (this.unitNodes[0]) {
      g.connect(this.unitNodes[0].in);
    } else if (this.bus) {
      g.connect(this.bus);
    } else {
      g.connect(this.ac.destination);
    }

    osc.start(cur);
    osc.stop(cur + dur);
  }

  // DJ Soundboard: Scratch FX
  public playScratch() {
    if (!this.initContext() || !this.ac) return;
    const cur = this.ac.currentTime;
    const osc = this.ac.createOscillator();
    const g = this.ac.createGain();
    const filter = this.ac.createBiquadFilter();
    const dur = 0.28;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, cur);
    osc.frequency.linearRampToValueAtTime(850, cur + 0.1);
    osc.frequency.linearRampToValueAtTime(140, cur + 0.2);
    osc.frequency.linearRampToValueAtTime(620, cur + dur);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, cur);
    filter.Q.setValueAtTime(5, cur);

    g.gain.setValueAtTime(0.35, cur);
    g.gain.exponentialRampToValueAtTime(0.001, cur + dur);

    osc.connect(filter);
    filter.connect(g);

    if (this.unitNodes[0]) {
      g.connect(this.unitNodes[0].in);
    } else if (this.bus) {
      g.connect(this.bus);
    } else {
      g.connect(this.ac.destination);
    }

    osc.start(cur);
    osc.stop(cur + dur);
  }
}

export const audioEngine = new AudioEngine();
