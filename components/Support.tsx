
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, BookOpen, Mail, Phone, ExternalLink, Sparkles, Loader2, Send } from 'lucide-react';
import { chatWithAtlas } from '../services/gemini';

const Support: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, text: string}>>([
    { role: 'model', text: "Hello! I'm Atlas, your RateGuard AI assistant. Ask me anything about surcharges, carrier lanes, or platform usage." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isAssistantOpen]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Transform history for Gemini API (excluding current message which is sent as 'message')
      const apiHistory = chatHistory.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const responseText = await chatWithAtlas(userMsg, apiHistory);
      setChatHistory(prev => [...prev, { role: 'model', text: responseText || "I'm having trouble connecting to the neural net." }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Connection to Atlas interrupted. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Help & Support</h2>
          <p className="text-zinc-500">Get technical assistance or consult the RateGuard intelligence base.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Support Live
        </div>
      </div>

      {/* AI Assistant Banner */}
      <div className={`relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] transition-all duration-700 p-10 shadow-2xl shadow-blue-500/20 ${isAssistantOpen ? 'h-[600px]' : 'h-auto'}`}>
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
          <Sparkles size={160} />
        </div>
        
        {!isAssistantOpen ? (
          <div className="relative z-10 max-w-xl space-y-6">
            <h3 className="text-4xl font-black tracking-tighter text-white">Ask Atlas, your AI Co-pilot.</h3>
            <p className="text-blue-100 font-medium leading-relaxed">
              Need help interpreting a complex surcharge? Atlas is trained on global tariff regulations and can explain any logistics line item instantly.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsAssistantOpen(true)}
                className="px-8 py-4 bg-white text-blue-600 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-zinc-100 transition-all active:scale-95"
              >
                Launch Atlas
              </button>
              <button className="px-8 py-4 bg-white/10 text-white border border-white/20 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/20 transition-all">
                Read Docs
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-blue-600">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Atlas Support Assistant</h3>
               </div>
               <button 
                 onClick={() => setIsAssistantOpen(false)}
                 className="text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest"
               >
                 Exit Chat
               </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-black/20 rounded-2xl border border-white/10 space-y-4 custom-scrollbar">
               {chatHistory.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 text-sm ${
                     msg.role === 'user' 
                       ? 'bg-blue-500/40 rounded-2xl rounded-tr-none text-white border border-white/10' 
                       : 'bg-white/10 rounded-2xl rounded-tl-none text-blue-100'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               
               {isTyping && (
                 <div className="flex items-center gap-3 text-white/40 italic text-xs px-2">
                   <Loader2 size={12} className="animate-spin" /> Atlas is processing...
                 </div>
               )}
            </div>

            <div className="relative">
               <input 
                 type="text" 
                 value={chatMessage}
                 onChange={(e) => setChatMessage(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder="Type your question for Atlas..."
                 className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-blue-200/50 outline-none focus:bg-white/20 transition-all"
               />
               <button 
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center hover:scale-105 transition-all"
               >
                  <Send size={18} />
               </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#121826]/40 border border-zinc-800 rounded-2xl p-8 space-y-6 group hover:border-blue-500/30 transition-all">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
            <BookOpen size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">Knowledge Base</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">Browse detailed guides on how to configure lane targets, manage multi-carrier feeds, and export audit reports.</p>
          </div>
          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500 group/btn">
            Browse Articles <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-[#121826]/40 border border-zinc-800 rounded-2xl p-8 space-y-6 group hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
            <MessageCircle size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">Direct Access</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">Enterprise tier members have 24/7 access to our team of former logistics directors for technical and business consulting.</p>
          </div>
          <div className="flex flex-col gap-4 pt-2">
            <a href="mailto:support@rateguard.ai" className="flex items-center gap-3 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
              <Mail size={16} className="text-zinc-600" /> support@rateguard.ai
            </a>
            <span className="flex items-center gap-3 text-xs font-bold text-zinc-400">
              <Phone size={16} className="text-zinc-600" /> +1 (800) RATE-GUARD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
