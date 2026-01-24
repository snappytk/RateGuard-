
import React from 'react';
import { CreditCard, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { PRICING_PLAN } from '../constants';
import { AppView } from '../types';

interface BillingProps {
  onViewChange?: (view: AppView) => void;
}

const Billing: React.FC<BillingProps> = ({ onViewChange }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscription Management</h2>
          <p className="text-zinc-500">Manage your enterprise license and payout methods.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Current Plan */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-blue-500/10 pointer-events-none">
              <ShieldCheck size={120} />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20 tracking-widest">Trial Mode: 10 Days Left</span>
              </div>
              
              <div>
                <h3 className="text-4xl font-black mb-2 uppercase tracking-tight">{PRICING_PLAN.name}</h3>
                <p className="text-zinc-400 font-medium">Full AI processing enabled during trial period.</p>
              </div>

              <div className="flex items-baseline gap-2 font-black">
                <span className="text-5xl font-mono">${PRICING_PLAN.price}</span>
                <span className="text-zinc-500 text-xl uppercase tracking-widest">/{PRICING_PLAN.period}</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => onViewChange?.('payment')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/10"
                >
                  Confirm Subscription
                </button>
                <button className="px-8 py-4 border border-zinc-800 hover:bg-zinc-800 rounded-2xl font-black uppercase text-xs tracking-widest transition-all text-zinc-400">
                  Cancel Trial
                </button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-lg font-black mb-6 flex items-center gap-3 uppercase tracking-tight">
              <CreditCard className="text-zinc-500" />
              Primary Payout Node
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-zinc-950 border border-zinc-800 rounded-[1.5rem] gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-10 bg-zinc-800 rounded-lg flex items-center justify-center font-black italic shadow-lg">PayPal</div>
                <div>
                  <div className="text-sm font-black text-white">SUBSCRIPTION PENDING</div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Linked to your enterprise account</div>
                </div>
              </div>
              <button onClick={() => onViewChange?.('payment')} className="text-xs font-black uppercase tracking-widest text-blue-500 hover:underline">Complete Setup</button>
            </div>

            <div className="mt-8 flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <AlertCircle className="text-blue-500" size={20} />
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Note: Your RateGuard defense terminal will remain active for <span className="text-white">10 days</span> before the first payment is processed.
              </p>
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-xl">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Included Defense Protocols</h4>
            <ul className="space-y-5">
              {PRICING_PLAN.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-zinc-300 font-medium leading-relaxed">
                  <Check size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-xl">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Node Status</h4>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-xs font-black text-zinc-200">Trial Period Active</span>
            </div>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed font-medium">
              Access to full Atlas AI and Profit Guard capabilities. Audit up to 500 documents per day.
            </p>
            <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Manage Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
