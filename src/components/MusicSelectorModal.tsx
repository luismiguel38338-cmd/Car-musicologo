import React, { useRef } from 'react';
import { PlaylistFolder, Track } from '../types/radio';
import { audioEngine } from '../utils/audioEngine';

interface MusicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: PlaylistFolder[];
  currentPlaylistIndex: number;
  currentTrackIndex: number;
  onSelectTrack: (folderIdx: number, trackIdx: number) => void;
  onPickFolder: () => void;
  onFilesSelected: (files: FileList) => void;
}

export const MusicSelectorModal: React.FC<MusicSelectorModalProps> = ({
  isOpen,
  onClose,
  playlists,
  currentPlaylistIndex,
  currentTrackIndex,
  onSelectTrack,
  onPickFolder,
  onFilesSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  return (
    <div className="vm opt show" role="dialog" aria-label="Explorador de Música y Emisoras">
      <div className="vc max-w-xl">
        <button
          className="vx"
          aria-label="Cerrar"
          onClick={() => {
            audioEngine.playBeep(1800, 0.03);
            onClose();
          }}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-white">
          📁 Explorador de Música & Emisoras en Vivo
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          Selecciona una emisora de Los Musicólogos, prueba los bajos o carga tus propios archivos MP3.
        </p>

        {/* Action Buttons for User Files */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => {
              audioEngine.playBeep(1900, 0.03);
              onPickFolder();
            }}
            className="p-3 rounded-xl bg-blue-600/30 border border-blue-500/50 hover:bg-blue-600/40 text-blue-200 text-xs font-bold text-center"
          >
            📂 Abrir Carpeta USB (Chrome)
          </button>
          <button
            onClick={() => {
              audioEngine.playBeep(1900, 0.03);
              fileInputRef.current?.click();
            }}
            className="p-3 rounded-xl bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/40 text-purple-200 text-xs font-bold text-center"
          >
            🎵 Subir Canciones MP3 (Celular/PC)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length) {
                onFilesSelected(e.target.files);
              }
            }}
          />
        </div>

        {/* Playlists & Tracks List */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {playlists.map((folder, fIdx) => (
            <div key={folder.name} className="bg-neutral-900/80 rounded-xl p-3 border border-neutral-800">
              <div className="flex items-center justify-between font-bold text-xs text-amber-400 tracking-wider mb-2">
                <span>📁 {folder.name.toUpperCase()}</span>
                <span className="text-neutral-500">{folder.tracks.length} Pistas</span>
              </div>
              <div className="space-y-1">
                {folder.tracks.map((t: Track, tIdx: number) => {
                  const isCurrent = fIdx === currentPlaylistIndex && tIdx === currentTrackIndex;
                  return (
                    <button
                      key={tIdx}
                      onClick={() => {
                        audioEngine.playBeep(1800, 0.03);
                        onSelectTrack(fIdx, tIdx);
                        onClose();
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="text-neutral-400 mr-2">
                          {String(tIdx + 1).padStart(2, '0')}.
                        </span>
                        <span>{t.title}</span>
                        {t.artist && (
                          <span className="text-neutral-400 text-[11px] ml-1">
                            · {t.artist}
                          </span>
                        )}
                      </div>
                      {isCurrent ? (
                        <span className="text-amber-300">▶</span>
                      ) : (
                        <span className="text-neutral-600 text-[10px]">REPRODUCIR</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
