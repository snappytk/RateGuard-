
import React from 'react';
import { Cookie, ChevronLeft, Mail, Shield, ShieldAlert, Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';

interface CookiePolicyProps {
  onBack?: () => void;
}

const CookiePolicy: React.FC<CookiePolicyProps> = ({ onBack }) => {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Cookie size={12} />
          Browser State Protocol
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Cookie Policy</h1>
        <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium">
          <span>Effective Date: January 24, 2026</span>
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>v1.4.0</span>
        </div>
      </div>

      <div className="grid gap-12 text-zinc-400 leading-relaxed font-medium">
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">01</div>
            What Are Cookies?
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help us recognize your session, remember your preferences, and keep your account secure. They are vital for the real-time operational state of the RateGuard terminal.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">02</div>
            How We Use Cookies
          </h2>
          <p>We use cookies for three main mission-critical reasons:</p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl space-y-3">
              <Shield size={20} className="text-blue-500" />
              <h4 className="text-white font-black text-xs uppercase tracking-widest">Auth & Security</h4>
              <p className="text-xs">Keeps you logged in and prevents unauthorized hijacking of your logistics data.</p>
            </div>
            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl space-y-3">
              <SettingsIcon size={20} className="text-purple-500" />
              <h4 className="text-white font-black text-xs uppercase tracking-widest">Functionality</h4>
              <p className="text-xs">Remembers your dashboard settings like Dark Mode, language, and lane targets.</p>
            </div>
            <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl space-y-3">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <h4 className="text-white font-black text-xs uppercase tracking-widest">Payments</h4>
              <p className="text-xs">Ensures secure transactions and high-integrity fraud prevention during checkout.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">03</div>
            The Cookies We Use
          </h2>
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-800/50 text-zinc-500 uppercase tracking-widest font-black">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                <tr>
                  <td className="px-6 py-4 font-bold text-blue-400">Strictly Necessary</td>
                  <td className="px-6 py-4">User login and session management.</td>
                  <td className="px-6 py-4 text-zinc-500">Supabase Auth</td>
                  <td className="px-6 py-4">Session/Persistent</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-blue-400">Strictly Necessary</td>
                  <td className="px-6 py-4">Secure payment and fraud detection.</td>
                  <td className="px-6 py-4 text-zinc-500">PayPal</td>
                  <td className="px-6 py-4">Persistent</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-purple-400">Functional</td>
                  <td className="px-6 py-4">Remembers UI preferences.</td>
                  <td className="px-6 py-4 text-zinc-500">RateGuard</td>
                  <td className="px-6 py-4">Persistent</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-amber-400">Analytical (Opt)</td>
                  <td className="px-6 py-4">Feature usage analytics.</td>
                  <td className="px-6 py-4 text-zinc-500">Google Analytics</td>
                  <td className="px-6 py-4">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">04</div>
            Third-Party Cookies
          </h2>
          <p>
            Some features rely on third-party providers who may set their own cookies:
          </p>
          <ul className="space-y-2 list-disc list-inside text-sm">
            <li><strong>PayPal:</strong> Used for identity verification and transaction security.</li>
            <li><strong>AI Processing:</strong> Atlas uses secure API tokens, but some session context is maintained to optimize "Rate Normalization" accuracy.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800 text-xs">05</div>
            Your Choices
          </h2>
          <p>You have the right to decide whether to accept or reject non-essential cookies via our consent terminal.</p>
          <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4">
             <ShieldAlert className="text-amber-500 shrink-0" />
             <p className="text-xs leading-relaxed">
               Note: Disabling strictly necessary cookies (like those from Supabase) will cause RateGuard to cease functioning properly. You will be unable to log in to the terminal.
             </p>
          </div>
        </section>

        <section className="space-y-4 pt-12 border-t border-zinc-800/50">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Contact</h2>
          <p>If you have questions about our use of cookies, please email us:</p>
          <a href="mailto:rateguard6@gmail.com" className="inline-flex items-center gap-3 px-6 py-4 bg-zinc-100 text-[#07090e] font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all">
            <Mail size={16} />
            rateguard6@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;
