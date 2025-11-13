
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marketplace } from './components/Marketplace';
import { ValuationTool } from './components/ValuationTool';
import { InnovativeFeatures } from './components/InnovativeFeatures';
import { MonetizationStrategy } from './components/MonetizationStrategy';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { DomainDetail } from './components/DomainDetail';
import { CheckoutModal } from './components/CheckoutModal';
import { AIGenerator } from './components/AIGenerator';
import { MOCK_DOMAINS } from './constants';
import { 
    getInnovativeFeatures, 
    getMonetizationStrategies, 
    getWordIntelligence 
} from './services/geminiService';
import type { 
    Domain, 
    InnovativeFeature, 
    MonetizationStrategy as MonetizationStrategyType,
    WordAnalysis,
} from './types';
import { WordIntelligence } from './components/WordIntelligence';

type View = 'marketplace' | 'dashboard' | 'domainDetail' | 'aiGenerator';

// Add TypeScript support for the AI Studio API key selection methods
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // FIX: The `aistudio` object may not be present on `window`. Making it optional
    // aligns the type with the runtime checks and resolves declaration conflicts.
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
    const [view, setView] = useState<View>('marketplace');
    const [domains, setDomains] = useState<Domain[]>(MOCK_DOMAINS);
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
    const [domainToBuy, setDomainToBuy] = useState<Domain | null>(null);
    const [isKeyReady, setIsKeyReady] = useState(false);
    
    // States for user's portfolio
    const [listedDomains, setListedDomains] = useState<Domain[]>([]);
    const [biddingOn, setBiddingOn] = useState<Domain[]>([]);

    // States for AI-generated content
    const [innovativeFeatures, setInnovativeFeatures] = useState<InnovativeFeature[]>([]);
    const [isFeaturesLoading, setIsFeaturesLoading] = useState(true);
    const [monetizationStrategies, setMonetizationStrategies] = useState<MonetizationStrategyType[]>([]);
    const [isStrategiesLoading, setIsStrategiesLoading] = useState(false);
    const [wordAnalysis, setWordAnalysis] = useState<WordAnalysis[]>([]);
    const [isWordAnalysisLoading, setIsWordAnalysisLoading] = useState(false);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsKeyReady(hasKey);
            } else {
                // Assume we're in an environment where the key is set via process.env
                setIsKeyReady(true);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume success to handle potential race conditions
            setIsKeyReady(true);
        }
    };
    
    useEffect(() => {
        if (!isKeyReady) return;
        const fetchFeatures = async () => {
            setIsFeaturesLoading(true);
            const features = await getInnovativeFeatures();
            setInnovativeFeatures(features);
            setIsFeaturesLoading(false);
        };
        fetchFeatures();
    }, [isKeyReady]);

    useEffect(() => {
        if (!isKeyReady) return;
        if (view === 'domainDetail' && selectedDomain) {
            const fetchStrategies = async () => {
                setIsStrategiesLoading(true);
                setMonetizationStrategies([]);
                const strategies = await getMonetizationStrategies(selectedDomain.name);
                setMonetizationStrategies(strategies);
                setIsStrategiesLoading(false);
            };
            const fetchWordAnalysis = async () => {
                setIsWordAnalysisLoading(true);
                setWordAnalysis([]);
                const analysis = await getWordIntelligence(selectedDomain.name);
                setWordAnalysis(analysis);
                setIsWordAnalysisLoading(false);
            }
            fetchStrategies();
            fetchWordAnalysis();
        }
    }, [view, selectedDomain, isKeyReady]);

    const handleSelectDomain = (domain: Domain) => {
        setSelectedDomain(domain);
        setView('domainDetail');
        window.scrollTo(0, 0);
    };

    const handleBackToMarketplace = () => {
        setSelectedDomain(null);
        setView('marketplace');
    };

    const handleNav = (newView: 'marketplace' | 'dashboard' | 'aiGenerator') => {
        setSelectedDomain(null);
        setView(newView);
        window.scrollTo(0, 0);
    };
    
    const handleBid = (domainName: string, bidAmount: number) => {
        setDomains(prevDomains => 
            prevDomains.map(d => 
                d.name === domainName ? { ...d, currentBid: bidAmount, bids: d.bids + 1 } : d
            )
        );
        const domainToBidOn = domains.find(d => d.name === domainName);
        if(domainToBidOn && !biddingOn.find(d => d.name === domainName)) {
            setBiddingOn(prev => [...prev, domainToBidOn]);
        }
    };
    
    const handleBuyNow = (domain: Domain) => {
        setDomainToBuy(domain);
    };

    const handleConfirmPurchase = (domainName: string) => {
        const purchasedDomain = domains.find(d => d.name === domainName);
        if (purchasedDomain) {
            setListedDomains(prev => [...prev, { ...purchasedDomain, type: 'buyNow', price: purchasedDomain.valuation * 1.2 }]);
        }
        setDomains(prev => prev.filter(d => d.name !== domainName));
        setDomainToBuy(null);
    };

    const renderContent = () => {
        switch (view) {
            case 'domainDetail':
                if (selectedDomain) {
                    return (
                        <>
                            <DomainDetail 
                                domain={selectedDomain} 
                                onBack={handleBackToMarketplace} 
                                onBid={handleBid}
                                onBuyNow={handleBuyNow}
                            />
                            { (isWordAnalysisLoading || wordAnalysis.length > 0) &&
                                <WordIntelligence analysis={wordAnalysis} />
                            }
                            <MonetizationStrategy 
                                strategies={monetizationStrategies} 
                                isLoading={isStrategiesLoading}
                            />
                        </>
                    );
                }
                return null;
            case 'dashboard':
                return <Dashboard listedDomains={listedDomains} biddingOn={biddingOn} />;
            case 'aiGenerator':
                return <AIGenerator />;
            case 'marketplace':
            default:
                return (
                    <>
                        <Hero />
                        <div id="marketplace" className="py-16 sm:py-24">
                            <Marketplace 
                                domains={domains} 
                                onBid={handleBid} 
                                onBuyNow={handleBuyNow} 
                                onSelectDomain={handleSelectDomain}
                            />
                        </div>
                        <ValuationTool />
                        <InnovativeFeatures features={innovativeFeatures} isLoading={isFeaturesLoading} />
                    </>
                );
        }
    };

    if (!isKeyReady) {
        return (
            <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center">
                <div className="bg-slate-800 p-8 rounded-lg shadow-xl text-center max-w-lg mx-4 border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
                    <p className="text-slate-400 mb-6">
                        To use the AI-powered features of this application, you need to select an API key. 
                        Your key is used only for the Gemini API calls made from your browser.
                    </p>
                    <button
                        onClick={handleSelectKey}
                        className="w-full rounded-md bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 transition"
                    >
                        Select API Key
                    </button>
                    <p className="text-xs text-slate-500 mt-4">
                        For more information on billing, visit{' '}
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-400">
                            ai.google.dev/gemini-api/docs/billing
                        </a>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 text-slate-200">
            <Header onNavClick={handleNav} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>
            <Footer />
            {domainToBuy && (
                <CheckoutModal 
                    domain={domainToBuy}
                    onClose={() => setDomainToBuy(null)}
                    onConfirm={handleConfirmPurchase}
                />
            )}
        </div>
    );
};

export default App;
