
import React from 'react';
import { QuoteData } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  PieChart, 
  TrendingDown, 
  Globe, 
  CheckCircle2,
  X 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';

interface QuoteAnalysisProps {
  quote: QuoteData;
  onClose: () => void;
}

const QuoteAnalysis: React.FC<QuoteAnalysisProps> = ({ quote, onClose }) => {
  const data = [
    { name: 'Bank Fees', value: quote.totalFees, color: '#3b82f6' },
    { name: 'Spread Markup', value: quote.markupCost, color: '#ef4444' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-[#121826]/60 border border-zinc-800 rounded-[2.5rem] p-8 h-full overflow-y-auto custom-scrollbar relative shadow-2xl"
    >
       <button 
         onClick={onClose}
         className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
       >
         <X size={20} />
       </button>

       <div className="space-y-8">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-800 mb-4">
                <ShieldCheck size={12} /> Reliability Score: {quote.reliabilityScore || 85}/100
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter mb-1">{quote.bank} Analysis</h2>
             <p className="text-zinc-500 font-mono text-sm">{quote.pair} • ${quote.amount?.toLocaleString()} Volume</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-zinc-900 rounded-[1.5rem] border border-zinc-800 space-y-2">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Hidden Cost</div>
                <div className="text-3xl font-black text-red-500">${quote.totalHiddenCost?.toFixed(2)}</div>
                <div className="text-xs text-red-400 font-medium">{quote.totalHiddenPercentage?.toFixed(2)}% of Principal</div>
             </div>
             <div className="p-6 bg-zinc-900 rounded-[1.5rem] border border-zinc-800 space-y-2">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">Spread Analysis</div>
                <div className="text-xl font-mono text-white">
                   <span className="text-zinc-500">Rate:</span> {quote.exchangeRate}
                </div>
                <div className="text-xs text-emerald-500 font-mono">Mid: {quote.midMarketRate}</div>
             </div>
          </div>

          {/* Visualization */}
          <div className="p-6 bg-zinc-900/50 rounded-[1.5rem] border border-zinc-800 flex items-center gap-6">
             <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                   <RePie>
                      <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={40} paddingAngle={5} dataKey="value">
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                   </RePie>
                </ResponsiveContainer>
             </div>
             <div className="space-y-2 text-xs">
                {data.map(d => (
                   <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-zinc-400">{d.name}</span>
                      <span className="text-white font-bold">${d.value?.toFixed(2)}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Industry Benchmark */}
          <div className="space-y-4">
             <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Globe size={14} /> Market Context
             </h3>
             <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-zinc-400">Industry Avg Spread</span>
                   <span className="text-white font-bold">{quote.industryAverageSpread}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-zinc-400">Your Spread</span>
                   <span className={`font-bold ${quote.betterThanIndustry ? 'text-emerald-500' : 'text-red-500'}`}>
                      {quote.spreadPercentage?.toFixed(2)}%
                   </span>
                </div>
                <div className="pt-2 border-t border-zinc-800/50">
                   <span className={`text-xs font-bold ${quote.betterThanIndustry ? 'text-emerald-500' : 'text-red-500'}`}>
                      {quote.betterThanIndustry ? 'Performing better than 75% of peers' : `Performing worse than average (${quote.percentileRank})`}
                   </span>
                </div>
             </div>
          </div>

          {/* Dispute Action */}
          {quote.dispute?.recommended ? (
             <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] space-y-4">
                <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
                   <AlertTriangle size={14} /> Dispute Recommended
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                   {quote.dispute.reason} <br/>
                   <span className="text-white font-bold">Potential Savings: ${quote.dispute.potentialSavingsPerTransaction.toFixed(2)}</span>
                </p>
                <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                   <FileText size={16} /> Generate Letter
                </button>
             </div>
          ) : (
             <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] flex items-center gap-4">
                <CheckCircle2 size={24} className="text-emerald-500" />
                <div>
                   <div className="text-emerald-500 font-bold text-sm">Fair Execution Verified</div>
                   <div className="text-emerald-500/60 text-xs">Rate is within competitive bounds.</div>
                </div>
             </div>
          )}
       </div>
    </motion.div>
  );
};

export default QuoteAnalysis;
