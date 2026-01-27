
import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle, ShieldCheck, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_PLAN } from '../constants';
import { AppView, UserProfile } from '../types';

interface BillingProps {
  onViewChange?: (view: AppView) => void;
  userProfile: UserProfile | null;
}

const Billing: React.FC<BillingProps> = ({ onViewChange, userProfile }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('switching_providers');
  const [isCancelling, setIsCancelling] = useState(false);

  const isEnterprise = userProfile?.role === 'enterprise';

  const handleCancelClick = () => {
    if (!isEnterprise) {
      alert("You do not have an active Enterprise subscription to cancel.");
      return;
    }
    setShowCancelModal(true);
  };

  const processCancellation = async () => {
    if (!userProfile) return;
    
    setIsCancelling(true);
    try {
      const response = await fetch('https://eoq3v6dahbg66o2.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'frontend_cancel',
          userId: userProfile.uid,
          reason: cancelReason
        })
      });

      if (response.ok) {
        alert("Cancellation request processed. Your subscription will end at the current billing cycle.");
        setShowCancelModal(false);
        // Optionally redirect or refresh
        if (onViewChange) onViewChange('dashboard');
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error(error);
      alert("Could not process cancellation at this time. Please contact support.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
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
                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest ${isEnterprise ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                  {isEnterprise ? 'Active License' : 'Trial Mode: 10 Days Left'}
                </span>
              </div>
              
              <div>
                <h3 className="text-4xl font-black mb-2 uppercase tracking-tight">{PRICING_PLAN.name}</h3>
                <p className="text-zinc-400 font-medium">Full AI processing enabled.</p>
              </div>

              <div className="flex items-baseline gap-2 font-black">
                <span className="text-5xl font-mono">${PRICING_PLAN.price}</span>
                <span className="text-zinc-500 text-xl uppercase tracking-widest">/{PRICING_PLAN.period}</span>
              </div>

              <div className="flex gap-4 pt-4">
                {!isEnterprise && (
                  <button 
                    onClick={() => onViewChange?.('payment')}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/10"
                  >
                    Confirm Subscription
                  </button>
                )}
                <button 
                  onClick={handleCancelClick}
                  className={`px-8 py-4 border rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${isEnterprise ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'border-zinc-800 hover:bg-zinc-800 text-zinc-400'}`}
                >
                  {isEnterprise ? 'Cancel Subscription' : 'Cancel Trial'}
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
                  <div className="text-sm font-black text-white">{isEnterprise ? 'ACTIVE' : 'SUBSCRIPTION PENDING'}</div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Linked to your enterprise account</div>
                </div>
              </div>
              {!isEnterprise && (
                 <button onClick={() => onViewChange?.('payment')} className="text-xs font-black uppercase tracking-widest text-blue-500 hover:underline">Complete Setup</button>
              )}
            </div>

            {!isEnterprise && (
              <div className="mt-8 flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                <AlertCircle className="text-blue-500" size={20} />
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Note: Your RateGuard defense terminal will remain active for <span className="text-white">10 days</span> before the first payment is processed.
                </p>
              </div>
            )}
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
              <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] ${isEnterprise ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              <span className="text-xs font-black text-zinc-200">{isEnterprise ? 'Enterprise Node Online' : 'Trial Period Active'}</span>
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

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="w-full max-w-md bg-[#0e121b] border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative"
            >
               <button 
                  onClick={() => setShowCancelModal(false)}
                  className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="space-y-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
                     <AlertTriangle size={32} />
                  </div>
                  
                  <div className="text-center space-y-2">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight">Confirm Cancellation</h3>
                     <p className="text-zinc-500 text-sm font-medium">
                        Are you sure you want to downgrade your node? You will lose access to Profit Guard™ and historical data.
                     </p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Reason for leaving</label>
                     <select 
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
                     >
                        <option value="too_expensive">Budget Constraints / Too Expensive</option>
                        <option value="switching_providers">Switching to Competitor</option>
                        <option value="project_ended">Project / Contract Ended</option>
                        <option value="features_missing">Missing Key Features</option>
                        <option value="other">Other Reason</option>
                     </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <button 
                        onClick={() => setShowCancelModal(false)}
                        className="py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all"
                     >
                        Keep Node Active
                     </button>
                     <button 
                        onClick={processCancellation}
                        disabled={isCancelling}
                        className="py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"
                     >
                        {isCancelling ? <Loader2 className="animate-spin" size={14} /> : null}
                        {isCancelling ? 'Processing...' : 'Confirm Cancel'}
                     </button>
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Billing;
