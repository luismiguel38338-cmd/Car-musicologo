import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import coolerPhoto from '../assets/images/musicologos-cooler.webp';
import type { SpeakerSize, TweeterType } from '../types/radio';
import { audioEngine } from '../utils/audioEngine';
import './MusicologosCooler.css';

interface MusicologosCoolerProps {
  size: SpeakerSize;
  color: string;
  tweeterType: TweeterType;
  isPlaying: boolean;
  onSizeChange: (size: SpeakerSize) => void;
  onTweeterTypeChange: (type: TweeterType) => void;
}

const speakerSizes: SpeakerSize[] = [6, 8, 10, 12];

const tweeterOptions: Array<{ id: TweeterType; label: string; detail: string }> = [
  { id: 'bala', label: 'Bala', detail: 'Agudo directo' },
  { id: 'fenolico', label: 'Fenólico', detail: 'Medios cálidos' },
  { id: 'super', label: 'Súper', detail: 'Brillo extendido' },
];

const cones = [
  { x: 39.9, y: 22.7, diameter: 14, band: 'bass' },
  { x: 54.7, y: 22.9, diameter: 13.7, band: 'bass' },
  { x: 29.3, y: 34.5, diameter: 15.2, band: 'bass' },
  { x: 63.4, y: 34.6, diameter: 15.2, band: 'bass' },
  { x: 24.8, y: 21, diameter: 7.8, band: 'mid' },
  { x: 68.4, y: 22, diameter: 7.4, band: 'mid' },
  { x: 48.8, y: 32.8, diameter: 7.8, band: 'mid' },
  { x: 42.3, y: 36.4, diameter: 7.6, band: 'treble' },
  { x: 53.7, y: 36.4, diameter: 7.6, band: 'treble' },
] as const;

const tweeterCopy: Record<TweeterType, string> = {
  bala: 'Ataque rápido, presencia al frente.',
  fenolico: 'Voces llenas con un tono suave.',
  super: 'Detalle brillante que llega más lejos.',
};

export function MusicologosCooler({
  size,
  color,
  tweeterType,
  isPlaying,
  onSizeChange,
  onTweeterTypeChange,
}: MusicologosCoolerProps) {
  const coneRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const elements = coneRefs.current;
    let frameId = 0;
    let previousFrame = 0;
    let bass = 0;
    let mid = 0;
    let treble = 0;

    const settle = () => {
      elements.forEach((element) => {
        element?.style.setProperty('--mc-motion', '0');
        element?.style.setProperty('--mc-energy', '0');
      });
    };

    if (!isPlaying) {
      settle();
      return undefined;
    }

    const animate = (timestamp: number) => {
      frameId = 0;
      if (timestamp - previousFrame < 1000 / 30) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      previousFrame = timestamp;

      const active = audioEngine.isVisualizationActive();
      const signal = active ? audioEngine.readAnalyser() : { bass: 0, mid: 0, treble: 0, avgBass: 0 };
      bass += (signal.bass - bass) * (signal.bass > bass ? 0.42 : 0.14);
      mid += (signal.mid - mid) * (signal.mid > mid ? 0.36 : 0.15);
      treble += (signal.treble - treble) * (signal.treble > treble ? 0.34 : 0.16);

      elements.forEach((element) => {
        if (!element) return;
        const level = element.dataset.band === 'bass' ? bass : element.dataset.band === 'treble' ? treble : mid;
        element.style.setProperty('--mc-motion', (1 + level * (element.dataset.band === 'bass' ? 0.035 : 0.022)).toFixed(4));
        element.style.setProperty('--mc-energy', level.toFixed(3));
      });

      const hasResidual = bass > 0.004 || mid > 0.004 || treble > 0.004;
      if (active || hasResidual) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        bass = 0;
        mid = 0;
        treble = 0;
        settle();
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      settle();
    };
  }, [isPlaying]);

  const componentStyle = { '--mc-accent': color || '#318cff' } as CSSProperties;

  return (
    <section
      className={`mc-preview${isPlaying ? ' mc-preview--playing' : ''}`}
      style={componentStyle}
      aria-label="Musicólogos Studio cooler preview"
    >
      <header className="mc-header">
        <div>
          <div className="mc-eyebrow"><span className="mc-mark" aria-hidden="true" /> MUSICÓLOGOS STUDIO</div>
          <h2 className="mc-title">Tu sonido, <span>a tu manera.</span></h2>
          <p className="mc-intro">Configura el cooler. Siente cómo responde.</p>
        </div>
        <div className={`mc-live${isPlaying ? ' is-live' : ''}`} aria-live="polite">
          <span className="mc-live-dot" />
          {isPlaying ? 'EN SESIÓN' : 'EN PAUSA'}
        </div>
      </header>

      <div className="mc-layout">
        <figure className={`mc-scene mc-tweeter-${tweeterType}`} data-size={size}>
          <div className="mc-image-wrap">
            <img
              className="mc-photo"
              src={coolerPhoto}
              alt="Cooler blanco con un montaje de bocinas azules"
              draggable={false}
            />
            <div className="mc-cone-layer" aria-hidden="true">
              {cones.map((cone, index) => (
                <span
                  key={`${cone.band}-${index}`}
                  ref={(element) => { coneRefs.current[index] = element; }}
                  className={`mc-cone mc-cone--${cone.band}`}
                  data-band={cone.band}
                  style={{
                    left: `${cone.x}%`,
                    top: `${cone.y}%`,
                    width: `${cone.diameter}%`,
                  }}
                />
              ))}
            </div>
            <div className="mc-photo-shade" aria-hidden="true" />
            <div className="mc-image-caption">
              <span>MONTAJE PERSONALIZADO</span>
              <span className="mc-caption-line" />
              <span>RD · STUDIO</span>
            </div>
            <div className="mc-image-size"><strong>{size}"</strong><span>BAJO</span></div>
          </div>
          <figcaption className="mc-scene-caption">
            <span><i className="mc-caption-led" /> Tu configuración actual</span>
            <span>{size}" · {tweeterOptions.find((item) => item.id === tweeterType)?.label}</span>
          </figcaption>
        </figure>

        <div className="mc-controls">
          <section className="mc-control-group" aria-labelledby="mc-size-heading">
            <div className="mc-control-heading">
              <div>
                <span className="mc-step">01 / POTENCIA</span>
                <h3 id="mc-size-heading">Tamaño del bajo</h3>
              </div>
              <span className="mc-current">{size} <small>IN</small></span>
            </div>
            <div className="mc-size-options" role="group" aria-label="Tamaño de bocina">
              {speakerSizes.map((option) => (
                <button
                  key={option}
                  className={`mc-size-option${size === option ? ' is-selected' : ''}`}
                  type="button"
                  aria-pressed={size === option}
                  onClick={() => onSizeChange(option)}
                >
                  <span>{option}</span>
                  <small>IN</small>
                </button>
              ))}
            </div>
            <p className="mc-hint">Elige el diámetro de tus bajos.</p>
          </section>

          <section className="mc-control-group mc-tweeter-control" aria-labelledby="mc-tweeter-heading">
            <div className="mc-control-heading">
              <div>
                <span className="mc-step">02 / AGUDOS</span>
                <h3 id="mc-tweeter-heading">Tipo de tweeter</h3>
              </div>
              <span className="mc-tweeter-symbol" aria-hidden="true">T</span>
            </div>
            <div className="mc-tweeter-options" role="group" aria-label="Tipo de tweeter">
              {tweeterOptions.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  className={`mc-tweeter-option${tweeterType === option.id ? ' is-selected' : ''}`}
                  aria-pressed={tweeterType === option.id}
                  onClick={() => onTweeterTypeChange(option.id)}
                >
                  <span className="mc-option-number">0{index + 1}</span>
                  <span className="mc-option-label">{option.label}</span>
                  <span className="mc-option-detail">{option.detail}</span>
                  <span className="mc-option-check" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="mc-tweeter-note">{tweeterCopy[tweeterType]}</p>
          </section>

          <div className="mc-signal-note">
            <span className="mc-wave-icon" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <p><strong>La música manda.</strong> El movimiento sigue la señal de tu reproductor.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MusicologosCooler;
