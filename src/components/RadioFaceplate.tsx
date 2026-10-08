import React, { useRef } from 'react';
import { RadioModelDef, Track } from '../types/radio';
import { audioEngine } from '../utils/audioEngine';

interface RadioFaceplateProps {
  model: RadioModelDef;
  djBrandName?: string;
  isOn: boolean;
  isPlaying: boolean;
  volume: number; // 0 - 62
  folderName: string;
  trackIndex: number;
  totalTracks: number;
  currentTrack: Track | null;
  overlayText: string | null;
  displayMode: number;
  onPowerToggle: () => void;
  onPlayToggle: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onNextFolder: () => void;
  onPrevFolder: () => void;
  onVolumeChange: (newVol: number) => void;
  onShuffleToggle: () => void;
  onMuteToggle: () => void;
  onEqCycle: () => void;
  onDispCycle: () => void;
  onPickFolder: () => void;
  onBandPress: () => void;
  onListPress: () => void;
}

export const RadioFaceplate = ({
  model,
  djBrandName = 'MUSICÓLOGOS',
  isOn,
  isPlaying,
  volume,
  folderName,
  trackIndex,
  totalTracks,
  currentTrack,
  overlayText,
  displayMode,
  onPowerToggle,
  onPlayToggle,
  onNextTrack,
  onPrevTrack,
  onNextFolder,
  onPrevFolder,
  onVolumeChange,
  onShuffleToggle,
  onMuteToggle,
  onEqCycle,
  onDispCycle,
  onPickFolder,
  onBandPress,
  onListPress,
}: RadioFaceplateProps) => {
  const knobDragRef = useRef<{ startY: number; startVol: number } | null>(null);

  const isOrig = model.id === 'orig';
  const knobAngle = (volume / 62) * 270 - 135; // -135deg to +135deg

  // Knob interaction
  const handleKnobPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    knobDragRef.current = {
      startY: e.clientY,
      startVol: volume,
    };
  };

  const handleKnobPointerMove = (e: React.PointerEvent) => {
    if (!knobDragRef.current) return;
    const dy = knobDragRef.current.startY - e.clientY;
    const deltaVol = Math.round(dy / 4);
    const newVol = Math.max(0, Math.min(62, knobDragRef.current.startVol + deltaVol));
    if (newVol !== volume) {
      onVolumeChange(newVol);
    }
  };

  const handleKnobPointerUp = (e: React.PointerEvent) => {
    if (knobDragRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      knobDragRef.current = null;
    }
  };

  const handleKnobWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const dir = e.deltaY < 0 ? 1 : -1;
    const newVol = Math.max(0, Math.min(62, volume + dir));
    onVolumeChange(newVol);
  };

  const handleKnobClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If clicked on left half, vol - 1; right half, vol + 1
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isRight = clickX > rect.width / 2;
    const newVol = Math.max(0, Math.min(62, volume + (isRight ? 1 : -1)));
    onVolumeChange(newVol);
    audioEngine.playBeep(1800, 0.03);
  };

  // Custom action dispatcher for model hotspots
  const dispatchAction = (actionKey: string) => {
    audioEngine.playBeep(1800, 0.03);
    switch (actionKey) {
      case 'pw':
        onPowerToggle();
        break;
      case 'tg':
        onPlayToggle();
        break;
      case 'nx':
        onNextTrack();
        break;
      case 'pv':
        onPrevTrack();
        break;
      case 'c1':
        onNextFolder();
        break;
      case 'c0':
        onPrevFolder();
        break;
      case 'sh':
        onShuffleToggle();
        break;
      case 'mu':
        onMuteToggle();
        break;
      case 'eq':
        onEqCycle();
        break;
      case 'dm':
        onDispCycle();
        break;
      case 'ej':
        onPickFolder();
        break;
      case 'bd':
        onBandPress();
        break;
      case 'ls':
        onListPress();
        break;
      case 'rs':
        onPrevTrack();
        break;
      default:
        break;
    }
  };

  // Display texts
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const t1Text = overlayText ? '' : folderName.toUpperCase();
  const t2Text = overlayText ? '' : `${pad2(trackIndex + 1)}/${pad2(totalTracks || 1)}`;
  const titleDisplay = overlayText || (currentTrack ? currentTrack.title.toUpperCase() : 'SIN MUSICA');
  const artistDisplay = overlayText ? '' : currentTrack?.artist?.toUpperCase() || '';

  return (
    <div className="wrap">
      <div className={`face ${isOn ? '' : 'poff'}`} id="face">
        {/* Background artwork */}
        <img
          className="bg"
          src={isOrig ? '/assets/img/radio-deh-4250bt.jpg' : model.src}
          alt={model.name}
        />

        {isOrig && (
          <>
            <div className="a cov om pos-01"></div>
            <div className="a cov om pos-02"></div>
            <div
              className="a om pos-03 flex items-center justify-center overflow-hidden cursor-pointer select-none"
              style={{
                borderRadius: '0.4cqw',
                boxShadow: '0 0 0.8cqw rgba(59,159,230,0.6)',
                height: '4.8cqw',
                top: '44.3%',
                background: '#0a0d14',
                border: '1px solid rgba(59,159,230,0.4)',
              }}
              title="Luis Miguel Musicólogo"
            >
              <img
                src="/assets/img/logo-luis-miguel.png"
                alt="Luis Miguel Musicólogo"
                className="w-full h-full object-contain p-[0.2cqw]"
              />
            </div>
            <div className="a om pos-04"></div>
            <div className="a om pos-05">USB</div>
          </>
        )}

        {/* Pioneer LCD Display */}
        <div
          className="a disp"
          id="dsp"
          style={
            !isOrig && model.lcd
              ? {
                  left: `${model.lcd[0]}%`,
                  top: `${model.lcd[1]}%`,
                  width: `${model.lcd[2]}%`,
                  height: `${model.lcd[3]}%`,
                }
              : undefined
          }
        >
          {isOn && (
            <>
              <div className="t1" id="t1">
                {t1Text}
              </div>
              <div className="t2" id="t2">
                {t2Text}
              </div>
              <div className="t3" id="t3">
                <span id="t3s" className="sc">
                  {titleDisplay}
                </span>
              </div>
              <div className="ic" id="ic">
                {isPlaying ? '▶' : '❚❚'}
              </div>
              <div className="art" id="art">
                {artistDisplay}
              </div>
            </>
          )}
        </div>

        {/* Off cover when stereo is powered off */}
        {!isOn && <div className="a off" id="offl" style={{ display: 'block' }}></div>}

        {/* Volume Rotary Knob */}
        <button
          className="h"
          id="kb"
          title="Volumen: arrastra arriba/abajo, clic izq/der o rueda"
          onPointerDown={handleKnobPointerDown}
          onPointerMove={handleKnobPointerMove}
          onPointerUp={handleKnobPointerUp}
          onPointerCancel={handleKnobPointerUp}
          onWheel={handleKnobWheel}
          onClick={handleKnobClick}
          style={
            !isOrig && model.kb
              ? {
                  left: `${model.kb[0]}%`,
                  top: `${model.kb[1]}%`,
                  width: `${model.kb[2]}%`,
                  height: `${model.kb[3]}%`,
                }
              : undefined
          }
        >
          <i
            className="vln"
            id="kln"
            style={{ transform: `rotate(${knobAngle}deg)` }}
          ></i>
        </button>

        {/* Buttons: Orig model specific hotkeys */}
        {isOrig ? (
          <>
            <button
              className="h om pos-06"
              onClick={() => {
                audioEngine.playBeep(2100, 0.05);
                onPickFolder();
              }}
              title="Eject / Elegir Carpeta"
            ></button>
            <button
              className="h om pos-07"
              onClick={() => {
                audioEngine.playBeep(1700, 0.04);
                onPowerToggle();
              }}
              title="SRC / OFF (Encender/Apagar)"
            ></button>
            <button
              className="h om pos-08"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onPrevTrack();
              }}
              title="Atrás"
            ></button>
            <button
              className="h om pos-09"
              onClick={() => {
                audioEngine.playBeep(2000, 0.03);
                onListPress();
              }}
              title="Teléfono / Bluetooth"
            ></button>
            <button
              className="h om pos-10"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onBandPress();
              }}
              title="BAND"
            ></button>
            <button
              className="h om pos-11"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onListPress();
              }}
              title="Lista de canciones"
            ></button>
            <button
              className="h om pos-12"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onPrevTrack();
              }}
              title="Restart"
            ></button>
            <button
              className="h om pos-13"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onPrevTrack();
              }}
              title="Canción Anterior"
            ></button>
            <button
              className="h om pos-14"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onNextTrack();
              }}
              title="Siguiente Canción"
            ></button>
            <button
              className="h om pos-15"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onPrevFolder();
              }}
              title="1 / Carpeta Anterior"
            ></button>
            <button
              className="h om pos-16"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onNextFolder();
              }}
              title="2 / Carpeta Siguiente"
            ></button>
            <button
              className="h om pos-17"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onShuffleToggle();
              }}
              title="3 / Mix / Shuffle"
            ></button>
            <button
              className="h om pos-18"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onPlayToggle();
              }}
              title="4 / Play / Pausa"
            ></button>
            <button
              className="h om pos-19"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onMuteToggle();
              }}
              title="5 / Mute"
            ></button>
            <button
              className="h om pos-20"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onEqCycle();
              }}
              title="6 / Ecualizador"
            ></button>
            <button
              className="h om pos-21"
              onClick={() => {
                audioEngine.playBeep(1800, 0.03);
                onDispCycle();
              }}
              title="DISP (Modo de pantalla)"
            ></button>
          </>
        ) : (
          /* Other models dynamic hotspots */
          model.hs?.map(([act, coords, title], hIdx) => (
            <button
              key={hIdx}
              className="h"
              style={{
                left: `${coords[0]}%`,
                top: `${coords[1]}%`,
                width: `${coords[2]}%`,
                height: `${coords[3]}%`,
              }}
              onClick={() => dispatchAction(act)}
              title={title}
            ></button>
          ))
        )}
      </div>
    </div>
  );
};
