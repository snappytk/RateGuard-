
import React from 'react';
import { CreditCard, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { PRICING_PLAN } from '../constants';

const Billing: React.FC = () => {
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
            <div className="absolute top-0 right-0 p-8">
              <ShieldCheck size={40} className="text-blue-500/20" />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold uppercase rounded-full border border-blue-500/20">Active Plan</span>
                <span className="text-zinc-500 text-xs font-medium">Next billing date: Oct 12, 2024</span>
              </div>
              
              <div>
                <h3 className="text-4xl font-bold mb-2">{PRICING_PLAN.name}</h3>
                <p className="text-zinc-400">Unlimited AI processing for high-volume forwarders.</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-mono">${PRICING_PLAN.price}</span>
                <span className="text-zinc-500 text-xl">/{PRICING_PLAN.period}</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all">
                  Upgrade Plan
                </button>
                <button className="px-6 py-3 border border-zinc-800 hover:bg-zinc-800 rounded-xl font-bold transition-all text-zinc-400">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <CreditCard className="text-zinc-500" />
              Primary Payment Method
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-zinc-950 border border-zinc-800 rounded-2xl gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold italic shadow-lg shadow-blue-500/20">PayPal</div>
                <div>
                  <div className="text-sm font-bold">PayPal Standard Subscriptions</div>
                  <div className="text-xs text-zinc-500">Linked to user@company.com</div>
                </div>
              </div>
              <button className="text-sm font-bold text-blue-500 hover:underline">Update Account</button>
            </div>

            <div className="mt-8 flex items-center gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
              <AlertCircle className="text-yellow-500" size={20} />
              <p className="text-xs text-yellow-500/80 leading-relaxed font-medium">
                Switching to annual billing can save you up to 20% on the Enterprise license.
              </p>
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Included Features</h4>
            <ul className="space-y-4">
              {PRICING_PLAN.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Support Status</h4>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-xs font-bold text-zinc-200">Priority Tier 1 Access</span>
            </div>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Your account is prioritized for carrier audit reviews and API integration support.
            </p>
            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition-all">
              Contact Account Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
