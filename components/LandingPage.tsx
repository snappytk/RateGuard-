
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  BarChart4, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Globe, 
  CheckCircle2,
  Lock,
  Cpu,
  AlertCircle,
  FileText,
  MousePointer2,
  Layers,
  Search,
  Users,
  Award,
  History,
  X,
  Scale,
  Cookie,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_PLAN } from '../constants';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import CookiePolicy from './CookiePolicy';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [activeOverlay, setActiveOverlay] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('rateguard_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (level: 'all' | 'essential') => {
    localStorage.setItem('rateguard_cookie_consent', level);
    setShowConsent(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  if (activeOverlay) {
    return (
      <div className="min-h-screen bg-[#07090e] p-6 lg:p-20 relative">
        <button 
          onClick={() => setActiveOverlay(null)}
          className="fixed top-8 right-8 z-[110] p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 hover:text-white transition-all shadow-2xl"
        >
          <X size={24} />
        </button>
        {activeOverlay === 'privacy' && <PrivacyPolicy onBack={() => setActiveOverlay(null)} />}
        {activeOverlay === 'terms' && <TermsAndConditions onBack={() => setActiveOverlay(null)} />}
        {activeOverlay === 'cookies' && <CookiePolicy onBack={() => setActiveOverlay(null)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 selection:bg-blue-500/30 overflow-x-hidden scroll-smooth">
      {/* Cinematic Background Elements */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-full h-[800px] bg-blue-600/5 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 translate-x-1/2 w-full h-[800px] bg-indigo-600/5 blur-[160px] pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] border-b border-zinc-800/50 bg-[#07090e]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-black italic shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform">R</div>
            <span className="text-xl font-black tracking-tighter">RateGuard <span className="text-blue-500">AI</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a>
            <a href="#atlas" className="hover:text-white transition-colors">Atlas AI</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="hidden sm:block text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Login</button>
            <button 
              onClick={onLogin}
              className="px-6 py-3 rounded-xl bg-white text-[#07090e] font-black text-xs uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-left space-y-10">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Operational Intelligence Terminal
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
              Defend Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Margins</span> <br /> Automatically.
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-zinc-400 max-w-xl leading-relaxed font-medium">
              Logistics is a game of pennies. RateGuard AI standardizes messy carrier quotes, audits surcharges against historical lane memory, and generates dispute alerts instantly.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group transition-all shadow-2xl shadow-blue-500/30 active:scale-95 text-white"
              >
                Start Margin Audit
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <div className="flex flex-col">
                <div className="flex -space-x-3 overflow-hidden p-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-4 ring-[#07090e] bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] font-black uppercase text-zinc-400">
                      {['AZ', 'FB', 'LL', 'GK'][i-1]}
                    </div>
                  ))}
                </div>
                <div className="mt-1 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                  Used by 400+ Freight Forwarders
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants} 
            className="relative lg:block hidden"
          >
            <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl glow-blue overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6 px-4 py-3 bg-black/40 rounded-2xl border border-zinc-800/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">ATLAS_AUDIT_PROTOCOL_v4.2</div>
              </div>
              <div className="space-y-6 font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                    <span className="text-zinc-600 block mb-2 text-[9px] font-black uppercase tracking-widest">Origin Node</span>
                    <span className="text-white text-xs font-bold">SHANGHAI (CNSHA)</span>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                    <span className="text-zinc-600 block mb-2 text-[9px] font-black uppercase tracking-widest">Dest. Node</span>
                    <span className="text-white text-xs font-bold">ROTTERDAM (NLRTM)</span>
                  </div>
                </div>
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-red-500 animate-pulse" />
                       <span className="text-red-500 font-black text-[10px] uppercase tracking-widest">PROFIT GUARD™ ALERT</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase">Drift: +12.4%</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                    Fuel Surcharge (BAF) detected at $420.00 above historical lane index. 
                  </div>
                  <button className="w-full py-3 bg-red-500 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-red-600 transition-all">
                    Draft Auto-Dispute
                  </button>
                </div>
              </div>
            </div>
            
            {/* Decorative Orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Value Grid */}
      <section id="features" className="py-32 px-6 border-y border-zinc-900/50 bg-[#0a0c12]">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">The Margin Defense Suite</h2>
            <p className="text-zinc-500 font-medium max-w-2xl mx-auto">Standard logistics software is reactive. RateGuard is predictive and protective.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: <FileText className="text-blue-500" />, 
                title: "Messy PDF Normalization", 
                desc: "Carriers send quotes in 100 different formats. Atlas extracts line items instantly and converts them into one structured view." 
              },
              { 
                icon: <History className="text-emerald-500" />, 
                title: "Deep Lane Memory", 
                desc: "The app remembers every price you've ever paid. Instantly compare new quotes against your best ever price and market index." 
              },
              { 
                icon: <Zap className="text-orange-500" />, 
                title: "Auto-Dispute Engine", 
                desc: "Don't let hidden fees slide. Generate professional dispute emails to carriers with one click when surcharges drift." 
              },
              { 
                icon: <Award className="text-indigo-500" />, 
                title: "Carrier Scorecards", 
                desc: "Price isn't everything. Track reliability, on-time performance, and claims history for every carrier in your network." 
              },
              { 
                icon: <Users className="text-purple-500" />, 
                title: "The Review Pipeline", 
                desc: "A structured workflow for your team. Processors ingest, AI analyzes, and Managers give the final green light." 
              },
              { 
                icon: <ShieldCheck className="text-red-500" />, 
                title: "Profit Guard™ Hub", 
                desc: "Live monitoring of your target margins. If a quote bleeds your profit, you'll see a red alert before you book." 
              }
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800/50 hover:border-blue-500/30 transition-all space-y-6 group"
              >
                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:bg-blue-600/10 group-hover:border-blue-500/50 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-black text-white">{feat.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Benefits */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 text-blue-500 group-hover:rotate-12 transition-transform">
              <MousePointer2 size={160} />
            </div>
            <div className="space-y-4 relative z-10">
              <span className="text-blue-500 font-black text-[10px] tracking-[0.3em] uppercase">For The Processor</span>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Speed Over Manual Entry</h3>
              <p className="text-zinc-400 leading-relaxed font-medium">Stop wasting 12 hours a week re-keying carrier data. Upload, let Atlas extract, and move items to the review queue in seconds.</p>
            </div>
            <ul className="space-y-4 relative z-10">
              {['Instant OCR Extraction', 'Team Collaboration Sidebar', 'Status Workflow Tracking'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300 font-bold">
                  <CheckCircle2 size={18} className="text-blue-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/20 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 text-white group-hover:-rotate-12 transition-transform">
              <Layers size={160} />
            </div>
            <div className="space-y-4 relative z-10">
              <span className="text-blue-400 font-black text-[10px] tracking-[0.3em] uppercase">For The Manager</span>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Executive Oversight</h3>
              <p className="text-blue-100/60 leading-relaxed font-medium">Your Daily Digest shows only what matters: critical alerts and margin protection ROI. Give the "Green Light" to booking batches with confidence.</p>
            </div>
            <ul className="space-y-4 relative z-10">
              {['Daily Margin ROI Digest', 'Batched Approval Workflow', 'Historical Lane Indexing'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-white font-bold">
                  <CheckCircle2 size={18} className="text-blue-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Atlas AI Feature Section */}
      <section id="atlas" className="py-32 px-6 bg-gradient-to-b from-[#07090e] to-blue-900/10">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/50">
               <Cpu size={40} className="text-white" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">Powered by Atlas</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto font-medium">Atlas is our specialized logistics LLM. It doesn't just read text; it understands world-wide freight surcharges, port codes, and carrier contracts.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { val: "99.4%", label: "Extraction Accuracy" },
              { val: "1.2s", label: "Analysis Latency" },
              { val: "100%", label: "GDPR Compliant" },
              { val: "24/7", label: "Support Coverage" }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                <div className="text-3xl font-black text-white mb-2">{stat.val}</div>
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Transparent Logistics Scale</h2>
          <p className="text-zinc-500 font-medium">Flat monthly enterprise access. No seat limits. No hidden TEU fees.</p>
        </div>
        
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-600/10 blur-[120px] group-hover:bg-blue-600/20 transition-all -z-10" />
          <div className="p-16 rounded-[3.5rem] bg-[#0c0f17] border-2 border-blue-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <div className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black text-white tracking-[0.2em] uppercase shadow-lg">Enterprise Standard</div>
            </div>
            
            <div className="text-blue-400 font-black tracking-[0.3em] text-xs mb-6 uppercase">{PRICING_PLAN.name}</div>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-7xl font-black tracking-tighter text-white">${PRICING_PLAN.price}</span>
              <span className="text-zinc-600 text-2xl font-black uppercase tracking-widest">/{PRICING_PLAN.period}</span>
            </div>
            
            <ul className="space-y-6 mb-12">
              {PRICING_PLAN.features.map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm text-zinc-300 font-bold">
                  <CheckCircle2 size={22} className="text-blue-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={onLogin}
              className="w-full py-6 bg-white text-[#07090e] font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-2xl hover:bg-zinc-200 active:scale-95 flex items-center justify-center gap-3"
            >
              Initialize Instance
              <ArrowRight size={18} />
            </button>
            <p className="text-[9px] text-center text-zinc-600 mt-8 font-black uppercase tracking-[0.3em]">Cancel anytime • No implementation fees • SOC2 Type II</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">Join The Future of <br /> Freight Finance.</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">Stop guessing your lane rates. Start defending your margins with RateGuard AI today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={onLogin}
              className="px-12 py-6 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-100 transition-all shadow-2xl active:scale-95"
            >
              Get Platform Access
            </button>
            <button className="px-12 py-6 border border-white/30 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
              Speak To Expert
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-zinc-900/50 bg-[#07090e]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic shadow-2xl shadow-blue-500/20">R</div>
              <span className="text-2xl font-black tracking-tighter">RateGuard AI</span>
            </div>
            <p className="text-xs text-zinc-600 font-bold leading-relaxed uppercase tracking-widest">Defending global logistics margins with institutional-grade AI. Built for forwarders, by forwarders.</p>
          </div>
          
          {[
            { title: "Terminal", links: ["Intelligence Feed", "Lane Memory", "Review Queue", "Scorecards"] },
            { title: "Integrations", links: ["Cargowise One", "Logisys", "Magaya", "SAP Logistics"] },
            { title: "Global", links: ["Data Security", "Network Status", "Atlas AI Docs", "Privacy", "Terms", "Cookies"] }
          ].map((col, i) => (
            <div key={i} className="space-y-8">
              <h5 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">{col.title}</h5>
              <ul className="space-y-4">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <button 
                      onClick={() => {
                        if (l === "Privacy") setActiveOverlay('privacy');
                        if (l === "Terms") setActiveOverlay('terms');
                        if (l === "Cookies") setActiveOverlay('cookies');
                      }}
                      className="text-[11px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors text-left"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] text-zinc-700 uppercase tracking-[0.4em] font-black">© 2024 RateGuard AI. All systems operational.</p>
          <div className="flex gap-10">
            <Lock size={16} className="text-zinc-800" />
            <Globe size={16} className="text-zinc-800" />
            <ShieldCheck size={16} className="text-zinc-800" />
          </div>
        </div>
      </footer>

      {/* GDPR Consent Banner */}
      <AnimatePresence>
        {showConsent && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-3xl z-[200]"
          >
            <div className="bg-[#121826] border border-zinc-800 p-6 lg:p-8 rounded-[2rem] shadow-2xl flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
               <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 shrink-0">
                  <Cookie size={32} />
               </div>
               <div className="space-y-2 flex-1 text-center lg:text-left">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest">Cookie Consent Node</h4>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    RateGuard uses essential cookies to maintain your terminal session. We also use analytical cookies to optimize the Atlas AI engine. Manage your preferences below.
                  </p>
               </div>
               <div className="flex flex-wrap justify-center gap-3 shrink-0">
                  <button 
                    onClick={() => handleConsent('all')}
                    className="px-6 py-3 bg-white text-[#07090e] font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl"
                  >
                    Accept All
                  </button>
                  <button 
                    onClick={() => handleConsent('essential')}
                    className="px-6 py-3 bg-zinc-800 text-zinc-300 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700"
                  >
                    Reject Non-Essential
                  </button>
                  <button 
                    onClick={() => setActiveOverlay('cookies')}
                    className="p-3 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded-xl hover:text-white transition-all"
                    title="Manage Settings"
                  >
                    <SettingsIcon size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
