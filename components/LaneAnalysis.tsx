
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { QuoteData } from '../types';

const data = [
  { name: 'Jan', rate: 4000, target: 4100 },
  { name: 'Feb', rate: 4500, target: 4100 },
  { name: 'Mar', rate: 3800, target: 4100 },
  { name: 'Apr', rate: 5100, target: 4100 },
  { name: 'May', rate: 4800, target: 4100 },
  { name: 'Jun', rate: 4200, target: 4100 },
];

const LaneAnalysis: React.FC<{ quotes: QuoteData[] }> = ({ quotes }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">SHA - LGB Index Trend</h3>
            <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded">Updated 5m ago</div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fafafa' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" dot={false} strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold">Carrier Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lane Comparison Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">Benchmarking Matrix</h3>
          <button className="text-sm font-bold text-blue-500 hover:text-blue-400">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lane Pair</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Market</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg. Quote</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Delta</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Volume Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { pair: 'Shanghai → Los Angeles', market: '$4,200', avg: '$4,450', delta: '+5.9%', status: 'High' },
                { pair: 'Singapore → Rotterdam', market: '$2,100', avg: '$2,050', delta: '-2.4%', status: 'Optimal' },
                { pair: 'Mumbai → Savannah', market: '$5,800', avg: '$6,120', delta: '+5.5%', status: 'Flagged' },
              ].map((l, i) => (
                <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                  <td className="p-6 text-sm font-bold">{l.pair}</td>
                  <td className="p-6 text-sm font-mono text-zinc-400">{l.market}</td>
                  <td className="p-6 text-sm font-mono text-zinc-100">{l.avg}</td>
                  <td className={`p-6 text-sm font-bold ${l.delta.startsWith('+') ? 'text-red-500' : 'text-emerald-500'}`}>
                    {l.delta}
                  </td>
                  <td className="p-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      l.status === 'Flagged' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaneAnalysis;
