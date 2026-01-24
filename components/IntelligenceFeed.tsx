
import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Loader2, 
  Info,
  ChevronDown,
  AlertTriangle,
  Mail,
  CheckCircle,
  MessageSquare,
  X,
  Send,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractQuoteData } from '../services/gemini';
import { QuoteData, Comment } from '../types';

interface IntelligenceFeedProps {
  quotes: QuoteData[];
  onAddQuote: (quote: QuoteData) => void;
  onUpdateQuote: (quote: QuoteData) => void;
}

const IntelligenceFeed: React.FC<IntelligenceFeedProps> = ({ quotes, onAddQuote, onUpdateQuote }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [disputeModal, setDisputeModal] = useState<QuoteData | null>(null);
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeQuote = quotes.find(q => q.id === activeQuoteId);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = (e.target?.result as string).split(',')[1];
        const extracted = await extractQuoteData(base64);
        const newQuote: QuoteData = {
          id: `Q-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          ...extracted,
          status: extracted.totalCost > 2000 ? 'flagged' : 'analyzed',
          workflowStatus: 'uploaded',
          reliabilityScore: 85,
          timestamp: Date.now(),
          notes: []
        };
        onAddQuote(newQuote);
      } catch (error) { console.error(error); } finally { setIsUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const cycleStatus = (quote: QuoteData) => {
    const statuses: Array<QuoteData['workflowStatus']> = ['uploaded', 'analyzed', 'reviewed', 'approved'];
    const nextIndex = (statuses.indexOf(quote.workflowStatus) + 1) % statuses.length;
    onUpdateQuote({ ...quote, workflowStatus: statuses[nextIndex] });
  };

  const addComment = () => {
    if (!activeQuote || !newComment) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: 'Manager',
      text: newComment,
      timestamp: Date.now()
    };
    onUpdateQuote({ ...activeQuote, notes: [...activeQuote.notes, comment] });
    setNewComment('');
  };

  return (
    <div className="flex gap-8 h-full relative">
      <div className="flex-1 space-y-8 animate-in fade-in duration-500 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Review Queue</h2>
          <div className="flex gap-4">
             <div className="flex -space-x-2">
                {[1, 2].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0e121b] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>)}
                <div className="w-8 h-8 rounded-full border-2 border-[#0e121b] bg-blue-600 flex items-center justify-center text-[10px] font-bold">+1</div>
             </div>
          </div>
        </div>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative h-40 border-2 border-dashed border-zinc-800 bg-[#161c28]/40 hover:bg-[#1c2436]/60 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
        >
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
          <FileText className="text-zinc-600 group-hover:text-blue-500 mb-2" size={32} />
          <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Drop Carrier Quote</p>
          {isUploading && (
            <div className="absolute inset-0 bg-[#0e121b]/90 flex items-center justify-center rounded-xl backdrop-blur-md z-10">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}
        </div>

        <section className="bg-[#121826]/40 border border-zinc-800/50 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/30 text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">
                  <th className="px-6 py-5">Pipeline Status</th>
                  <th className="px-6 py-5">Carrier / Reliability</th>
                  <th className="px-6 py-5">Lane</th>
                  <th className="px-6 py-5 text-blue-400">Total Cost</th>
                  <th className="px-6 py-5">Atlas Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {quotes.map((q) => (
                  <tr key={q.id} className="group hover:bg-zinc-800/20 transition-all cursor-pointer" onClick={() => setActiveQuoteId(q.id)}>
                    <td className="px-6 py-6">
                      <button 
                        onClick={(e) => { e.stopPropagation(); cycleStatus(q); }}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                          q.workflowStatus === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                          q.workflowStatus === 'reviewed' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                          'bg-zinc-800/50 border-zinc-700 text-zinc-500'
                        }`}
                      >
                        {q.workflowStatus}
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-white">{q.carrier}</span>
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className={`h-full ${q.reliabilityScore > 80 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${q.reliabilityScore}%` }} />
                           </div>
                           <span className="text-[9px] font-bold text-zinc-600">{q.reliabilityScore}% Rel.</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-zinc-400">{q.origin} → {q.destination}</td>
                    <td className="px-6 py-6 text-lg font-black font-mono">${q.totalCost.toLocaleString()}</td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-3">
                          {q.status === 'flagged' && !q.disputeDrafted && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setDisputeModal(q); }}
                              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/20"
                              title="Atlas Auto-Dispute"
                            >
                              <Mail size={16} />
                            </button>
                          )}
                          <button className="p-2 bg-zinc-800 hover:bg-blue-600 text-zinc-500 hover:text-white rounded-lg transition-all">
                             <MessageSquare size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Collaboration Sidebar */}
      <AnimatePresence>
        {activeQuoteId && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 bg-[#121826] border-l border-zinc-800 p-6 flex flex-col gap-6 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-40"
          >
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Activity & Notes</h3>
               <button onClick={() => setActiveQuoteId(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
               {activeQuote?.notes.length === 0 ? (
                 <div className="text-center py-10 text-zinc-600 text-xs italic">No internal discussion yet.</div>
               ) : (
                 activeQuote?.notes.map(note => (
                   <div key={note.id} className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">{note.user}</span>
                         <span className="text-[9px] text-zinc-600">Now</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{note.text}</p>
                   </div>
                 ))
               )}
            </div>

            <div className="space-y-3">
               <textarea 
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 placeholder="Tag @team to discuss..."
                 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white resize-none outline-none focus:border-blue-500/50 h-24"
               />
               <button 
                 onClick={addComment}
                 className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
               >
                 <Send size={14} /> Post Update
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Dispute Modal */}
      <AnimatePresence>
        {disputeModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-[#121826] border border-zinc-800 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl"
             >
                <div className="bg-gradient-to-r from-red-600 to-rose-700 p-8 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Zap className="text-white animate-pulse" />
                      <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Atlas Dispute Generator</h3>
                   </div>
                   <button onClick={() => setDisputeModal(null)} className="text-white/60 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-8 space-y-6">
                   <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Drafted Message to {disputeModal.carrier}</div>
                      <div className="text-sm text-zinc-300 font-mono leading-relaxed h-64 overflow-y-auto pr-4">
                        Hi {disputeModal.carrier} Team,<br/><br/>
                        We are reviewing Quote #{disputeModal.id} for the lane {disputeModal.origin} → {disputeModal.destination}.<br/><br/>
                        Our Atlas automated audit has flagged a fuel surcharge (BAF) deviation of +$75.00 compared to our core agreement and historical lane memory. This represents a 12% drift from the agreed-upon index. <br/><br/>
                        Please provide a revised quote aligning with our standard tariff to avoid further escalation in our quarterly Carrier Scorecard review.<br/><br/>
                        Regards,<br/>
                        RateGuard Operations Team
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          onUpdateQuote({ ...disputeModal, disputeDrafted: true });
                          setDisputeModal(null);
                        }}
                        className="flex-1 py-4 bg-white text-[#121826] font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                      >
                        Send Dispute Email
                      </button>
                      <button className="flex-1 py-4 bg-zinc-800 text-zinc-300 font-black uppercase tracking-widest text-xs rounded-2xl border border-zinc-700">
                        Manual Edit
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligenceFeed;
