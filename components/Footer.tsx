
import React from 'react';
import { Icon } from './common/Icon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-4">
              <Icon name="chart" className="h-10 w-10 text-sky-500" />
              <span className="text-2xl font-bold text-white">DomainAI</span>
            </div>
            <p className="text-slate-400 text-base">
              AI-powered domain marketplace for the next generation of web builders.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Marketplace</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Valuation</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Dashboard</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Press</a></li>
                </ul>
              </div>
            </div>
             <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-base text-slate-500 xl:text-center">&copy; 2024 DomainAI, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
