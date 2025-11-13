import type { Domain, SalesHistory } from './types';

export const MOCK_DOMAINS: Domain[] = [
  { 
    name: 'cortex.ai', 
    type: 'auction', 
    currentBid: 75000, 
    bids: 12, 
    category: 'AI', 
    valuation: 100000, 
    trending: true,
    predictiveAnalytics: {
      confidence: 'High',
      searchVolume: 85000,
      cpc: 12.50,
      marketTrend: 'up',
      salesComps: 115000,
      brandabilityScore: 95,
      seoScore: 80,
    }
  },
  { 
    name: 'quantumledger.com', 
    type: 'buyNow', 
    price: 120000, 
    bids: 0, 
    category: 'Web3', 
    valuation: 150000, 
    trending: true,
    predictiveAnalytics: {
      confidence: 'High',
      searchVolume: 45000,
      cpc: 9.80,
      marketTrend: 'up',
      salesComps: 160000,
      brandabilityScore: 92,
      seoScore: 75,
    } 
  },
  { 
    name: 'ecodrive.io', 
    type: 'auction', 
    currentBid: 45000, 
    bids: 8, 
    category: 'Green Tech', 
    valuation: 60000, 
    trending: true,
    predictiveAnalytics: {
      confidence: 'Medium',
      searchVolume: 60000,
      cpc: 7.20,
      marketTrend: 'stable',
      salesComps: 55000,
      brandabilityScore: 88,
      seoScore: 65,
    }
  },
  { 
    name: 'healthify.me', 
    type: 'buyNow', 
    price: 30000, 
    bids: 0, 
    category: 'Health', 
    valuation: 40000,
    predictiveAnalytics: {
      confidence: 'High',
      searchVolume: 120000,
      cpc: 4.50,
      marketTrend: 'stable',
      salesComps: 38000,
      brandabilityScore: 85,
      seoScore: 70,
    }
  },
  { 
    name: 'vrverse.app', 
    type: 'auction', 
    currentBid: 62000, 
    bids: 21, 
    category: 'VR/AR', 
    valuation: 80000,
    predictiveAnalytics: {
      confidence: 'Medium',
      searchVolume: 75000,
      cpc: 8.10,
      marketTrend: 'up',
      salesComps: 75000,
      brandabilityScore: 90,
      seoScore: 60,
    }
  },
  { 
    name: 'fintechfusion.co', 
    type: 'buyNow', 
    price: 95000, 
    bids: 0, 
    category: 'Finance', 
    valuation: 110000,
    predictiveAnalytics: {
      confidence: 'High',
      searchVolume: 35000,
      cpc: 15.60,
      marketTrend: 'stable',
      salesComps: 120000,
      brandabilityScore: 82,
      seoScore: 78,
    }
  },
  { 
    name: 'solarize.net', 
    type: 'auction', 
    currentBid: 22000, 
    bids: 5, 
    category: 'Green Tech', 
    valuation: 35000,
    predictiveAnalytics: {
      confidence: 'Medium',
      searchVolume: 50000,
      cpc: 5.50,
      marketTrend: 'stable',
      salesComps: 30000,
      brandabilityScore: 75,
      seoScore: 55,
    }
  },
  { 
    name: 'chainlink.ai', 
    type: 'buyNow', 
    price: 180000, 
    bids: 0, 
    category: 'AI', 
    valuation: 250000,
    predictiveAnalytics: {
      confidence: 'High',
      searchVolume: 95000,
      cpc: 18.20,
      marketTrend: 'up',
      salesComps: 280000,
      brandabilityScore: 98,
      seoScore: 85,
    }
  },
];

export const SALES_DATA: SalesHistory[] = [
  { name: 'Jan', sales: 40000 },
  { name: 'Feb', sales: 30000 },
  { name: 'Mar', sales: 55000 },
  { name: 'Apr', sales: 48000 },
  { name: 'May', sales: 62000 },
  { name: 'Jun', sales: 80000 },
];
