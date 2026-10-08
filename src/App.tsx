/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { PlaylistFolder, EqUnitState, Track } from './types/radio';
import { MODELS, COLORS } from './utils/models';
import { audioEngine, EQ_PRESETS } from './utils/audioEngine';
import { LoadingScreen } from './components/LoadingScreen';
import { BatteryVoltMeter } from './components/BatteryVoltMeter';
import { EqualizerStack } from './components/EqualizerStack';
import { SpeakerChuchero } from './components/SpeakerChuchero';
import { RadioFaceplate } from './components/RadioFaceplate';
import { QuickToolbar } from './components/QuickToolbar';
import { DjSoundboard } from './components/DjSoundboard';
import { OptionsModal } from './components/OptionsModal';
import { VipKitipoModal } from './components/VipKitipoModal';
import { PromoSidebar } from './components/PromoSidebar';
import { MusicSelectorModal } from './components/MusicSelectorModal';
import { DonationConfigModal, OwnerPaymentConfig } from './components/DonationConfigModal';
import { ApkInstallModal } from './components/ApkInstallModal';

const DEFAULT_PLAYLISTS: PlaylistFolder[] = [
  {
    name: 'DEMBOW & URBANO RD',
    tracks: [
      {
        title: 'Top Urbano RD - Dembow & Trap',
        artist: 'Los Musicólogos Radio',
        url: 'https://radio.dominiserver.com/proxy/topurbano?mp=/stream',
        isStream: true,
      },
      {
        title: 'FieraMix - Dembow Dominicano',
        artist: 'Dembow Hits Quisqueya',
        url: 'https://c11.radioboss.fm:18269/stream',
        isStream: true,
      },
      {
        title: 'Ritmo 96.5 FM - Música Urbana',
        artist: 'Santo Domingo RD',
        url: 'https://stream-49.zeno.fm/y0br5ck4ququv?zs=2R5Njz6XShSzNF_ProbdIA',
        isStream: true,
      },
      {
        title: 'Tropical 100 Mix - Poder Urbano',
        artist: 'Mix Car Audio',
        url: 'https://stream-107.zeno.fm/esgo1lafgtstv?zs=o1G7UIERS3Gdtn2B7Jdt7Q',
        isStream: true,
      },
    ],
  },
  {
    name: 'BASS TEST & CAR AUDIO',
    tracks: [
      {
        title: 'Dembow 808 Subwoofer Test 118 BPM',
        artist: 'Kitipo & Bajos Engine',
        url: '',
        isSynth: true,
        synthType: 'dembow808',
      },
      {
        title: 'Pioneer 50Hz Heavy Subwoofer Bass Sweep',
        artist: 'Car Audio SPL Test',
        url: '',
        isSynth: true,
        synthType: 'bass50',
      },
    ],
  },
  {
    name: 'BACHATA & MERENGUE RD',
    tracks: [
      {
        title: 'Top Bachata RD - Clásicos y Nuevos',
        artist: 'Radio Bachata Quisqueya',
        url: 'https://radio.dominiserver.com/proxy/topbachata?mp=/stream',
        isStream: true,
      },
      {
        title: 'Top Merengue RD - Mambo y Callejero',
        artist: 'Merengue Dominicano',
        url: 'https://radio.dominiserver.com/proxy/topmerengueradio?mp=/stream',
        isStream: true,
      },
      {
        title: 'Top Salsa RD - Estilo Dominicano',
        artist: 'Salsa Car Audio',
        url: 'https://radio.dominiserver.com/proxy/topsalsaradio?mp=/stream',
        isStream: true,
      },
    ],
  },
];

const INITIAL_EQ_UNIT: EqUnitState = {
  vals: {
    sub: 6,
    vol: 0.72,
    fader: 0,
    loud: 0.8,
    b0: 8,
    b1: 6,
    b2: 2,
    b3: 0,
    b4: 2,
    b5: 4,
    b6: 6,
  },
  byp: false,
  custom: {},
};

export default function App() {
  const [isOn, setIsOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(26); // 0-62
  const [prevVolume, setPrevVolume] = useState(26);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  // Appearance states
  const [currentColorIndex, setCurrentColorIndex] = useState(0); // Blue
  const [currentCaseColor, setCurrentCaseColor] = useState('#1c1d21'); // Sleek Carbon by default
  const [currentSpeakerColor, setCurrentSpeakerColor] = useState('#0f70b7');
  const [speakerSize, setSpeakerSize] = useState<6 | 8 | 10 | 12>(6);
  const [currentModelId, setCurrentModelId] = useState('orig');
  const [is14Volt, setIs14Volt] = useState(false);

  // Equalizer units
  const [eqUnits, setEqUnits] = useState<EqUnitState[]>([INITIAL_EQ_UNIT]);
  const [eqPresetIndex, setEqPresetIndex] = useState(0);
  const [displayMode, setDisplayMode] = useState(0);

  // Playlists and Navigation
  const [playlists, setPlaylists] = useState<PlaylistFolder[]>(DEFAULT_PLAYLISTS);
  const [folderIndex, setFolderIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);

  // Overlay text
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const overlayTimerRef = useRef<number | null>(null);

  // Modals
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Owner Custom Payment & DJ Config
  const [paymentConfig, setPaymentConfig] = useState<OwnerPaymentConfig>(() => {
    try {
      const saved = localStorage.getItem('musicologos_owner_payment');
      if (saved && !saved.toLowerCase().includes('negrito')) return JSON.parse(saved);
    } catch {}
    return {
      ownerName: 'Luis Miguel Musicólogo',
      paypalUrl: 'https://www.paypal.com/invoice/p/#GZ9P8RYCZX64484J',
      paypalEmail: '',
      donationAmount: '5',
      donationMessage: '¡Gracias por apoyar a Luis Miguel Musicólogo Car Audio Oficial!',
      whatsapp: '',
      instagram: 'https://discord.gg/FYxevNeSp',
    };
  });

  const handleSavePaymentConfig = (cfg: OwnerPaymentConfig) => {
    setPaymentConfig(cfg);
    try {
      localStorage.setItem('musicologos_owner_payment', JSON.stringify(cfg));
    } catch {}
    showOverlay('DATOS GUARDADOS');
  };

  const showOverlay = useCallback((text: string) => {
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
    }
    setOverlayText(text);
    overlayTimerRef.current = window.setTimeout(() => {
      setOverlayText(null);
    }, 1800);
  }, []);

  // Update Web Audio volume whenever volume changes
  useEffect(() => {
    audioEngine.setVolume(volume, 62);
  }, [volume]);

  // Wire Web Audio on mount and initialize
  useEffect(() => {
    const handleFirstTouch = () => {
      audioEngine.initContext();
      audioEngine.wireUnits(eqUnits);
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };

    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('keydown', handleFirstTouch);

    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, []);

  const curPlaylist = playlists[folderIndex] || playlists[0];
  const curTrack: Track | null = curPlaylist?.tracks[trackIndex] || null;

  // Play a specific track
  const playTrack = useCallback(
    (folderI: number, trackI: number) => {
      const pl = playlists[folderI];
      if (!pl) return;
      const tr = pl.tracks[trackI];
      if (!tr) return;

      audioEngine.initContext();
      audioEngine.wireUnits(eqUnits);

      if (tr.isSynth) {
        audioEngine.audio.pause();
        audioEngine.startDembowBassSynth();
        setIsPlaying(true);
        showOverlay('BASS TEST DEMBOW');
      } else {
        audioEngine.stopSynth();
        const finalUrl =
          tr.url.startsWith('http://') || tr.url.startsWith('https://')
            ? `/api/stream?url=${encodeURIComponent(tr.url)}`
            : tr.url;

        audioEngine.audio.src = finalUrl;
        audioEngine.audio
          .play()
          .then(() => {
            setIsPlaying(true);
            showOverlay(tr.title.slice(0, 16).toUpperCase());
          })
          .catch((err) => {
            console.warn('Playback error with stream proxy, retrying direct:', err);
            audioEngine.audio.src = tr.url;
            audioEngine.audio
              .play()
              .then(() => {
                setIsPlaying(true);
                showOverlay(tr.title.slice(0, 16).toUpperCase());
              })
              .catch((err2) => {
                console.warn('Direct stream failed:', err2);
                showOverlay('ERROR STREAM');
              });
          });
      }
    },
    [playlists, eqUnits, showOverlay]
  );

  // Audio Ended Handler
  useEffect(() => {
    const onEnded = () => {
      if (shuffle) {
        const nextTr = Math.floor(Math.random() * curPlaylist.tracks.length);
        setTrackIndex(nextTr);
        playTrack(folderIndex, nextTr);
      } else {
        const nextTr = (trackIndex + 1) % curPlaylist.tracks.length;
        setTrackIndex(nextTr);
        playTrack(folderIndex, nextTr);
      }
    };

    audioEngine.audio.addEventListener('ended', onEnded);
    return () => {
      audioEngine.audio.removeEventListener('ended', onEnded);
    };
  }, [curPlaylist, trackIndex, folderIndex, shuffle, playTrack]);

  // Player controls
  const handleTogglePlay = () => {
    if (!isOn) return;
    if (isPlaying) {
      audioEngine.audio.pause();
      audioEngine.stopSynth();
      setIsPlaying(false);
      showOverlay('PAUSA');
    } else {
      playTrack(folderIndex, trackIndex);
      showOverlay('PLAY');
    }
  };

  const handleNextTrack = () => {
    if (!isOn || !curPlaylist.tracks.length) return;
    let nextTr = trackIndex + 1;
    if (shuffle) {
      nextTr = Math.floor(Math.random() * curPlaylist.tracks.length);
    } else if (nextTr >= curPlaylist.tracks.length) {
      nextTr = 0;
    }
    setTrackIndex(nextTr);
    playTrack(folderIndex, nextTr);
  };

  const handlePrevTrack = () => {
    if (!isOn || !curPlaylist.tracks.length) return;
    let prevTr = trackIndex - 1;
    if (prevTr < 0) prevTr = curPlaylist.tracks.length - 1;
    setTrackIndex(prevTr);
    playTrack(folderIndex, prevTr);
  };

  const handleNextFolder = () => {
    if (!isOn) return;
    const nextF = (folderIndex + 1) % playlists.length;
    setFolderIndex(nextF);
    setTrackIndex(0);
    showOverlay(playlists[nextF].name.toUpperCase());
    if (isPlaying) {
      playTrack(nextF, 0);
    }
  };

  const handlePrevFolder = () => {
    if (!isOn) return;
    const prevF = (folderIndex - 1 + playlists.length) % playlists.length;
    setFolderIndex(prevF);
    setTrackIndex(0);
    showOverlay(playlists[prevF].name.toUpperCase());
    if (isPlaying) {
      playTrack(prevF, 0);
    }
  };

  const handlePowerToggle = () => {
    if (isOn) {
      audioEngine.audio.pause();
      audioEngine.stopSynth();
      setIsPlaying(false);
      setIsOn(false);
      showOverlay('OFF');
    } else {
      setIsOn(true);
      showOverlay('PIONEER');
    }
  };

  const handleVolumeChange = (newVol: number) => {
    if (!isOn) return;
    setVolume(newVol);
    setIsMuted(false);
    showOverlay(`VOL ${newVol}`);
  };

  const handleVolumeDelta = (delta: number) => {
    if (!isOn) return;
    const nv = Math.max(0, Math.min(62, volume + delta));
    setVolume(nv);
    setIsMuted(false);
    showOverlay(`VOL ${nv}`);
  };

  const handleMuteToggle = () => {
    if (!isOn) return;
    if (isMuted) {
      setVolume(prevVolume || 26);
      setIsMuted(false);
      showOverlay(`VOL ${prevVolume || 26}`);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
      showOverlay('MUTE');
    }
  };

  const handleShuffleToggle = () => {
    if (!isOn) return;
    const n = !shuffle;
    setShuffle(n);
    showOverlay(n ? 'MIX ON' : 'MIX OFF');
  };

  const handleEqCycle = () => {
    if (!isOn) return;
    const nextPreset = (eqPresetIndex + 1) % EQ_PRESETS.length;
    setEqPresetIndex(nextPreset);
    const p = EQ_PRESETS[nextPreset];

    const updated = eqUnits.map((u, i) =>
      i === 0
        ? {
            ...u,
            vals: {
              ...u.vals,
              loud: p.loud,
              sub: p.sub,
              b0: p.bands[0],
              b1: p.bands[1],
              b2: p.bands[2],
              b3: p.bands[3],
              b4: p.bands[4],
              b5: p.bands[5],
              b6: p.bands[6],
            },
          }
        : u
    );

    setEqUnits(updated);
    audioEngine.applyUnits(updated);
    showOverlay(`EQ ${p.name}`);
  };

  const handleDispCycle = () => {
    if (!isOn) return;
    const nextMode = (displayMode + 1) % 3;
    setDisplayMode(nextMode);
    const modes = ['DISP TITULO', 'DISP TRACK', 'DISP RELOJ'];
    showOverlay(modes[nextMode]);
  };

  const handleNextColor = () => {
    const nextIdx = (currentColorIndex + 1) % COLORS.length;
    setCurrentColorIndex(nextIdx);
    if (isOn) {
      showOverlay(`ILLUMI ${COLORS[nextIdx].n}`);
    }
  };

  // Directory Picker (Chrome)
  const handlePickFolder = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        const picker = (window as unknown as { showDirectoryPicker: (opts: { mode: string }) => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker;
        const dirHandle = await picker({ mode: 'read' });
        const audRegex = /\.(mp3|m4a|aac|wav|ogg|opus|flac)$/i;
        const tracks: Track[] = [];

        // Scan directory files
        for await (const [name, handle] of (dirHandle as unknown as { entries: () => AsyncIterable<[string, FileSystemHandle]> }).entries()) {
          if (handle.kind === 'file' && audRegex.test(name)) {
            const file = await (handle as unknown as { getFile: () => Promise<File> }).getFile();
            tracks.push({
              title: name.replace(/\.[^.]+$/, ''),
              artist: dirHandle.name,
              url: URL.createObjectURL(file),
              file: name,
            });
          }
        }

        if (tracks.length > 0) {
          const newFolder: PlaylistFolder = {
            name: dirHandle.name.toUpperCase(),
            tracks,
          };
          setPlaylists((prev) => [newFolder, ...prev]);
          setFolderIndex(0);
          setTrackIndex(0);
          showOverlay(`CARGADA ${tracks.length} PISTAS`);
          playTrack(0, 0);
        } else {
          showOverlay('SIN MUSICA');
        }
      } catch (err) {
        console.warn('Directory Picker cancelled/failed:', err);
      }
    } else {
      // Fallback for Safari/Mobile/Firefox
      setIsMusicOpen(true);
    }
  };

  // Local File Input handler
  const handleFilesSelected = (files: FileList) => {
    const tracks: Track[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      tracks.push({
        title: file.name.replace(/\.[^.]+$/, ''),
        artist: 'USB Local',
        url: URL.createObjectURL(file),
        file: file.name,
      });
    }

    if (tracks.length > 0) {
      const newFolder: PlaylistFolder = {
        name: 'USB LOCAL',
        tracks,
      };
      setPlaylists((prev) => [newFolder, ...prev]);
      setFolderIndex(0);
      setTrackIndex(0);
      showOverlay(`${tracks.length} CANCIONES`);
      playTrack(0, 0);
      setIsMusicOpen(false);
    }
  };

  // Equalizer units count
  const handleSetEqCount = (count: number) => {
    if (count > eqUnits.length) {
      const added: EqUnitState[] = [];
      for (let i = eqUnits.length; i < count; i++) {
        added.push(JSON.parse(JSON.stringify(INITIAL_EQ_UNIT)));
      }
      const updated = [...eqUnits, ...added];
      setEqUnits(updated);
      audioEngine.wireUnits(updated);
    } else if (count < eqUnits.length) {
      const updated = eqUnits.slice(0, count);
      setEqUnits(updated);
      audioEngine.wireUnits(updated);
    }
    showOverlay(`EQ ${count} UNIDADES`);
  };

  const handleResetColors = () => {
    setCurrentColorIndex(0);
    setCurrentCaseColor('#1c1d21');
    setCurrentSpeakerColor('#0f70b7');
    showOverlay('COLORES RESTABLECIDOS');
  };

  const curColor = COLORS[currentColorIndex] || COLORS[0];
  const isRainbow = curColor.hr === undefined;
  const curModel = MODELS[currentModelId] || MODELS.orig;
  const djBrandName = paymentConfig.ownerName.split('·')[0].trim() || 'MUSICÓLOGOS';

  // Keydown shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'c' || e.key === 'C') {
        handleNextColor();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'ArrowRight') {
        handleNextTrack();
      } else if (e.key === 'ArrowLeft') {
        handlePrevTrack();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeDelta(2);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeDelta(-2);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-2 relative overflow-x-hidden font-sans">
      <LoadingScreen brandName={djBrandName} />

      {/* Top Studio Control Header Bar */}
      <header className="w-full max-w-[1376px] px-2.5 mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/img/logo-luis-miguel.png"
            alt="Luis Miguel Logo"
            className="w-9 h-9 rounded-xl object-contain border border-cyan-500/50 shadow-lg shadow-cyan-950/60 bg-black/60 p-0.5"
          />
          <div>
            <div className="font-black tracking-widest text-white uppercase text-sm leading-tight flex items-center gap-1.5">
              <span>LUIS MIGUEL</span>
              <span className="text-cyan-400">MUSICÓLOGO</span>
            </div>
            <div className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
              PIONEER CAR AUDIO PRO
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://discord.gg/FYxevNeSp"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioEngine.playBeep(2000, 0.03)}
            className="py-1.5 px-3 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white font-extrabold transition-all text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-950/60"
            title="Pedir futuras actualizaciones en mi Discord"
          >
            <span>💬 Discord Actualizaciones</span>
          </a>
          <button
            onClick={() => setIsApkModalOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all text-[11px] flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer"
            title="Instalar en Android como APK"
          >
            <span>📲 Instalar APK</span>
          </button>
          <button
            onClick={() => setIsMusicOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-cyan-500 text-cyan-300 font-bold transition-all text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            📻 Emisoras
          </button>
          <a
            href="https://www.paypal.com/invoice/p/#GZ9P8RYCZX64484J"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioEngine.playBeep(2100, 0.04)}
            className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black transition-all text-[11px] flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-900/40"
            title="Abrir factura de pago oficial de PayPal"
          >
            💳 Pagar Factura PayPal
          </a>
        </div>
      </header>

      {/* Main Car Audio Outer Enclosure */}
      <div className="casew">
        <div
          className="case"
          id="case"
          style={{
            ['--cc' as string]: currentCaseColor,
          }}
        >
          {/* Top Battery Voltmeter (12.6V / 14.4V) */}
          <BatteryVoltMeter isOn={isOn} baseVoltage={is14Volt ? 14.4 : 12.6} />

          {/* Equalizer and Faceplate Stack */}
          <div className="cin">
            <div
              className="stack"
              style={{
                ['--hr' as string]: isRainbow ? '0deg' : `${curColor.hr}deg`,
                ['--dh' as string]: isRainbow ? 205 : ((((205 + (curColor.hr || 0)) % 360) + 360) % 360),
              }}
            >
              {/* Equalizer Stack (1 to 5 units) */}
              <EqualizerStack
                units={eqUnits}
                isOn={isOn}
                onUnitsChange={(u) => setEqUnits(u)}
                onOverlayMsg={(msg) => showOverlay(msg)}
              />

              {/* Stereo Faceplate */}
              <RadioFaceplate
                model={curModel}
                djBrandName={djBrandName}
                isOn={isOn}
                isPlaying={isPlaying}
                volume={volume}
                folderName={curPlaylist.name}
                trackIndex={trackIndex}
                totalTracks={curPlaylist.tracks.length}
                currentTrack={curTrack}
                overlayText={overlayText}
                displayMode={displayMode}
                onPowerToggle={handlePowerToggle}
                onPlayToggle={handleTogglePlay}
                onNextTrack={handleNextTrack}
                onPrevTrack={handlePrevTrack}
                onNextFolder={handleNextFolder}
                onPrevFolder={handlePrevFolder}
                onVolumeChange={handleVolumeChange}
                onShuffleToggle={handleShuffleToggle}
                onMuteToggle={handleMuteToggle}
                onEqCycle={handleEqCycle}
                onDispCycle={handleDispCycle}
                onPickFolder={handlePickFolder}
                onBandPress={() => showOverlay('BAND FM1')}
                onListPress={() => setIsMusicOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* DJ Soundboard Launchpad */}
      <DjSoundboard onTrigger={(fx) => showOverlay(fx)} />

      {/* Custom DJ Banner */}
      <div className="rot text-neutral-400 text-xs font-bold tracking-wider my-1">
        🎵 {paymentConfig.ownerName || 'Musicólogos Studio'} · Car Audio Master Edition
      </div>

      {/* Quick Toolbar */}
      <QuickToolbar
        onPrev={handlePrevTrack}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPickFolder={handlePickFolder}
        onVolumeDelta={handleVolumeDelta}
        onNextFolder={handleNextFolder}
        onNextColor={handleNextColor}
        onOpenOptions={() => setIsOptionsOpen(true)}
        onOpenVip={() => setIsVipOpen(true)}
      />

      {/* Chuchero Speaker Box with animated Woofers */}
      <SpeakerChuchero size={speakerSize} color={currentSpeakerColor} />

      {/* Side / Bottom Promotional & Community Cards */}
      <PromoSidebar
        onOpenVip={() => setIsVipOpen(true)}
        onOpenKitipo={() => setIsVipOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenDonationConfig={() => setIsDonationOpen(true)}
        onOpenApk={() => setIsApkModalOpen(true)}
        paymentConfig={paymentConfig}
      />

      {/* Options Modal */}
      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        currentColorIndex={currentColorIndex}
        onSelectColor={(idx) => {
          setCurrentColorIndex(idx);
          showOverlay(`ILLUMI ${COLORS[idx].n}`);
        }}
        currentCaseColor={currentCaseColor}
        onSelectCaseColor={(hex) => {
          setCurrentCaseColor(hex);
          showOverlay('COLOR CAJA');
        }}
        currentSpeakerColor={currentSpeakerColor}
        onSelectSpeakerColor={(hex) => {
          setCurrentSpeakerColor(hex);
          showOverlay('COLOR BOCINA');
        }}
        eqCount={eqUnits.length}
        onSetEqCount={handleSetEqCount}
        onResetColors={handleResetColors}
      />

      {/* VIP & Kitipos Customization Modal */}
      <VipKitipoModal
        isOpen={isVipOpen}
        onClose={() => setIsVipOpen(false)}
        currentSize={speakerSize}
        onSelectSize={(sz) => {
          setSpeakerSize(sz);
          showOverlay(`CHUCHERO ${sz}"`);
        }}
        currentModelId={currentModelId}
        onSelectModel={(mid) => {
          setCurrentModelId(mid);
          showOverlay(MODELS[mid]?.name?.slice(0, 16) || 'MODELO');
        }}
        is14Volt={is14Volt}
        onToggleVolt={(v) => {
          setIs14Volt(v);
          showOverlay(v ? 'TURBO 14.4V' : 'NORMAL 12.6V');
        }}
        onPlaySynthTest={() => {
          setFolderIndex(1);
          setTrackIndex(0);
          playTrack(1, 0);
          setIsVipOpen(false);
        }}
      />

      {/* Music Selector Modal */}
      <MusicSelectorModal
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
        playlists={playlists}
        currentPlaylistIndex={folderIndex}
        currentTrackIndex={trackIndex}
        onSelectTrack={(fI, tI) => {
          setFolderIndex(fI);
          setTrackIndex(tI);
          playTrack(fI, tI);
        }}
        onPickFolder={handlePickFolder}
        onFilesSelected={handleFilesSelected}
      />

      {/* Owner PayPal & Donation Modal */}
      <DonationConfigModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        config={paymentConfig}
        onSaveConfig={handleSavePaymentConfig}
      />

      {/* Android APK Installation Modal */}
      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      <div className="hint text-neutral-500 text-xs mt-6 text-center">
        Musicólogos Studio · Car Audio Dominicano · Chucheros, Kitipos y Bajos Activos
      </div>
    </div>
  );
}
