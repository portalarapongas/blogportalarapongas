
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NewsArticle, GroundingChunk } from '../types';

interface NewsSectionProps {
  news: { text: string, links: GroundingChunk[] } | null;
  isLoading: boolean;
  articles?: NewsArticle[];
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  showLoadMore?: boolean;
  onVisible?: () => void;
}

const NewsTicker: React.FC<{ articles: NewsArticle[] }> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;
  
  const radioCTAs = [
    "SINTONIZE AGORA!",
    "OUÇA AO VIVO: PORTAL ARAPONGAS",
    "A VOZ DA CIDADE DOS PÁSSAROS",
    "PARTICIPE: (43) 99864-3958",
    "REDAÇÃO 24 HORAS CONECTADA"
  ];

  const tickerItems = useMemo(() => articles.flatMap((art, i) => [
    { type: 'news', content: art.title },
    { type: 'cta', content: radioCTAs[i % radioCTAs.length] }
  ]), [articles]);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#cc1d1d] text-white py-4 overflow-hidden shadow-[0_-15px_40px_rgba(0,0,0,0.6)] border-t border-white/10 backdrop-blur-xl">
      <div className="flex items-center">
        <div className="bg-[#0f172a] px-8 py-2.5 flex items-center z-20 font-black text-[10px] uppercase tracking-tighter italic border-r border-white/10 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-live-dot mr-4"></span>
          PLANTÃO PORTAL
        </div>
        <div className="animate-marquee flex items-center" style={{ animationDuration: '140s' }}>
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span key={idx} className={`inline-flex items-center mx-16 text-[13px] font-black uppercase tracking-tight whitespace-nowrap ${item.type === 'cta' ? 'bg-[#0f172a] px-6 py-1.5 rounded-full border border-white/10' : ''}`}>
              {item.type === 'news' && <span className="text-white/30 mr-8 font-black">/</span>}
              {item.content}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleReader: React.FC<{ article: NewsArticle, onClose: () => void }> = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] bg-slate-900/80 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="sticky top-0 right-0 p-8 flex justify-end z-10 pointer-events-none">
          <button 
            onClick={onClose}
            className="p-4 bg-red-600 text-white rounded-2xl shadow-2xl hover:bg-red-500 transition-all pointer-events-auto active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-8 md:px-16 pb-20 -mt-12">
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-[9px] font-black text-white bg-red-600 px-4 py-1.5 rounded-xl uppercase tracking-widest italic">Redação Oficial</span>
            {article.date && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {new Date(article.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-10 italic tracking-tighter">
            {article.title}
          </h2>
          
          <div className="prose prose-invert max-w-none">
            {article.fullContent?.split('\n').map((para, i) => (
              para.trim() && <p key={i} className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium mb-6 opacity-90">{para}</p>
            ))}
          </div>
          
          <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
            <img src="logo.png" className="h-10 opacity-20 grayscale" alt="Portal Logo" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">© 2025 Portal Arapongas Digital</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedItem: React.FC<{ article: NewsArticle, featured?: boolean, onOpen: (a: NewsArticle) => void }> = ({ article, featured, onOpen }) => {
  const [isRendered, setIsRendered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsRendered(true); observer.unobserve(entry.target); }
    }, { rootMargin: '300px' });
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={itemRef} 
      onClick={() => onOpen(article)}
      className={`glass-card rounded-[3rem] transition-all duration-700 border border-white/5 hover:border-red-600/40 overflow-hidden flex flex-col bg-slate-900/40 group hover:shadow-[0_30px_60px_-15px_rgba(204,29,29,0.3)] cursor-pointer min-h-[320px] ${featured ? 'md:col-span-2' : ''}`}
    >
      {!isRendered ? (
        <div className="p-10 space-y-6"><div className="h-4 bg-slate-800/50 rounded w-1/4 animate-pulse"></div><div className="h-10 bg-slate-800/50 rounded w-4/5 animate-pulse"></div></div>
      ) : (
        <div className="p-10 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center space-x-5 mb-8">
            <span className={`text-[9px] font-black text-white uppercase tracking-widest px-4 py-1.5 rounded-xl italic ${featured ? 'bg-red-600' : 'bg-slate-800'}`}>
              {featured ? 'MANCHETE' : 'NOTÍCIA'}
            </span>
          </div>
          <h4 className={`font-black text-white leading-tight mb-6 group-hover:text-red-600 transition-colors italic ${featured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
            {article.title}
          </h4>
          <p className="text-slate-400 font-bold leading-relaxed mb-10 flex-grow text-sm line-clamp-3">
            {article.summary}
          </p>
          <div className="mt-auto flex items-center text-[10px] font-black text-red-500 uppercase tracking-[0.4em] group-hover:text-red-400 transition-all">
            Abrir Matéria Completa
            <svg className="ml-4 w-5 h-5 group-hover:translate-x-3 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const NewsSection: React.FC<NewsSectionProps> = ({ news, isLoading, articles = [], isLoadingMore, onLoadMore, showLoadMore, onVisible }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [displayLimit, setDisplayLimit] = useState(4);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && onVisible) onVisible(); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onVisible]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || articles.length === 0) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setDisplayLimit(p => Math.min(p + 4, articles.length)); }, { rootMargin: '500px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [articles.length]);

  const visibleArticles = useMemo(() => articles.slice(0, displayLimit), [articles, displayLimit]);

  return (
    <div ref={sectionRef} className="space-y-20">
      <NewsTicker articles={articles} />
      {selectedArticle && <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />}

      <div className="space-y-16">
        <div className="flex items-center justify-between px-6">
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Últimas <span className="text-red-600">Postagens</span></h2>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.6em] mt-3">Central de Jornalismo Portal</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {visibleArticles.map((article, index) => (
            <FeedItem key={index} article={article} featured={index === 0} onOpen={setSelectedArticle} />
          ))}
        </div>
        {displayLimit < articles.length && <div ref={sentinelRef} className="h-20 w-full" />}
        {showLoadMore && articles.length > 0 && displayLimit >= articles.length && (
          <div className="flex justify-center pt-12">
            <button onClick={onLoadMore} disabled={isLoadingMore} className="px-16 py-7 bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800 text-white rounded-[2.5rem] border border-white/10 font-black text-[12px] uppercase tracking-[0.5em] transition-all flex items-center space-x-8 shadow-3xl group">
              {isLoadingMore ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-6 h-6 text-red-600 group-hover:translate-y-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" /></svg>}
              <span>{isLoadingMore ? 'Conectando...' : 'Carregar Mais Notícias'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
