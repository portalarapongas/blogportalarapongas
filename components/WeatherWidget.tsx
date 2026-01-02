
import React from 'react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card p-4 rounded-2xl animate-pulse border border-white/5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-800 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col space-y-3 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Clima Atual</h4>
          <p className="text-slate-100 text-sm font-medium leading-tight">
            {weather.text}
          </p>
        </div>
      </div>
      
      {/* Extract website URLs from groundingChunks and list them as links per Gemini API rules */}
      {weather.links && weather.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {weather.links.map((link, idx) => (
            link.web && link.web.uri && (
              <a 
                key={idx} 
                href={link.web.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] font-bold text-yellow-500/60 hover:text-yellow-500 transition-colors uppercase tracking-tighter"
              >
                • {link.web.title || 'Fonte Meteorológica'}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
