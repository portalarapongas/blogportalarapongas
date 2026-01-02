
import React, { useEffect, useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import Assistant from './components/Assistant';
import WeatherWidget from './components/WeatherWidget';
import NewsSection from './components/NewsSection';
import ContactsPage from './components/ContactsPage';
import { fetchArapongasNews, fetchArapongasWeather, fetchNewsList } from './services/geminiService';
import { WeatherData, NewsArticle, GroundingChunk } from './types';

const STREAM_URL = "https://stream.zeno.fm/27h3k8e5yuquv";

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const Navigation: React.FC<{ mobile?: boolean, onItemClick?: () => void }> = ({ mobile, onItemClick }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const baseClasses = mobile 
    ? "flex flex-col space-y-8 text-2xl font-black uppercase tracking-[0.3em] p-10 pt-16" 
    : "hidden md:flex items-center space-x-12 text-[11px] font-black uppercase tracking-[0.4em]";

  const linkClasses = (path: string) => `
    relative transition-all duration-300 
    ${isActive(path) ? 'text-red-600 nav-link-active' : 'text-slate-400 hover:text-white'}
    ${mobile ? 'border-b border-white/5 pb-4' : ''}
  `;

  return (
    <nav className={baseClasses}>
      <Link to="/" onClick={onItemClick} className={linkClasses('/')}>Início</Link>
      <Link to="/noticias" onClick={onItemClick} className={linkClasses('/noticias')}>Notícias</Link>
      <Link to="/contatos" onClick={onItemClick} className={linkClasses('/contatos')}>Contato</Link>
    </nav>
  );
};

const QuickDock: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-[80] pointer-events-none">
      <div className="glass-card border border-white/20 px-8 py-5 flex items-center justify-between bg-slate-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-[2.5rem] pointer-events-auto">
        <Link to="/" className="flex flex-col items-center group relative">
          <svg className={`w-6 h-6 transition-all ${pathname === '/' ? 'text-red-600 scale-110' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span className={`text-[8px] font-black uppercase tracking-tighter mt-1.5 transition-all ${pathname === '/' ? 'text-red-600' : 'text-slate-600'}`}>Início</span>
        </Link>
        <Link to="/noticias" className="flex flex-col items-center group relative">
          <svg className={`w-6 h-6 transition-all ${pathname === '/noticias' ? 'text-red-600 scale-110' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span className={`text-[8px] font-black uppercase tracking-tighter mt-1.5 transition-all ${pathname === '/noticias' ? 'text-red-600' : 'text-slate-600'}`}>Notícias</span>
        </Link>
        <Link to="/contatos" className="flex flex-col items-center group relative">
          <svg className={`w-6 h-6 transition-all ${pathname === '/contatos' ? 'text-red-600 scale-110' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <span className={`text-[8px] font-black uppercase tracking-tighter mt-1.5 transition-all ${pathname === '/contatos' ? 'text-red-600' : 'text-slate-600'}`}>Contato</span>
        </Link>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [news, setNews] = useState<{ text: string, links: GroundingChunk[] } | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [showQuotaWarning, setShowQuotaWarning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        window.location.reload();
      }
    } catch (e) {
      console.error("Erro ao selecionar chave:", e);
    }
  };

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const weatherResult = await fetchArapongasWeather();
        setWeather(weatherResult);
        if (weatherResult.text.includes("servidor ocupado")) {
          setShowQuotaWarning(true);
        }
      } catch (e) {
        setShowQuotaWarning(true);
      } finally {
        setIsLoadingWeather(false);
      }
    };
    loadWeather();
  }, []);

  const loadInitialContent = useCallback(async () => {
    if (isLoadingNews || news) return;
    setIsLoadingNews(true);
    try {
      const newsResult = await fetchArapongasNews();
      setNews(newsResult);
      const initialArticles = await fetchNewsList(10);
      setArticles(initialArticles);
      
      if (newsResult.text.includes("alta demanda")) {
        setShowQuotaWarning(true);
      }
    } catch (e) {
      console.error("Falha ao sincronizar dados:", e);
      setShowQuotaWarning(true);
    } finally {
      setIsLoadingNews(false);
    }
  }, [isLoadingNews, news]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const moreArticles = await fetchNewsList(6);
      setArticles(prev => [...prev, ...moreArticles]);
    } catch (e) {
      console.error("Erro ao carregar mais notícias:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 flex flex-col transition-all duration-500 ${isMobileMenuOpen ? 'overflow-hidden' : ''}`}>
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-[110] glass-card border-l border-white/10 bg-slate-950/95 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex justify-between items-center border-b border-white/5">
            <img src="logo.png" className="h-8 w-auto grayscale" alt="Portal Logo" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <Navigation mobile onItemClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Quota Warning */}
      {showQuotaWarning && (
        <div className="bg-red-600 text-white px-8 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest z-[120] animate-in slide-in-from-top duration-500">
          <div className="flex items-center space-x-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Limite de requisições excedido. Configure sua chave para continuar.</span>
          </div>
          <button onClick={handleSelectKey} className="bg-white text-red-600 px-4 py-1.5 rounded-lg hover:bg-slate-100 transition-colors shadow-lg">Configurar Chave</button>
        </div>
      )}

      {/* Header Corporativo */}
      <header className="fixed top-0 left-0 right-0 z-[70] glass-card px-6 md:px-12 py-5 border-b border-white/10">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 md:space-x-6 group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#10213d] rounded-full flex items-center justify-center ring-2 ring-white/10 group-hover:ring-red-600 transition-all overflow-hidden p-1.5 shadow-2xl">
              <img 
                src="logo.png" 
                alt="Portal Logo" 
                // @ts-ignore
                fetchpriority="high"
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white group-hover:text-red-600 transition-colors uppercase italic">
                Portal <span className="text-red-600">Arapongas</span>
              </h1>
              <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] italic">A Voz da Cidade dos Pássaros</span>
            </div>
          </Link>
          
          <Navigation />

          {/* Hamburger Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Área de Conteúdo */}
      <main className="pt-28 md:pt-40 pb-44 px-6 md:px-12 max-w-[1500px] mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-40 space-y-10">
            <AudioPlayer streamUrl={STREAM_URL} />
            <WeatherWidget weather={weather} isLoading={isLoadingWeather} />
          </aside>

          {/* Painel Central */}
          <div className="lg:col-span-8">
            <Routes>
              <Route path="/" element={
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <NewsSection 
                    news={news} 
                    isLoading={isLoadingNews} 
                    articles={articles}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    showLoadMore={true}
                    onVisible={loadInitialContent}
                  />
                  <Assistant />
                </div>
              } />
              <Route path="/noticias" element={
                <div className="space-y-16">
                  <NewsSection news={news} isLoading={isLoadingNews} articles={articles} isLoadingMore={isLoadingMore} onLoadMore={handleLoadMore} showLoadMore={true} onVisible={loadInitialContent} />
                </div>
              } />
              <Route path="/contatos" element={<ContactsPage />} />
            </Routes>
          </div>
        </div>
      </main>

      <QuickDock />

      {/* Footer Institucional */}
      <footer className="py-20 border-t border-white/5 text-center bg-slate-950 pb-52">
         <div className="max-w-3xl mx-auto px-8">
           <div className="flex items-center justify-center space-x-6 mb-8">
             <div className="h-px w-12 bg-slate-900"></div>
             <img src="logo.png" className="w-12 h-12 grayscale opacity-20" alt="Portal Arapongas" />
             <div className="h-px w-12 bg-slate-900"></div>
           </div>
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] mb-4 italic">Portal Arapongas Digital © 2025</p>
           <p className="text-[9px] text-slate-600 font-semibold max-w-sm mx-auto uppercase">A voz da Cidade dos Pássaros - Arapongas, PR</p>
         </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
