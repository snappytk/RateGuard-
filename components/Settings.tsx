
import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Cpu, Sliders, Check, Database, Download } from 'lucide-react';
import { UserProfile } from '../types';
import { updateUserSettings, fetchUserSettings, updateUserProfileData } from '../services/firebase';
import { generateLiveRates, downloadRatesJSON } from '../services/marketData';

interface SettingsProps {
  userProfile: UserProfile | null;
  onProfileUpdate?: (updates: Partial<UserProfile>) => void;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, onProfileUpdate }) => {
  const [threshold, setThreshold] = useState(15);
  const [autoAudit, setAutoAudit] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setCompanyName(userProfile.companyName || '');
      
      const loadSettings = async () => {
        const settings = await fetchUserSettings(userProfile.uid);
        if (settings) {
          if (settings.profitThreshold) setThreshold(settings.profitThreshold);
          if (settings.autoAudit !== undefined) setAutoAudit(settings.autoAudit);
        }
      };
      loadSettings();
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) return;
    setIsSaving(true);
    
    try {
      // Update Settings Collection
      await updateUserSettings(userProfile.uid, {
        profitThreshold: threshold,
        autoAudit: autoAudit,
      });

      // Update User Profile Collection
      await updateUserProfileData(userProfile.uid, {
        displayName: displayName,
        companyName: companyName
      });

      if (onProfileUpdate) {
        onProfileUpdate({ displayName, companyName });
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportRates = () => {
     const rates = generateLiveRates(100);
     downloadRatesJSON(rates);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Platform Settings</h2>
        <p className="text-zinc-500">Configure your global AI audit parameters and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          {/* AI Configuration */}
          <section className="bg-[#121826]/40 border border-zinc-800/50 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-4">
              <Cpu size={20} className="text-blue-500" />
              <h3 className="text-lg font-bold text-white">Profit Guard™ Logic</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-zinc-300">Alert Threshold (%)</label>
                  <span className="text-sm font-mono text-blue-500">{threshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={threshold} 
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-xs text-zinc-600 italic">Flag quotes that are more than {threshold}% above historical lane average.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-zinc-100">Auto-Audit Ingested Quotes</div>
                  <div className="text-xs text-zinc-500">Automatically run Profit Guard on every newly detected quote.</div>
                </div>
                <button 
                  onClick={() => setAutoAudit(!autoAudit)}
                  className={`w-12 h-6 rounded-full transition-all relative ${autoAudit ? 'bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoAudit ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* User Profile */}
          <section className="bg-[#121826]/40 border border-zinc-800/50 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-4">
              <User size={20} className="text-zinc-400" />
              <h3 className="text-lg font-bold text-white">Operator Profile</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#0e121b] border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500/50 text-white" 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Company Name</label>
                <input 
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#0e121b] border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500/50 text-white" 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email (Immutable)</label>
                <input 
                  type="email" 
                  value={userProfile?.email || ''} 
                  disabled 
                  className="w-full bg-[#0e121b] border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none text-zinc-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </section>

          {/* Developer Tools */}
          <section className="bg-zinc-900 border border-dashed border-zinc-700 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-4">
              <Database size={20} className="text-zinc-500" />
              <h3 className="text-lg font-bold text-zinc-400">Developer Tools</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <div className="text-sm font-bold text-zinc-300">Export Live Rate JSON</div>
                 <div className="text-xs text-zinc-500">Generate 100 simulation objects for Firebase seeding.</div>
              </div>
              <button 
                onClick={handleExportRates}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
              >
                <Download size={14} /> Export JSON
              </button>
            </div>
          </section>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-zinc-400 flex items-center gap-2">
              <Shield size={16} /> Security Sync
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Last security audit: <span className="text-emerald-500">Today</span>. Your data is encrypted with AES-256 standard.
            </p>
            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-lg transition-colors text-zinc-300">
              Reset Security Keys
            </button>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 ${
              showSuccess ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Updating...
              </span>
            ) : showSuccess ? (
              <>
                <Check size={18} />
                Profile Updated
              </>
            ) : (
              <>
                <Save size={18} />
                Commit Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
