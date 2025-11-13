import React, { useState } from 'react';
import { getDomainIdeas } from '../services/geminiService';
import type { DomainIdeasResult, GeneratedDomainIdea } from '../types';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';

interface SimilarWordGeneratorProps {
    onValuateRequest: (domainName: string) => void;
}

const ResultCard: React.FC<{ 
    item: GeneratedDomainIdea;
    isSaved: boolean;
    onSave: (name: string) => void;
    onValuate: (name: string) => void;
}> = ({ item, isSaved, onSave, onValuate }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between transform transition duration-300 hover:shadow-sky-500/20 hover:-translate-y-1">
        <div>
            <h4 className="text-lg font-bold text-sky-400">{item.domainName}</h4>
            <div className="flex flex-wrap gap-1 mt-2">
                {item.tlds.map(tld => (
                    <span key={tld} className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-2 py-0.5 rounded-full">.{tld}</span>
                ))}
            </div>
            <div className="mt-3">
                <p className="text-xs text-slate-400">Brandability Score</p>
                <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${item.brandabilityScore}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold">{item.brandabilityScore}</span>
                </div>
            </div>
            <p className="text-sm text-slate-300 mt-3 italic">"{item.context}"</p>
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
);

export const SimilarWordGenerator: React.FC<SimilarWordGeneratorProps> = ({ onValuateRequest }) => {
    const [inputWords, setInputWords] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<DomainIdeasResult | null>(null);
    const [savedDomains, setSavedDomains] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!inputWords) {
            setError('Please enter at least one word.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const data = await getDomainIdeas(inputWords);
            setResults(data);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred while generating ideas.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = (domainName: string) => {
        setSavedDomains(prev => [...prev, domainName]);
    };

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                     <h3 className="text-xl font-bold text-white mb-2">Generate Ideas</h3>
                    <p className="text-sm text-slate-400 mb-4">Enter keywords to discover related terms and generate premium domain ideas.</p>
                    <textarea
                        value={inputWords}
                        onChange={(e) => setInputWords(e.target.value)}
                        placeholder="e.g., data, chain, meta, block"
                        rows={4}
                        className="w-full rounded-md border-0 bg-slate-700 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full mt-4 flex-none rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-slate-600 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Spinner className="w-5 h-5" /> : 'Generate Similar Words & Domains'}
                    </button>
                    {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
                </div>

                <div className="lg:col-span-3">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full min-h-[300px]"><Spinner className="w-10 h-10"/></div>
                    ) : results ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-white mb-3">Related Words</h4>
                                <div className="flex flex-wrap gap-2">
                                    {results.relatedWords.map(word => (
                                        <span key={word} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-3">Domain Suggestions</h4>
                                <div className="max-h-[600px] overflow-y-auto pr-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {results.domainIdeas.map(item => 
                                            <ResultCard 
                                                key={item.domainName} 
                                                item={item} 
                                                isSaved={savedDomains.includes(item.domainName)}
                                                onSave={handleSave}
                                                onValuate={onValuateRequest}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 h-full flex flex-col justify-center items-center">
                            <Icon name="search" className="w-12 h-12 mx-auto" />
                            <p className="mt-2">Your generated words and domain ideas will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
