
import React from 'react';
import { QuoteData } from '../types';
import { Star, Clock, CheckCircle, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const CarrierScorecards: React.FC<{ quotes: QuoteData[] }> = ({ quotes }) => {
  const carriers = [
    { name: 'Maersk', score: 92, onTime: '98%', claims: '0.2%', trend: 'up' },
    { name: 'MSC', score: 65, onTime: '72%', claims: '4.5%', trend: 'down' },
    { name: 'CMA CGM', score: 88, onTime: '90%', claims: '1.2%', trend: 'up' },
    { name: 'Hapag-Lloyd', score: 81, onTime: '84%', claims: '1.5%', trend: 'up' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Carrier Scorecards</h2>
        <p className="text-zinc-500">The Reliability Layer: Quality of service vs cost benchmarks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {carriers.map(c => (
          <div key={c.name} className="bg-[#121826]/40 border border-zinc-800 rounded-[2rem] p-8 space-y-6 hover:border-blue-500/30 transition-all group">
             <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center font-black text-blue-500">{c.name[0]}</div>
                {c.trend === 'up' ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-red-500" />}
             </div>
             <div>
                <h3 className="text-xl font-black text-white">{c.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                   {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= Math.round(c.score/20) ? "fill-blue-500 text-blue-500" : "text-zinc-800"} />)}
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-zinc-500 font-bold uppercase tracking-widest">Reliability</span>
                   <span className={`font-black ${c.score > 80 ? 'text-emerald-500' : 'text-red-500'}`}>{c.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                   <div className={`h-full ${c.score > 80 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${c.score}%` }} />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                <div className="space-y-1">
                   <div className="text-[10px] font-black text-zinc-600 uppercase">On-Time</div>
                   <div className="text-sm font-bold text-white">{c.onTime}</div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-black text-zinc-600 uppercase">Claims</div>
                   <div className="text-sm font-bold text-white">{c.claims}</div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center">
         <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
            <AlertTriangle size={48} />
         </div>
         <div className="space-y-4">
            <h3 className="text-2xl font-black text-white tracking-tighter">Reliability Warning</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Carrier <span className="text-white font-bold">MSC</span> is currently 15% cheaper than the market average for SHA → LAX, however, Atlas has tracked a <span className="text-red-500 font-bold underline">40% delay rate</span> on this lane over the last 90 days. We recommend prioritizing Hapag-Lloyd for urgent shipments.
            </p>
         </div>
         <button className="px-8 py-4 bg-white text-[#121826] font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shrink-0 hover:scale-105 transition-all">
            Optimize Route
         </button>
      </div>
    </div>
  );
};

export default CarrierScorecards;
