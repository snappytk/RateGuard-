
import React, { useState, useRef, useEffect } from 'react';
import { NAVIGATION_ITEMS, SYSTEM_ITEMS } from '../constants';
import { AppView } from '../types';
import { ChevronLeft, ChevronRight, MoreHorizontal, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onToggle }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSystemItemClick = (id: AppView) => {
    onViewChange(id);
    setIsMoreOpen(false);
  };

  return (
    <aside className={`
      bg-[#121826] border-r border-zinc-800 transition-all duration-300 relative z-50
      ${isOpen ? 'w-64' : 'w-20'}
      hidden lg:flex flex-col
    `}>
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-800/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black italic shadow-lg shadow-blue-500/20 shrink-0">R</div>
          {isOpen && <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">RateGuard AI</span>}
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 py-8 px-3 space-y-1">
        {isOpen && (
          <div className="px-3 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Operations</div>
        )}
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as AppView)}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group
              ${currentView === item.id 
                ? 'bg-zinc-800/50 text-white font-semibold' 
                : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/20'}
            `}
          >
            <span className={`shrink-0 ${currentView === item.id ? 'text-blue-500' : 'group-hover:text-blue-400'}`}>
              {item.icon}
            </span>
            {isOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer / More Section */}
      <div className="p-3 mt-auto space-y-1 relative" ref={moreMenuRef}>
        <AnimatePresence>
          {isMoreOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`
                absolute bottom-full left-3 mb-2 bg-[#1a2133] border border-zinc-800 rounded-xl shadow-2xl p-2 z-[70]
                ${isOpen ? 'w-[calc(100%-24px)]' : 'w-48'}
              `}
            >
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50 mb-1">
                System Utility
              </div>
              {SYSTEM_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSystemItemClick(item.id as AppView)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                    ${currentView === item.id 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative
            ${isMoreOpen ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/20'}
          `}
        >
          <MoreHorizontal size={18} className="shrink-0" />
          {isOpen && <span className="text-sm">More Options</span>}
          {isOpen && (
             <div className="ml-auto">
                <div className={`w-1 h-1 rounded-full bg-blue-500 ${isMoreOpen ? 'opacity-100' : 'opacity-0'}`} />
             </div>
          )}
        </button>

        <div className="h-px bg-zinc-800/50 my-2 mx-3" />

        {/* Profile / User Section */}
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/30`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-lg">
            JD
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-zinc-200 truncate">John Doe</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter truncate">Forwarder Lead</span>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onToggle}
        className="absolute -right-3 top-24 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors z-[60] shadow-lg text-zinc-400"
      >
        {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;
