import React from 'react';
import type { Domain } from '../types';
import { DomainCard } from './DomainCard';
import { Icon } from './common/Icon';

interface MarketplaceProps {
  domains: Domain[];
  onBid: (domainName: string, bidAmount: number) => void;
  onBuyNow: (domain: Domain) => void;
  onSelectDomain: (domain: Domain) => void;
}

const TrendingDomainCard: React.FC<{domain: Domain, onSelectDomain: (domain: Domain) => void;}> = ({ domain, onSelectDomain }) => (
    <div onClick={() => onSelectDomain(domain)} className="cursor-pointer flex-shrink-0 w-80 bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700 hover:border-sky-500 transition-colors">
        <h3 className="text-2xl font-bold text-white truncate">{domain.name}</h3>
        <p className="text-sm text-slate-400 mt-1">AI Valuation: <span className="font-semibold text-green-400">${domain.valuation.toLocaleString()}</span></p>
        <div className="mt-4">
             {domain.type === 'auction' ? (
                <div className="flex justify-between items-baseline text-slate-300">
                    <span>Current Bid</span>
                    <span className="text-lg font-bold text-white">${domain.currentBid?.toLocaleString()}</span>
                </div>
            ) : (
                 <div className="flex justify-between items-baseline text-slate-300">
                    <span>Buy Now</span>
                    <span className="text-lg font-bold text-white">${domain.price?.toLocaleString()}</span>
                </div>
            )}
        </div>
    </div>
)

export const Marketplace: React.FC<MarketplaceProps> = ({ domains, onBid, onBuyNow, onSelectDomain }) => {
  const trendingDomains = domains.filter(d => d.trending);
  const otherDomains = domains.filter(d => !d.trending);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-sky-400 mb-4">Trending Domains</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4">
            {trendingDomains.map(domain => (
                <TrendingDomainCard key={domain.name} domain={domain} onSelectDomain={onSelectDomain} />
            ))}
        </div>
      </div>

      <div>
        <div className="md:flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">All Domains</h2>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
                {/* Add filter/sort functionality here */}
                <select className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option>All Categories</option>
                    <option>AI</option>
                    <option>Web3</option>
                    <option>Green Tech</option>
                </select>
                 <select className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option>Sort by Trending</option>
                    <option>Sort by Price</option>
                    <option>Sort by Valuation</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherDomains.map(domain => (
            <DomainCard key={domain.name} domain={domain} onBid={onBid} onBuyNow={onBuyNow} onSelectDomain={onSelectDomain} />
            ))}
        </div>
      </div>
    </div>
  );
};