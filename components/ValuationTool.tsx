import React, { useState, useEffect } from 'react';
import { getDomainValuation } from '../services/geminiService';
import type { PredictiveAnalytics } from '../types';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';

interface ValuationResult extends PredictiveAnalytics {
    valuation: number;
}
interface ValuationToolProps {
    initialDomain?: string;
    onValuationComplete?: () => void;
}

const ResultCard: React.FC<{ result: ValuationResult, domain: string }> = ({ result, domain }) => (
    <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in">
        <h3 className="text-2xl font-bold text-white text-center">Valuation for <span className="text-sky-400">{domain}</span></h3>
        <div className="text-center mt-4">
            <p className="text-5xl font-bold text-green-400">${result.valuation.toLocaleString()}</p>
            <p className="text-sm text-slate-400">AI Confidence: {result.confidence}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
                <p className="text-sm text-slate-400">Search Volume</p>
                <p className="text-lg font-semibold text-white">{result.searchVolume.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-slate-400">CPC</p>
                <p className="text-lg font-semibold text-white">${result.cpc.toFixed(2)}</p>
            </div>
            <div>
                <p className="text-sm text-slate-400">Brandability</p>
                <p className="text-lg font-semibold text-white">{result.brandabilityScore}/100</p>
            </div>
             <div>
                <p className="text-sm text-slate-400">SEO Score</p>
                <p className="text-lg font-semibold text-white">{result.seoScore}/100</p>
            </div>
        </div>
    </div>
);

export const ValuationTool: React.FC<ValuationToolProps> = ({ initialDomain, onValuationComplete }) => {
    const [domainName, setDomainName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ValuationResult | null>(null);

    useEffect(() => {
        if (initialDomain) {
            setDomainName(initialDomain);
            // Optional: auto-run valuation
            // handleValuation(); 
            if(onValuationComplete) {
                onValuationComplete();
            }
        }
    }, [initialDomain]);


    const handleValuation = async () => {
        if (!domainName) {
            setError('Please enter a domain name.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const valuationData = await getDomainValuation(domainName);
            setResult(valuationData);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred during valuation.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="valuation" className="py-16 sm:py-24">
            <div className="text-center">
                <Icon name="chart" className="w-12 h-12 text-sky-400 mx-auto" />
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-4">AI-Powered Domain Valuation</h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-400">
                    Get an instant, data-driven valuation for any domain. Our AI analyzes market trends, keyword value, and more.
                </p>
            </div>
            <div className="mt-10 max-w-xl mx-auto">
                <div className="flex gap-x-4">
                    <input
                        type="text"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        placeholder="e.g., yourdomain.com"
                        className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    />
                    <button
                        onClick={handleValuation}
                        disabled={isLoading}
                        className="flex-none rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-slate-600"
                    >
                        {isLoading ? <Spinner className="w-5 h-5" /> : 'Valuate'}
                    </button>
                </div>
                {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
                {result && <ResultCard result={result} domain={domainName} />}
            </div>
        </div>
    );
};
