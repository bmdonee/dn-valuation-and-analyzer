
import React from 'react';
import { Icon } from './common/Icon';
import type { View } from '../types';

interface HeaderProps {
    onNavClick: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Icon name="chart" className="h-8 w-8 text-sky-500" />
              <span className="text-xl font-bold text-white">DomainAI</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button onClick={() => onNavClick('marketplace')} className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Marketplace</button>
              <button onClick={() => onNavClick('aiGenerator')} className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">AI Generator</button>
              <button onClick={() => onNavClick('dashboard')} className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Dashboard</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition text-sm">
                Connect Wallet
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
