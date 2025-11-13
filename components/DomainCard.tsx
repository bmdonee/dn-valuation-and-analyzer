import React from 'react';
import type { Domain } from '../types';
import { Icon } from './common/Icon';

interface DomainCardProps {
  domain: Domain;
  onBid: (domainName: string, bidAmount: number) => void;
  onBuyNow: (domain: Domain) => void;
  onSelectDomain: (domain: Domain) => void;
}

export const DomainCard: React.FC<DomainCardProps> = ({ domain, onBid, onBuyNow, onSelectDomain }) => {
    const handleBid = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent card click
        const newBid = (domain.currentBid || 0) + Math.round(domain.valuation * 0.05);
        onBid(domain.name, newBid);
    };
    
    const handleBuy = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent card click
        onBuyNow(domain);
    };

    return (
        <div onClick={() => onSelectDomain(domain)} className="cursor-pointer bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-sky-500/30 hover:-translate-y-1 border border-transparent hover:border-sky-600">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-white">{domain.name}</h3>
                    <span className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full">{domain.category}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">AI Valuation: <span className="font-semibold text-green-400">${domain.valuation.toLocaleString()}</span></p>

                <div className="mt-6">
                    {domain.type === 'auction' ? (
                        <div>
                            <div className="flex justify-between items-baseline text-slate-300">
                                <span>Current Bid</span>
                                <span className="text-lg font-bold text-white">${domain.currentBid?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-baseline text-slate-400 text-sm mt-1">
                                <span>Bids</span>
                                <span>{domain.bids}</span>
                            </div>
                            <button onClick={handleBid} className="w-full mt-4 bg-transparent border border-sky-500 text-sky-400 font-semibold py-2 px-4 rounded-md hover:bg-sky-500 hover:text-white transition flex items-center justify-center gap-2">
                                <Icon name="hammer" className="w-5 h-5" />
                                Place Bid
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-baseline text-slate-300">
                                <span>Buy Now Price</span>
                                <span className="text-lg font-bold text-white">${domain.price?.toLocaleString()}</span>
                            </div>
                            <button onClick={handleBuy} className="w-full mt-4 bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition flex items-center justify-center gap-2">
                                <Icon name="tag" className="w-5 h-5" />
                                Buy Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};