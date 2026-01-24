
import React from 'react';
import { QuoteData } from '../types';
import { Search, Filter, MoreHorizontal, ChevronRight, FileText } from 'lucide-react';

const QuoteHistory: React.FC<{ quotes: QuoteData[] }> = ({ quotes }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Quote Archive</h2>
          <p className="text-zinc-500">Historical performance of processed carrier quotes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <Filter size={16} />
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-all">
            Export Report
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-4">
          <Search size={18} className="text-zinc-500 ml-2" />
          <input 
            type="text" 
            placeholder="Search archive..." 
            className="bg-transparent border-none outline-none text-sm text-zinc-300 w-full placeholder:text-zinc-700"
          />
        </div>

        {quotes.length === 0 ? (
          <div className="py-40 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center text-zinc-800 mb-6 border border-zinc-800 border-dashed">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold text-zinc-400">Empty Archive</h3>
            <p className="text-zinc-600 mt-2">Upload quotes in the Intelligence Feed to populate.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <th className="p-6">Date</th>
                  <th className="p-6">Carrier</th>
                  <th className="p-6">Lane Pair</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all group">
                    <td className="p-6 text-xs text-zinc-500 font-mono">
                      {new Date(q.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-400">
                          {q.carrier.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold">{q.carrier}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm">
                      {q.origin} <span className="text-zinc-600">→</span> {q.destination}
                    </td>
                    <td className="p-6 text-sm font-mono font-bold">
                      ${q.totalCost.toLocaleString()}
                    </td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        q.status === 'flagged' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-600 hover:text-white transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteHistory;
