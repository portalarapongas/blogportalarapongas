
import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  streamUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ streamUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const [hasLogoError, setHasLogoError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsBuffering(true);
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setIsBuffering(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onPause = () => setIsBuffering(false);
    const onCanPlay = () => setIsBuffering(false);
    const onError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
    };

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
    }
  };

  return (
    <div className="glass-card p-8 md:p-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center space-y-10 max-w-md w-full mx-auto border-white/10 relative overflow-hidden text-center bg-slate-950/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <audio ref={audioRef} src={streamUrl} preload="none" />
      
      {/* Container do Logo com Pulsação Orgânica e Hover Zoom */}
      <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full p-2 flex items-center justify-center overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] bg-[#0a1529] border border-white/10 group/player">
        
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'repeating-radial-gradient(circle, #000, #000 1px, transparent 1px, transparent 5px)'
        }}></div>

        {/* Disco Principal com efeito orgânico */}
        <div className={`relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-inner transition-all duration-1000 ${isPlaying && !isBuffering ? 'animate-organic-pulse will-change-transform' : 'scale-[0.98] grayscale-[0.3] opacity-70'} ${!isLogoLoaded ? 'bg-slate-900' : ''}`}>
          
          {/* Overlay de Carregamento (Spinner) */}
          {isBuffering && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300">
              <div className="w-16 h-16 border-[4px] border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          )}

          {!isLogoLoaded && !hasLogoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 animate-pulse z-10">
               <div className="w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          )}

          {hasLogoError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 p-8">
               <span className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] italic">Redação Portal</span>
            </div>
          ) : (
            <img 
              src="logo.png" 
              alt="Logo Portal Arapongas" 
              width="256"
              height="256"
              // @ts-ignore
              fetchpriority="high"
              decoding="async"
              loading="eager"
              className={`w-full h-full object-contain transition-all duration-700 ease-out group-hover/player:scale-110 ${isLogoLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'} ${isBuffering ? 'scale-90 opacity-50 blur-sm' : ''}`}
              onLoad={() => setIsLogoLoaded(true)}
              onError={() => setHasLogoError(true)}
            />
          )}
          
          {/* Eixo Central */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
             <div className="w-12 h-12 bg-slate-950/95 rounded-full border border-white/10 shadow-2xl flex items-center justify-center backdrop-blur-md">
               <div className={`w-3 h-3 rounded-full transition-all duration-700 ${isPlaying && !isBuffering ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]' : 'bg-slate-800'} ${isBuffering ? 'animate-pulse bg-red-400' : ''}`}></div>
             </div>
          </div>
        </div>

        {/* Camada Interativa */}
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/10 transition-all cursor-pointer z-30 group/btn"
          aria-label={isPlaying ? "Pausar rádio" : "Ouvir rádio"}
        >
          {!isPlaying && !isBuffering && (
            <div className="bg-red-600/90 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center text-white shadow-3xl scale-90 opacity-0 group-hover/player:opacity-100 group-hover/player:scale-100 transition-all duration-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Info Centralizada e Visualizador */}
      <div className="flex flex-col items-center justify-center w-full relative z-10 text-center">
        <div className="inline-flex items-center justify-center space-x-4 bg-red-600/10 px-5 py-2 rounded-full border border-red-600/20 mb-6">
           {isPlaying && !isBuffering ? (
             <div className="flex items-end space-x-1 h-4">
               <div className="audio-bar"></div>
               <div className="audio-bar"></div>
               <div className="audio-bar"></div>
               <div className="audio-bar"></div>
             </div>
           ) : isBuffering ? (
             <div className="w-3 h-3 rounded-full border-2 border-red-600 border-t-transparent animate-spin"></div>
           ) : (
             <span className="w-3 h-3 rounded-full bg-red-600 animate-live-dot"></span>
           )}
           <span className="text-[10px] font-black text-white tracking-[0.4em] uppercase italic">
             {isBuffering ? 'CARREGANDO' : 'AO VIVO'}
           </span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none transition-colors duration-500 group-hover/player:text-red-600 flex items-center justify-center">
            PORTAL&nbsp;<span className="text-red-600 transition-colors duration-500 group-hover/player:text-white">ARAPONGAS</span>
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Sintonizado em Alta Fidelidade</p>
        </div>
      </div>

      {/* Botões de Controle */}
      <div className="w-full space-y-6">
        <button 
          onClick={togglePlay}
          className="bg-red-600 text-white rounded-[1.5rem] px-12 py-5 shadow-[0_20px_40px_rgba(204,29,29,0.3)] hover:bg-red-500 transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center space-x-4 w-full border border-red-400/20 group/playbtn"
        >
          {isBuffering ? (
            <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="group-hover/playbtn:translate-x-1 transition-transform">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
            </svg>
          )}
          <span className="font-black uppercase tracking-[0.3em] text-xs">
            {isBuffering ? 'Conectando...' : isPlaying ? 'Pausar Player' : 'Ouvir Agora'}
          </span>
        </button>

        <div className="flex items-center space-x-5 bg-slate-900/60 p-5 rounded-[1.5rem] border border-white/5 shadow-inner group/volume">
          <button onClick={toggleMute} className="text-slate-500 hover:text-red-500 transition-colors flex-shrink-0">
            {isMuted || volume === 0 ? (
               <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>
            ) : (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.011l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/></svg>
            )}
          </button>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600 outline-none hover:h-2 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
