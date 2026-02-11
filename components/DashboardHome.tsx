import React, { useState } from 'react';
import { ShieldCheck, Zap, ChevronRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { QuoteData, AppView } from '../types';
import { motion } from 'framer-motion';

interface DashboardHomeProps {
  quotes: QuoteData[];
  onViewChange: (view: AppView) => void;
  onUpdateQuote?: (quote: QuoteData) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ quotes, onViewChange, onUpdateQuote }) => {
  const [isApproving, setIsApproving] = useState(false);
  
  const flaggedCount = quotes?.filter(q => q.status === 'flagged').length || 0;
  const pendingReview = quotes?.filter(q => q.workflowStatus === 'reviewed').length || 0;

  // Calculate Total Recovered
  const totalRecovered = quotes?.reduce((acc, q) => acc + (q.markupCost || 0), 0) || 0;

  const handleBatchApprove = () => {
    if (!onUpdateQuote || !quotes) return;
    setIsApproving(true);
    setTimeout(() => {
      quotes.forEach(q => {
        if (q.workflowStatus === 'reviewed') {
          onUpdateQuote({ ...q, workflowStatus: 'approved' });
        }
      });
      setIsApproving(false);
    }, 1500);
  };
  
  return (
    <motion.div 
      className="space-y-10 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Treasury Digest</h2>
          <p className="text-zinc-500 font-medium">System operational. <span className="text-blue-500 font-bold">FX Spread Protection</span> active.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 shadow-xl shadow-emerald-500/5">
              <div className="p-3 bg-emerald-500 rounded-xl text-white"><ShieldCheck size={20} /></div>
              <div>
                 <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Fees Recovered</div>
                 <div className="text-xl font-black text-white">${totalRecovered.toLocaleString()}</div>
              </div>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flagged Alert Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#121826]/40 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <AlertCircle size={160} />
           </div>
           
           <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                 <Zap className="text-orange-500" /> High Markup Detected
              </h3>
              <span className="px-4 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-500/20">
                 {flaggedCount} High Fees
              </span>
           </div>

           <div className="space-y-4 relative z-10">
              {(!quotes || quotes.filter(q => q.status === 'flagged').length === 0) ? (
                <div className="py-12 text-center text-zinc-600 italic text-sm border-2 border-dashed border-zinc-800 rounded-[2rem]">No excessive markups detected today.</div>
              ) : (
                quotes.filter(q => q.status === 'flagged').slice(0, 2).map(q => (
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={q.id} 
                    className="p-6 bg-zinc-950/80 rounded-[1.5rem] border border-zinc-800 flex items-center justify-between hover:border-red-500/50 transition-all cursor-pointer shadow-lg" 
                    onClick={() => onViewChange('quotes')}
                  >
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center font-black text-zinc-500">{q.bank ? q.bank[0] : '?'}</div>
                        <div>
                          <div className="text-lg font-bold text-white">{q.bank}</div>
                          <div className="text-xs text-zinc-500">{q.pair} • {q.valueDate}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-black text-red-500 font-mono">${q.markupCost?.toFixed(2)}</div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase">Hidden Fee</div>
                    </div>
                  </motion.div>
                ))
              )}
           </div>

           <button onClick={() => onViewChange('quotes')} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 relative z-10">
              View All Audits <ChevronRight size={16} />
           </button>
        </motion.div>

        {/* Manager's Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-8">
           <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-white opacity-10 group-hover:scale-110 transition-transform duration-700">
                <CheckCircle size={100} />
              </div>
              <h4 className="text-2xl font-black tracking-tighter uppercase relative z-10">Dispute Center</h4>
              <p className="text-blue-100 text-sm leading-relaxed relative z-10">
                 You have <span className="font-bold underline underline-offset-4">{pendingReview} audits</span> ready for dispute generation.
              </p>
              <button 
                onClick={handleBatchApprove}
                disabled={pendingReview === 0 || isApproving}
                className={`w-full py-4 bg-white text-blue-600 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 relative z-10 ${pendingReview === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                 {isApproving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                 {isApproving ? 'Generating...' : 'Batch Dispute'}
              </button>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
