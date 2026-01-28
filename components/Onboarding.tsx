
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Target, Globe, Users, ArrowRight, Loader2, ShieldCheck, MapPin, FileText, Share2, Plus, LogIn } from 'lucide-react';
import { updateComplianceProfile, createOrganization, joinOrganization, auth } from '../services/firebase';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

type OnboardingMode = 'select' | 'create' | 'join';

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<OnboardingMode>('select');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join State
  const [joinCode, setJoinCode] = useState('');

  // Create State
  const [formData, setFormData] = useState({
    companyName: '',
    country: 'US',
    taxID: '',
    profitGoal: 15,
    currency: 'USD',
  });

  const handleCreateSubmit = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    
    try {
      // 1. Create Org
      const orgId = await createOrganization(auth.currentUser.uid, {
        name: formData.companyName,
        plan: 'free',
        maxSeats: 5
      });

      // 2. Update User Profile with Compliance Data
      await updateComplianceProfile(auth.currentUser.uid, {
        companyName: formData.companyName,
        country: formData.country,
        taxID: formData.taxID,
        // orgId is handled inside createOrganization transaction usually, 
        // but let's ensure compliance data is there
      });

      onComplete({ ...formData, orgId });
    } catch (e: any) {
      console.error(e);
      setError("Failed to initialize node. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async () => {
    if (!auth.currentUser || !joinCode.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await joinOrganization(auth.currentUser.uid, joinCode.trim());
      if (result.success) {
        onComplete({ orgId: joinCode.trim() });
      } else {
        setError(result.error || "Invalid Uplink ID.");
      }
    } catch (e: any) {
      setError("Connection refused. Verify Team ID.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-[#0e121b] border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic shadow-lg">R</div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Compliance Node v2.0</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'select' && (
             <motion.div 
                key="select"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} 
                className="space-y-8"
             >
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Initialize Workspace</h2>
                   <p className="text-zinc-500 font-medium text-sm">Select your operational entry point.</p>
                </div>

                <div className="grid gap-4">
                   <button 
                      onClick={() => setMode('create')}
                      className="flex items-start gap-5 p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-[2rem] text-left transition-all group"
                   >
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                         <Plus size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-white mb-1">Establish New Node</h3>
                         <p className="text-xs text-zinc-500 leading-relaxed">Create a new Organization. You will be assigned the Administrator role.</p>
                      </div>
                   </button>

                   <button 
                      onClick={() => setMode('join')}
                      className="flex items-start gap-5 p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-[2rem] text-left transition-all group"
                   >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                         <Share2 size={24} />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-white mb-1">Uplink to Existing Team</h3>
                         <p className="text-xs text-zinc-500 leading-relaxed">Join an established Organization using a Team UID provided by your manager.</p>
                      </div>
                   </button>
                </div>
             </motion.div>
          )}

          {mode === 'join' && (
             <motion.div 
               key="join"
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} 
               className="space-y-8"
             >
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Team Uplink</h2>
                   <p className="text-zinc-500 font-medium text-sm">Enter the UID to sync with your team's ledger.</p>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Organization UID</label>
                   <input 
                      autoFocus
                      type="text"
                      placeholder="e.g. 7f8a9d..."
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-emerald-500/50 transition-all font-mono"
                   />
                   {error && <div className="text-red-500 text-xs font-bold flex items-center gap-2"><ArrowRight size={12} /> {error}</div>}
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setMode('select')} className="px-6 py-4 rounded-2xl bg-zinc-900 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-white">Back</button>
                   <button 
                      onClick={handleJoinSubmit}
                      disabled={loading || !joinCode}
                      className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-50"
                   >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <LogIn size={16} />}
                      Establish Link
                   </button>
                </div>
             </motion.div>
          )}

          {mode === 'create' && (
            <motion.div key="create-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               {/* Reusing existing Step logic for creation flow */}
               {step === 1 && (
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase">Corporate Identity</h2>
                        <p className="text-zinc-500 text-sm">Register your legal entity.</p>
                     </div>
                     <div className="space-y-4">
                        <input 
                           type="text"
                           placeholder="Company Name"
                           value={formData.companyName}
                           onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white text-sm"
                        />
                         <input 
                           type="text"
                           placeholder="Tax ID"
                           value={formData.taxID}
                           onChange={e => setFormData({ ...formData, taxID: e.target.value })}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white text-sm"
                        />
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setMode('select')} className="px-6 py-4 rounded-xl bg-zinc-900 text-zinc-500 text-xs font-bold uppercase">Back</button>
                        <button onClick={nextStep} disabled={!formData.companyName} className="flex-1 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs">Next</button>
                     </div>
                  </div>
               )}
               
               {step === 2 && (
                  <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase">Margin Protocol</h2>
                        <p className="text-zinc-500 text-sm">Set your profit threshold.</p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between text-white font-bold">
                           <span>Target</span>
                           <span>{formData.profitGoal}%</span>
                        </div>
                        <input 
                           type="range" min="5" max="50" value={formData.profitGoal}
                           onChange={e => setFormData({...formData, profitGoal: parseInt(e.target.value)})}
                           className="w-full accent-blue-600"
                        />
                     </div>
                     <div className="flex gap-4">
                        <button onClick={prevStep} className="px-6 py-4 rounded-xl bg-zinc-900 text-zinc-500 text-xs font-bold uppercase">Back</button>
                        <button onClick={handleCreateSubmit} disabled={loading} className="flex-1 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2">
                           {loading ? <Loader2 className="animate-spin" /> : 'Launch Node'}
                        </button>
                     </div>
                  </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
