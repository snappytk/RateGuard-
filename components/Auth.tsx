
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, X, ShieldCheck, LogIn, AlertCircle, Chrome, UserPlus } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from '../services/firebase';

interface AuthProps {
  onClose: () => void;
  onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          // Handled by App.tsx gate
        }
        onSuccess();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        onSuccess(); // App.tsx will show verification gate
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#0e121b] border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-pulse" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 mb-4">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
              {mode === 'signin' ? 'Intelligence Access' : 'Node Creation'}
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              {mode === 'signin' ? 'Authorized terminal access only.' : 'Initialize your logistics intelligence node.'}
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 bg-zinc-900 border border-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Chrome size={18} />
              Continue with Google
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600"><span className="bg-[#0e121b] px-4">OR SECURE CHANNEL</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email"
                    required
                    placeholder="Business Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                disabled={loading}
                className="w-full py-5 bg-white text-[#0e121b] font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-2xl hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : mode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />}
                {mode === 'signin' ? 'Authenticate' : 'Initialize Node'}
              </button>
            </form>
          </div>

          <div className="pt-4 text-center border-t border-zinc-800/50">
            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
            >
              {mode === 'signin' ? "Don't have a node? Create one" : "Already registered? Authenticate"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
