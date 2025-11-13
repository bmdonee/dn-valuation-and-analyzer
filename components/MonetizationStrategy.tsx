import React from 'react';
import type { MonetizationStrategy as MonetizationStrategyType } from '../types';
import { Spinner } from './common/Spinner';

interface MonetizationStrategyProps {
    strategies?: MonetizationStrategyType[];
    isLoading: boolean;
}

const StrategyCard: React.FC<{ strategy: MonetizationStrategyType }> = ({ strategy }) => (
    <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white">{strategy.name}</h3>
        <p className="text-slate-300 mt-2">{strategy.description}</p>
        <div className="mt-4">
            <span className="text-sky-400 font-semibold">Potential: {strategy.potential}/10</span>
        </div>
    </div>
);


export const MonetizationStrategy: React.FC<MonetizationStrategyProps> = ({ strategies = [], isLoading }) => {
  return (
    <div className="py-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Monetization Strategies</h2>
            <p className="mt-4 text-lg text-slate-400">Unlock your domain's potential with AI-driven ideas.</p>
        </div>
        {isLoading ? (
            <div className="flex justify-center">
                <Spinner className="w-12 h-12" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {strategies.map((strategy, index) => (
                    <StrategyCard key={index} strategy={strategy} />
                ))}
            </div>
        )}
    </div>
  );
};
