import React, { useState } from 'react';
import { getWordCombinations } from '../services/geminiService';
import type { WordCombination } from '../types';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';

interface WordCombinationGeneratorProps {
    onValuateRequest: (domainName: string) => void;
}

export const WordCombinationGenerator: React.FC<WordCombinationGeneratorProps> = ({ onValuateRequest }) => {
    const [primaryWords, setPrimaryWords] = useState('block, data, meta');
    const [secondaryWords, setSecondaryWords] = useState('chain, flow, engine, hub');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<WordCombination[]>([]);
    const [savedDomains, setSavedDomains] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!primaryWords || !secondaryWords) {
            setError('Please enter words in both fields.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults([]);
        try {
            const data = await getWordCombinations(primaryWords, secondaryWords);
            setResults(data);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred while generating combinations.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = (domainName: string) => {
        setSavedDomains(prev => [...prev, domainName]);
    };

    const handleExport = () => {
        if (!results.length) return;
        const headers = ["domainName", "tlds", "brandabilityScore", "industry", "availability"];
        const csvContent = [
            headers.join(','),
            ...results.map(item => [
                item.domainName,
                `"${item.tlds.join(';')}"`, // handle multiple TLDs
                item.brandabilityScore,
                item.industry,
                item.availability
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'domain_combinations.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const ResultCard: React.FC<{ 
        item: WordCombination; 
        isSaved: boolean; 
        onSave: (name: string) => void;
        onValuate: (name: string) => void;
    }> = ({ item, isSaved, onSave, onValuate }) => {
        const availabilityColor = item.availability === 'Likely Available' ? 'text-green-400' : 
                                  item.availability === 'Premium' ? 'text-yellow-400' : 'text-red-400';
        return (
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between transform transition duration-300 hover:shadow-sky-500/20 hover:-translate-y-1">
                <div>
                    <h4 className="text-lg font-bold text-white">{item.domainName}</h4>
                    <p className={`text-sm font-semibold ${availabilityColor}`}>{item.availability}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.tlds.map(tld => (
                             <span key={tld} className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-2 py-0.5 rounded-full">.{tld}</span>
                        ))}
                    </div>
                    <div className="mt-3">
                        <p className="text-xs text-slate-400">Brandability</p>
                        <div className="flex items-center gap-2">
                             <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${item.brandabilityScore}%` }}></div>
                            </div>
                            <span className="text-sm font-semibold">{item.brandabilityScore}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Industry: <span className="font-semibold text-slate-300">{item.industry}</span></p>
                </div>
                 <div className="flex items-center gap-2 mt-4">
                    <button 
                        onClick={() => onValuate(`${item.domainName}.${item.tlds[0] || 'com'}`)}
                        className="w-full bg-transparent border border-slate-600 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded-md hover:bg-slate-700 transition"
                    >
                        Valuate
                    </button>
                    <button 
                        onClick={() => onSave(item.domainName)}
                        disabled={isSaved}
                        className="w-full bg-transparent border border-sky-500 text-sky-400 text-xs font-semibold py-1.5 px-3 rounded-md hover:bg-sky-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-sky-400"
                    >
                        {isSaved ? 'Saved ✓' : 'Save'}
                    </button>
                </div>
            </div>
        )
    };

    return (
        <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Primary Words (Theme)</label>
                    <input
                        type="text"
                        value={primaryWords}
                        onChange={(e) => setPrimaryWords(e.target.value)}
                        className="w-full rounded-md border-0 bg-slate-700 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Secondary Words (Context)</label>
                    <input
                        type="text"
                        value={secondaryWords}
                        onChange={(e) => setSecondaryWords(e.target.value)}
                        className="w-full rounded-md border-0 bg-slate-700 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500"
                    />
                </div>
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full md:w-auto mx-auto flex-none rounded-md bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:bg-slate-600 flex items-center justify-center gap-2"
            >
                {isLoading ? <Spinner className="w-5 h-5" /> : 'Generate Combinations'}
            </button>
            {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Generated Domain Ideas</h3>
                    {results.length > 0 && !isLoading && (
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition"
                        >
                            <Icon name="download" className="w-4 h-4" />
                            Export as CSV
                        </button>
                    )}
                </div>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-64"><Spinner className="w-10 h-10"/></div>
                 ) : results.length > 0 ? (
                    <div className="max-h-[600px] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {results.map(item => (
                                <ResultCard 
                                    key={item.domainName} 
                                    item={item}
                                    isSaved={savedDomains.includes(item.domainName)}
                                    onSave={handleSave}
                                    onValuate={onValuateRequest}
                                />
                            ))}
                        </div>
                    </div>
                 ) : (
                    <div className="text-center py-12 text-slate-500 h-64 flex flex-col justify-center items-center">
                        <Icon name="lightbulb" className="w-12 h-12 mx-auto" />
                        <p className="mt-2">Your generated domain ideas will appear here.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};
