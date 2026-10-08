import { audioEngine } from '../utils/audioEngine';

interface QuickToolbarProps {
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPickFolder: () => void;
  onVolumeDelta: (delta: number) => void;
  onNextFolder: () => void;
  onNextColor: () => void;
  onOpenOptions: () => void;
  onOpenVip: () => void;
}

export const QuickToolbar = ({
  onPrev,
  onTogglePlay,
  onNext,
  onPickFolder,
  onVolumeDelta,
  onNextFolder,
  onNextColor,
  onOpenOptions,
  onOpenVip,
}: QuickToolbarProps) => {
  return (
    <>
      <div className="tb" id="tb">
        <button
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onPrev();
          }}
          title="Canción anterior"
        >
          ⏮
        </button>
        <button
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onTogglePlay();
          }}
          title="Play / Pausa"
        >
          ⏯
        </button>
        <button
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onNext();
          }}
          title="Siguiente canción"
        >
          ⏭
        </button>
        <button
          onClick={() => {
            audioEngine.playBeep(2000, 0.03);
            onPickFolder();
          }}
          title="Elegir carpeta de música (USB / Archivos)"
        >
          📁
        </button>
        <button
          data-v="-1"
          onClick={() => {
            audioEngine.playBeep(1700, 0.02);
            onVolumeDelta(-2);
          }}
          title="Bajar volumen"
        >
          VOL −
        </button>
        <button
          data-v="1"
          onClick={() => {
            audioEngine.playBeep(1900, 0.02);
            onVolumeDelta(2);
          }}
          title="Subir volumen"
        >
          VOL +
        </button>
        <button
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onNextFolder();
          }}
          title="Siguiente carpeta"
        >
          CARPETA ▶
        </button>
        <button
          onClick={() => {
            audioEngine.playBeep(2100, 0.03);
            onNextColor();
          }}
          title="Cambiar color de iluminación"
        >
          COLOR
        </button>
      </div>

      <div className="flex gap-2 justify-center items-center mt-1">
        <button
          className="optb"
          id="optb"
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onOpenOptions();
          }}
        >
          ⚙️ Opciones
        </button>
        <button
          className="optb bg-amber-600/30 border-amber-500/50 hover:bg-amber-600/50"
          onClick={() => {
            audioEngine.playBeep(2200, 0.03);
            onOpenVip();
          }}
        >
          ⭐ Kitipo & VIP
        </button>
      </div>
    </>
  );
};
