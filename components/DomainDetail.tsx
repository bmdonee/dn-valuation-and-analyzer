
import React from 'react';
import type { Domain } from '../types';
import { Icon } from './common/Icon';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Tooltip } from './common/Tooltip';

interface DomainDetailProps {
    domain: Domain;
    onBack: () => void;
    onBid: (domainName: string, bidAmount: number) => void;
    onBuyNow: (domain: Domain) => void;
}

const valuationFactorTooltips: Record<string, string> = {
    Brandability: "How memorable, pronounceable, and catchy the domain name is. A high score suggests strong potential for building a brand.",
    SEO: "The domain's potential to rank well in search engines. Factors include length, keywords, and TLD (.com, .ai, etc.).",
    Comps: "Comparison to recent sales of similar domains. A high score means its valuation is well-supported by market data.",
    Keywords: "The commercial value of the keywords within the domain. High-value keywords can drive targeted traffic.",
    Memorability: "How easy it is for a user to recall the domain name after hearing or seeing it once. Crucial for direct traffic and word-of-mouth marketing."
};

const predictiveAnalyticsTooltips = {
    searchVolume: "The estimated number of times people search for the primary keywords in this domain per month. Higher volume can indicate greater organic traffic potential.",
    cpc: "Cost-Per-Click is the average price an advertiser pays for a click on their ad for this keyword. A high CPC suggests high commercial value.",
    marketTrend: "Indicates whether the domain's industry or category is growing, stable, or declining in popularity and value.",
    salesComps: "An estimated value based on recent sales of similar or comparable domain names. This is a strong indicator of current market price."
};

const CustomRadarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const tooltipContent = valuationFactorTooltips[label] || '';
      return (
        <div className="bg-slate-700 p-3 rounded-lg border border-slate-600 shadow-xl max-w-xs">
          <p className="font-bold text-sky-400">{label}</p>
          <p className="text-sm text-white">{`Score: ${payload[0].value}`}</p>
          {tooltipContent && <p className="text-xs text-slate-300 mt-1">{tooltipContent}</p>}
        </div>
      );
    }
    return null;
};

const MetricDetail: React.FC<{ label: string, value: string, score: number, icon: React.ReactElement, trend?: 'up' | 'stable' | 'down' }> = ({ label, value, score, icon, trend }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="text-sky-400">{icon}</div>
                <span className="text-sm text-slate-300">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {trend === 'up' && <span className="text-green-400">▲</span>}
                {trend === 'down' && <span className="text-red-400">▼</span>}
                <span className="text-sm font-bold text-white">{value}</span>
            </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${score}%` }}></div>
        </div>
    </div>
);

const AISuggestion: React.FC<{ domain: Domain }> = ({ domain }) => {
    const price = domain.price || domain.currentBid || 0;
    const valuation = domain.valuation;
    const isUndervalued = domain.type === 'buyNow' && price < valuation;

    if (!isUndervalued) return null;

    const discount = Math.round(((valuation - price) / valuation) * 100);

    return (
        <div className="bg-gradient-to-r from-sky-500/20 to-green-500/20 p-4 rounded-lg border border-sky-400 mt-8">
            <div className="flex items-start gap-3">
                <Icon name="lightbulb" className="w-6 h-6 text-sky-300 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-white">Investment Opportunity</h4>
                    <p className="text-sm text-slate-300 mt-1">
                        Our AI suggests this domain is undervalued. The "Buy Now" price is approximately <span className="font-bold text-green-400">{discount}% below</span> our AI-driven valuation, presenting a strong investment opportunity.
                    </p>
                </div>
            </div>
        </div>
    );
};


export const DomainDetail: React.FC<DomainDetailProps> = ({ domain, onBack, onBid, onBuyNow }) => {
    const { predictiveAnalytics: pa } = domain;
    
    const handleBid = () => {
        const newBid = (domain.currentBid || 0) + Math.round(domain.valuation * 0.05);
        onBid(domain.name, newBid);
    };

    const chartData = [
        { subject: 'Brandability', A: pa.brandabilityScore, fullMark: 100 },
        { subject: 'SEO', A: pa.seoScore, fullMark: 100 },
        { subject: 'Comps', A: (pa.salesComps / (domain.valuation * 1.2)) * 100, fullMark: 100 },
        { subject: 'Keywords', A: (pa.cpc / 20) * 100, fullMark: 100 },
        { subject: 'Memorability', A: 85, fullMark: 100 }, // Mocked for now
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <button onClick={onBack} className="mb-8 text-sm text-sky-400 hover:text-sky-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Marketplace
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h1 className="text-5xl font-bold text-white tracking-tight">{domain.name}</h1>
                    <div className="mt-2 text-lg text-slate-400 flex items-center gap-4">
                        <span>AI Valuation: <span className="font-bold text-green-400">${domain.valuation.toLocaleString()}</span></span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pa.confidence === 'High' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {pa.confidence} Confidence
                        </span>
                    </div>

                    <AISuggestion domain={domain} />

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-sky-400 mb-4 text-center">Valuation Factors</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                        <PolarGrid stroke="#475569"/>
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <RechartsTooltip content={<CustomRadarTooltip />} />
                                        <Radar name={domain.name} dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold text-sky-400 mb-0 text-center">Predictive Analytics</h3>
                             <Tooltip content={predictiveAnalyticsTooltips.searchVolume}>
                                <MetricDetail label="Keyword Search Volume" value={`${(pa.searchVolume / 1000).toFixed(1)}k/mo`} score={(pa.searchVolume / 150000) * 100} icon={<Icon name="search" className="w-5 h-5"/>} />
                             </Tooltip>
                             <Tooltip content={predictiveAnalyticsTooltips.cpc}>
                                <MetricDetail label="Keyword CPC" value={`$${pa.cpc.toFixed(2)}`} score={(pa.cpc / 20) * 100} icon={<Icon name="tag" className="w-5 h-5"/>} />
                             </Tooltip>
                             <Tooltip content={predictiveAnalyticsTooltips.marketTrend}>
                                <MetricDetail label="Market Trend" value={domain.category} score={pa.marketTrend === 'up' ? 90 : 60} icon={<Icon name="chart" className="w-5 h-5"/>} trend={pa.marketTrend} />
                             </Tooltip>
                             <Tooltip content={predictiveAnalyticsTooltips.salesComps}>
                                <MetricDetail label="Sales Comps Value" value={`$${pa.salesComps.toLocaleString()}`} score={(pa.salesComps / (domain.valuation * 1.2)) * 100} icon={<Icon name="hammer" className="w-5 h-5"/>} />
                             </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-slate-800 rounded-lg shadow-2xl p-6 sticky top-24">
                        {domain.type === 'auction' ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-slate-400 text-sm">Current Bid</p>
                                    <p className="text-4xl font-bold text-white">${domain.currentBid?.toLocaleString()}</p>
                                </div>
                                <div className="text-sm text-slate-300">
                                    <p>{domain.bids} bids</p>
                                    <p>Auction ends in 3 days</p>
                                </div>
                                <button onClick={handleBid} className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-sky-700 transition flex items-center justify-center gap-2">
                                    <Icon name="hammer" className="w-5 h-5" />
                                    Place Bid
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-slate-400 text-sm">Buy Now Price</p>
                                    <p className="text-4xl font-bold text-white">${domain.price?.toLocaleString()}</p>
                                </div>
                                <button onClick={() => onBuyNow(domain)} className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-sky-700 transition flex items-center justify-center gap-2">
                                    <Icon name="tag" className="w-5 h-5" />
                                    Buy Now
                                </button>
                            </div>
                        )}
                        <button className="w-full mt-4 bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-md hover:bg-slate-600 transition">Add to Watchlist</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
