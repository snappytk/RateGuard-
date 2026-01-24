
import React from 'react';
import { Scale, ChevronLeft, Mail, AlertTriangle, Shield, Cpu, CreditCard, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface TermsAndConditionsProps {
  onBack?: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Terminal</span>
        </button>
      )}

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Scale size={12} />
          Legal Protocol v1.0
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Terms and Conditions</h1>
        <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium">
          <span>Last Updated: January 24, 2026</span>
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>Legal Node: Zimbabwe</span>
        </div>
      </div>

      <div className="grid gap-12 text-zinc-400 leading-relaxed font-medium">
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">01</div>
            Acceptance of Terms
          </h2>
          <p>
            By creating an account or using the RateGuard platform (“Service”), you agree to be bound by these Terms and Conditions. If you are entering into this agreement on behalf of a company (such as a 3PL or Freight Forwarder), you represent that you have the authority to bind that entity to these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">02</div>
            Eligibility
          </h2>
          <p>
            You must be at least 18 years of age to enter into this binding contract. If you are under the age of 18, you may only use this Service under the direct supervision of a parent or legal guardian who agrees to be bound by these Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">03</div>
            Description of Service
          </h2>
          <p>
            RateGuard provides AI-powered document normalization, lane benchmarking, and profit margin analysis. We reserve the right to modify, suspend, or discontinue any feature of the Service (including Atlas and Profit Guard™) at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">04</div>
            Subscription and Payments
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 space-y-3">
               <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                  <CreditCard size={14} className="text-blue-500" /> Fees & Billing
               </div>
               <p className="text-sm">The Service is billed on a subscription basis at the rate of <strong>$199 USD per month</strong>. Payments are processed securely via PayPal.</p>
            </div>
            <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 space-y-3">
               <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                  <Shield size={14} className="text-emerald-500" /> Cancellations
               </div>
               <p className="text-sm">Cancel any time via the Dashboard. Cancellations take effect at the end of the current cycle. No partial refunds are offered due to AI processing costs.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 text-xs">05</div>
            AI Service Disclaimer (CRITICAL)
          </h2>
          <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] space-y-6">
            <div className="flex items-center gap-3 text-red-500 font-black text-sm uppercase tracking-[0.2em]">
               <AlertTriangle size={20} className="animate-pulse" /> Final Verification Requirement
            </div>
            <p className="text-zinc-300">
              RateGuard uses Artificial Intelligence to extract and interpret data from shipping documents. While we strive for high accuracy, AI can occasionally produce incorrect results or "hallucinations."
            </p>
            <p className="text-zinc-300">
              <strong>User Responsibility:</strong> You are solely responsible for verifying the accuracy of any data extracted by RateGuard before using it for financial transactions, carrier bookings, or client proposals.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">06</div>
            Intellectual Property
          </h2>
          <p>
            You retain all rights to the freight quotes and documents you upload. RateGuard retains all rights, titles, and interests in the platform, including the Atlas assistant logic and Profit Guard™ algorithms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">07</div>
            Limitation of Liability
          </h2>
          <p>
            RateGuard shall not be liable for any indirect, incidental, or consequential damages, including loss of profits or shipping delays. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">08</div>
            Dispute Resolution
          </h2>
          <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
               <Landmark size={14} className="text-zinc-500" /> Jurisdiction: Zimbabwe
            </div>
            <p className="text-sm">
              Any disputes arising from these terms will be governed by the laws of Zimbabwe. You agree to attempt informal negotiation before pursuing legal action.
            </p>
          </div>
        </section>

        <section className="space-y-4 pt-12 border-t border-zinc-800/50">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Contact Legal Node</h2>
          <p>For official legal inquiries or documentation requests, please contact:</p>
          <a href="mailto:rateguard6@gmail.com" className="inline-flex items-center gap-3 px-6 py-4 bg-zinc-100 text-[#07090e] font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all">
            <Mail size={16} />
            rateguard6@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
