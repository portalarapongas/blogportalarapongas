
import React, { useState } from 'react';
import { askArapongasAssistant } from '../services/geminiService';
import { GroundingChunk } from '../types';

const Assistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<{ text: string, links: GroundingChunk[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    const result = await askArapongasAssistant(query);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="glass-card p-8 rounded-[3rem] shadow-2xl w-full border border-red-500/10 bg-slate-900/40">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-tighter italic">Central de Informações</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sua conexão direta com a redação</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tire suas dúvidas sobre a cidade..."
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl py-5 px-6 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-16 placeholder:text-slate-600 font-semibold text-sm shadow-inner"
        />
        <button 
          disabled={isLoading}
          className="absolute right-3 top-3 bottom-3 w-12 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all disabled:opacity-50 flex items-center justify-center active:scale-90 shadow-lg"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </form>

      {response && (
        <div className="mt-8 bg-black/40 border border-white/5 rounded-3xl p-6 animate-in fade-in slide-in-from-top-2 duration-500 shadow-2xl">
          <p className="text-sm text-slate-300 leading-relaxed font-semibold mb-6">{response.text}</p>
          {response.links && response.links.length > 0 && (
            <div className="pt-6 border-t border-white/5">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Fontes Oficiais:</p>
              <div className="flex flex-wrap gap-2">
                {response.links.map((link, idx) => (
                  link.web && (
                    <a 
                      key={idx} 
                      href={link.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[9px] font-black text-red-500 bg-red-600/5 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-tighter"
                    >
                      {link.web.title || 'Ver Fonte'}
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Assistant;
