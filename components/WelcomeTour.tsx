
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  History, 
  Users, 
  ArrowRight, 
  X, 
  CheckCircle2 
} from 'lucide-react';

interface WelcomeTourProps {
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome to RateGuard",
    desc: "You've successfully initialized your secure node. RateGuard uses AI to protect your freight margins and normalize messy carrier quotes.",
    icon: <ShieldCheck size={40} className="text-blue-500" />
  },
  {
    title: "The Review Queue",
    desc: "Upload PDF or Image quotes in the 'Review Queue'. Atlas AI will extract the data, detect surcharges, and flag any cost drift.",
    icon: <FileText size={40} className="text-emerald-500" />
  },
  {
    title: "Profit Guard™ Memory",
    desc: "We track every lane you quote. The 'Lane Memory' and 'Dashboard' show you exactly how much you're saving (or losing) compared to market rates.",
    icon: <History size={40} className="text-purple-500" />
  },
  {
    title: "Team Collaboration",
    desc: "Invite your colleagues in the 'Team Workspace'. Share quote audits and approve workflows together in real-time.",
    icon: <Users size={40} className="text-orange-500" />
  }
];

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-[#0e121b] border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mt-4 mb-8 text-center">
           <AnimatePresence mode="wait">
             <motion.div 
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex flex-col items-center gap-6"
             >
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-lg">
                   {steps[currentStep].icon}
                </div>
                <div className="space-y-3">
                   <h2 className="text-2xl font-black text-white tracking-tight">{steps[currentStep].title}</h2>
                   <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                     {steps[currentStep].desc}
                   </p>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800/50">
           <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? 'bg-blue-500 w-6' : 'bg-zinc-800'}`} 
                />
              ))}
           </div>
           
           <button 
             onClick={handleNext}
             className="px-6 py-3 bg-white text-[#0e121b] font-black uppercase text-xs tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
           >
             {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
             {currentStep === steps.length - 1 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeTour;
