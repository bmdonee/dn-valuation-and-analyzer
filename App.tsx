
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
    View,
} from './types';
import { WordIntelligence } from './components/WordIntelligence';

const App: React.FC = () => {
    const [view, setView] = useState<View>('marketplace');
    
    const [domains, setDomains] = useState<Domain[]>(MOCK_DOMAINS);
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
    const [domainToBuy, setDomainToBuy] = useState<Domain | null>(null);
    const [domainToValuate, setDomainToValuate] = useState<string | undefined>(undefined);
    
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
        const fetchFeatures = async () => {
            setIsFeaturesLoading(true);
            try {
                const features = await getInnovativeFeatures();
                setInnovativeFeatures(features);
            } catch (error) {
                console.error("Failed to fetch innovative features", error);
                setInnovativeFeatures([]); // Gracefully degrade
            } finally {
                setIsFeaturesLoading(false);
            }
        };
        fetchFeatures();
    }, []);

    useEffect(() => {
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
    }, [view, selectedDomain]);

    const handleSelectDomain = (domain: Domain) => {
        setSelectedDomain(domain);
        setView('domainDetail');
        window.scrollTo(0, 0);
    };

    const handleBackToMarketplace = () => {
        setSelectedDomain(null);
        setView('marketplace');
    };

    const handleNav = (newView: View) => {
        setSelectedDomain(null);
        setView(newView);
        window.scrollTo(0, 0);
    };

    const handleValuationRequest = (domainName: string) => {
        setDomainToValuate(domainName);
        setView('marketplace');
        setTimeout(() => {
             document.getElementById('valuation')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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
                return <AIGenerator onValuateRequest={handleValuationRequest} />;
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
                        <ValuationTool 
                            initialDomain={domainToValuate}
                            onValuationComplete={() => setDomainToValuate(undefined)}
                        />
                        <InnovativeFeatures features={innovativeFeatures} isLoading={isFeaturesLoading} />
                    </>
                );
        }
    };

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
