
import React, { useState } from 'react';

const ContactsPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulando envio para um backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="glass-card p-8 rounded-3xl shadow-xl border border-white/5">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Fale Conosco</h2>
        <p className="text-slate-300 mb-8 font-medium">Participe da nossa programação, envie sua sugestão de notícia ou peça sua música favorita através dos nossos canais oficiais.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <a 
            href="https://wa.me/5543998643958" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center space-x-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)] transition-all duration-300"
          >
            <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">WhatsApp</h4>
              <p className="text-sm text-slate-400 font-medium">(43) 99864-3958</p>
            </div>
          </a>

          <a 
            href="#" 
            className="group flex items-center space-x-4 p-6 bg-pink-500/5 border border-pink-500/10 rounded-2xl hover:bg-pink-500/10 hover:border-pink-500/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(236,72,153,0.2)] transition-all duration-300"
          >
            <div className="p-3 bg-pink-500 rounded-xl text-white shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-white group-hover:text-pink-400 transition-colors">Instagram</h4>
              <p className="text-sm text-slate-400 font-medium">@portal_arapongas</p>
            </div>
          </a>
        </div>

        {/* Formulário de Mensagem Direta */}
        <div className="relative overflow-hidden">
          {isSubmitted ? (
            <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Mensagem Enviada!</h3>
              <p className="text-slate-400 max-w-sm mx-auto mb-8">Obrigado pelo seu contato. Nossa equipe de redação analisará sua mensagem e retornará em breve.</p>
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-xl font-bold text-sm transition-all border border-emerald-500/10"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center space-x-4 mb-6">
                <h3 className="text-lg font-bold text-slate-200">Envie uma Mensagem</h3>
                <div className="h-px flex-1 bg-slate-900"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Seu Nome</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Como podemos te chamar?"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Seu E-mail</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplo.com"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Assunto</label>
                <input 
                  required
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Sugestão, pedido de música, denúncia..."
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mensagem</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Escreva aqui sua mensagem em detalhes..."
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center space-x-3 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Enviar Mensagem</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Localização Extra */}
      <section className="glass-card p-6 rounded-3xl border border-white/5 bg-blue-500/5 flex items-center space-x-6">
        <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 hidden sm:block">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-white">Nossa Redação</h4>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Localizados no coração de Arapongas, PR. <br/>Atendimento administrativo de Segunda a Sexta, das 08h às 18h.</p>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;
