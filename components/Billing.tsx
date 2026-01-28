
import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle, ShieldCheck, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_PLAN } from '../constants';
import { AppView, UserProfile, Organization } from '../types';

interface BillingProps {
  onViewChange?: (view: AppView) => void;
  userProfile: UserProfile | null;
  orgProfile: Organization | null;
}

const Billing: React.FC<BillingProps> = ({ onViewChange, userProfile, orgProfile }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const isEnterprise = orgProfile?.plan === 'enterprise';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscription Management</h2>
          <p className="text-zinc-500">Managing node: <span className="text-white font-bold">{orgProfile?.name}</span></p>
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
                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest ${isEnterprise ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                  {isEnterprise ? 'Active Enterprise License' : 'Free Tier'}
                </span>
              </div>
              
              <div>
                <h3 className="text-4xl font-black mb-2 uppercase tracking-tight">{isEnterprise ? 'Global Enterprise' : 'Starter Node'}</h3>
                <p className="text-zinc-400 font-medium">{isEnterprise ? 'Full AI processing active.' : 'Limited to 5 free audits.'}</p>
              </div>

              {!isEnterprise && (
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => onViewChange?.('payment')}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/10"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
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
                  <div className="text-sm font-black text-white">{isEnterprise ? 'ACTIVE' : 'NO SUBSCRIPTION'}</div>
                </div>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default Billing;
