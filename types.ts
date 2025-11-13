
export interface PredictiveAnalytics {
  confidence: 'High' | 'Medium' | 'Low';
  searchVolume: number;
  cpc: number;
  marketTrend: 'up' | 'stable' | 'down';
  salesComps: number;
  brandabilityScore: number;
  seoScore: number;
}

export interface Domain {
  name: string;
  type: 'auction' | 'buyNow';
  currentBid?: number;
  price?: number;
  bids: number;
  category: string;
  valuation: number;
  trending?: boolean;
  predictiveAnalytics: PredictiveAnalytics;
}

export interface SalesHistory {
  name: string;
  sales: number;
}

export interface InnovativeFeature {
    name: string;
    description: string;
}

export interface MonetizationStrategy {
    name: string;
    description: string;
    potential: number; // Score out of 10
}

export interface WordAnalysis {
    word: string;
    metrics: {
        length: number;
        syllables: number;
        pronounceability: number;
        memorability: number;
    };
    associations: string[];
}

export interface SimilarWord {
    word: string;
    popularityScore: number;
    relationType: string;
    exampleDomains: string[];
    recommendedTlds: string[];
}

export interface WordCombination {
    domainName: string;
    tlds: string[];
    brandabilityScore: number;
    industry: string;
    availability: 'Likely Available' | 'Premium' | 'Taken';
}
