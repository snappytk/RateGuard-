
import React from 'react';
import { Shield, ChevronLeft, Mail, Lock, Globe, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Shield size={12} />
          Compliance Node Alpha
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Privacy Policy</h1>
        <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium">
          <span>Effective Date: January 24, 2026</span>
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>v2.1.0</span>
        </div>
      </div>

      <div className="grid gap-12 text-zinc-400 leading-relaxed font-medium">
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">1</div>
            Introduction
          </h2>
          <p>
            Welcome to RateGuard ("we," "our," or "us"). We provide a vertical SaaS platform designed to normalize freight quotes and protect logistics margins using artificial intelligence. This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">2</div>
            Information We Collect
          </h2>
          <p>To provide our service, we collect the following types of information:</p>
          <ul className="space-y-4 mt-4">
            <li className="flex gap-4 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
              <User className="text-blue-500 shrink-0" size={20} />
              <div>
                <strong className="text-zinc-200">Account Data:</strong> Name, email address, and company name provided during registration.
              </div>
            </li>
            <li className="flex gap-4 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
              <FileText className="text-blue-500 shrink-0" size={20} />
              <div>
                <strong className="text-zinc-200">Operational Data:</strong> Freight quotes, carrier rate sheets, and logistics documents (PDF, XLS, JPG) that you upload to the platform.
              </div>
            </li>
            <li className="flex gap-4 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
              <Lock className="text-blue-500 shrink-0" size={20} />
              <div>
                <strong className="text-zinc-200">Payment Data:</strong> Transaction details processed securely via PayPal. We do not store your credit card numbers on our servers.
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">3</div>
            How We Use Your Data
          </h2>
          <p>We use the information collected to:</p>
          <div className="grid md:grid-cols-2 gap-4">
             {['Extract and normalize data', 'Provide Profit Guard™ analytics', 'Facilitate Aunt Susan workflow', 'Improve AI models'].map((text, i) => (
               <div key={i} className="flex items-center gap-3 px-4 py-3 bg-zinc-900/20 border border-zinc-800/30 rounded-xl">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-sm font-bold text-zinc-300">{text}</span>
               </div>
             ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">4</div>
            AI Processing & Data Privacy
          </h2>
          <p>RateGuard uses advanced Artificial Intelligence (including Google Gemini API) to process your documents.</p>
          <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
               <Shield className="text-blue-500" size={18} />
               <span className="text-sm font-black text-white uppercase tracking-widest">No Training on Private Data</span>
            </div>
            <p className="text-sm">
              We utilize enterprise-grade API configurations. Your uploaded shipping documents are used only for extraction for your account and are not used to train public AI models.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">5</div>
            Data Sharing & Third Parties
          </h2>
          <p>We only share data with essential third-party service providers:</p>
          <div className="flex flex-wrap gap-4">
            {['Supabase', 'Google Gemini API', 'PayPal'].map(vendor => (
              <span key={vendor} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400">{vendor}</span>
            ))}
          </div>
          <p className="text-sm italic">We do not sell your business data or carrier rate information to third-party brokers or competitors.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">9</div>
            Contact Us
          </h2>
          <p>If you have questions about this policy or your data, please contact our privacy response node:</p>
          <a href="mailto:rateguard6@gmail.com" className="inline-flex items-center gap-3 px-6 py-4 bg-zinc-100 text-[#07090e] font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all">
            <Mail size={16} />
            rateguard6@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
