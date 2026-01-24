
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Target, Globe, Users, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: { companyName: string; profitGoal: number; currency: string; inviteEmails: string[] }) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    profitGoal: 15,
    currency: 'USD',
    inviteEmails: ['']
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    onComplete(formData);
    setLoading(false);
  };

  const updateInvites = (index: number, val: string) => {
    const newInvites = [...formData.inviteEmails];
    newInvites[index] = val;
    setFormData({ ...formData, inviteEmails: newInvites });
  };

  const addInviteField = () => {
    setFormData({ ...formData, inviteEmails: [...formData.inviteEmails, ''] });
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-[#0e121b] border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl space-y-10 relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic shadow-lg">R</div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Setup Protocol v1.0</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-8 h-1 rounded-full transition-all ${step >= i ? 'bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                  <Building2 className="text-blue-500" /> Company Identity
                </h2>
                <p className="text-zinc-500 text-sm font-medium">Initialize your firm's private operational node.</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Forwarding Firm Name</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g., Global Logistics Partners"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-mono"
                />
              </div>
              <button 
                disabled={!formData.companyName}
                onClick={nextStep}
                className="w-full py-5 bg-white text-[#0e121b] font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all"
              >
                Continue Initialization <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                  <Target className="text-blue-500" /> Profit Goal
                </h2>
                <p className="text-zinc-500 text-sm font-medium">Define your target margin to power Profit Guard™ alerts.</p>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Target Margin (%)</label>
                  <span className="text-2xl font-black text-blue-500 font-mono">{formData.profitGoal}%</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={formData.profitGoal}
                  onChange={e => setFormData({ ...formData, profitGoal: parseInt(e.target.value) })}
                  className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner"
                />
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[11px] text-zinc-400 leading-relaxed italic">
                  "Profit Guard will flag any quote where carrier costs erode your target {formData.profitGoal}% profit."
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-5 bg-zinc-900 text-zinc-500 font-black uppercase text-xs tracking-widest rounded-2xl border border-zinc-800">Back</button>
                <button onClick={nextStep} className="flex-1 py-5 bg-white text-[#0e121b] font-black uppercase text-xs tracking-widest rounded-2xl">Confirm Logic</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                  <Globe className="text-blue-500" /> Local Currency
                </h2>
                <p className="text-zinc-500 text-sm font-medium">Atlas will normalize all incoming quotes to this standard.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['USD', 'EUR', 'GBP', 'ZAR', 'SGD', 'AED'].map(curr => (
                  <button 
                    key={curr}
                    onClick={() => setFormData({ ...formData, currency: curr })}
                    className={`py-4 rounded-2xl font-black text-sm border transition-all ${formData.currency === curr ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-5 bg-zinc-900 text-zinc-500 font-black uppercase text-xs tracking-widest rounded-2xl border border-zinc-800">Back</button>
                <button onClick={nextStep} className="flex-1 py-5 bg-white text-[#0e121b] font-black uppercase text-xs tracking-widest rounded-2xl">Finalize</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                  <Users className="text-blue-500" /> Team Invite
                </h2>
                <p className="text-zinc-500 text-sm font-medium">Optional: Send terminal access codes to your staff.</p>
              </div>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {formData.inviteEmails.map((email, idx) => (
                  <div key={idx} className="relative group">
                    <input 
                      type="email"
                      placeholder="teammember@company.com"
                      value={email}
                      onChange={e => updateInvites(idx, e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-mono"
                    />
                  </div>
                ))}
                <button onClick={addInviteField} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">+ Add Another Member</button>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full py-5 bg-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                  Complete System Initialization
                </button>
                <button onClick={prevStep} className="text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-zinc-400">Back to currency</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
