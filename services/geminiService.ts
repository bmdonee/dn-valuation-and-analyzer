
import { GoogleGenAI, Type } from '@google/genai';
import type { InnovativeFeature, MonetizationStrategy, PredictiveAnalytics, WordAnalysis, DomainIdeasResult, WordCombination } from '../types';

// Initialize the GoogleGenAI client once with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates a user-friendly error message from a Gemini API call error.
 * @param error The error caught from the try/catch block.
 * @param context A verb phrase describing the action that failed, e.g., "valuate the domain".
 * @returns An Error object with a user-friendly message.
 */
const handleGeminiError = (error: unknown, context: string): Error => {
    console.error(`Error trying to ${context}:`, error);
    
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
    // Check for common error messages related to API keys
    if (errorMessage.includes('api key') || 
        errorMessage.includes('permission denied') || 
        errorMessage.includes('not found')) { // "Requested entity was not found" can happen with bad keys
        return new Error(`Failed to ${context}. This can happen if the API key is missing or invalid. Please ensure it is configured correctly.`);
    }

    return new Error(`Failed to ${context} due to an unexpected AI service error. Please try again later.`);
};


const valuationSchema = {
    type: Type.OBJECT,
    properties: {
        confidence: { type: Type.STRING, description: 'Confidence level of the valuation (High, Medium, Low)' },
        searchVolume: { type: Type.NUMBER, description: 'Estimated monthly search volume for the primary keyword.' },
        cpc: { type: Type.NUMBER, description: 'Average Cost-Per-Click for the primary keyword.' },
        marketTrend: { type: Type.STRING, description: 'Current market trend for the domain category (up, stable, down).' },
        salesComps: { type: Type.NUMBER, description: 'Estimated value based on comparable domain sales.' },
        brandabilityScore: { type: Type.NUMBER, description: 'Score from 0-100 for how brandable the name is.' },
        seoScore: { type: Type.NUMBER, description: 'Score from 0-100 for SEO potential.' },
        valuation: { type: Type.NUMBER, description: 'The final estimated valuation of the domain in USD.' },
    },
    required: ['confidence', 'searchVolume', 'cpc', 'marketTrend', 'salesComps', 'brandabilityScore', 'seoScore', 'valuation']
};

export const getDomainValuation = async (domainName: string): Promise<PredictiveAnalytics & { valuation: number }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Analyze the domain "${domainName}" and provide a valuation. Consider factors like keyword strength, brandability, market trends, and comparable sales. Provide your output in JSON format.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: valuationSchema,
                systemInstruction: "You are a domain valuation expert. Provide data-driven analysis.",
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
       throw handleGeminiError(error, 'valuate the domain');
    }
};

const innovativeFeaturesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the innovative feature." },
            description: { type: Type.STRING, description: "A brief description of the feature." }
        },
        required: ["name", "description"]
    }
};

export const getInnovativeFeatures = async (): Promise<InnovativeFeature[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 3 innovative, AI-powered features for a domain name marketplace platform. The features should be unique and provide real value to users. Provide your output in JSON format.",
            config: {
                responseMimeType: "application/json",
                responseSchema: innovativeFeaturesSchema,
                systemInstruction: "You are a creative product manager specializing in AI-driven platforms.",
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting innovative features:", error);
        // Do not throw, return empty array to gracefully degrade
        return [];
    }
};

const monetizationStrategiesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The name of the monetization strategy." },
            description: { type: Type.STRING, description: "A brief description of the strategy." },
            potential: { type: Type.NUMBER, description: "A score from 1-10 indicating the potential of this strategy." }
        },
        required: ["name", "description", "potential"]
    }
};

export const getMonetizationStrategies = async (domainName: string): Promise<MonetizationStrategy[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 diverse monetization strategies for the domain name "${domainName}". Consider its niche and potential uses. Provide your output in JSON format.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: monetizationStrategiesSchema,
                systemInstruction: "You are a business development expert specializing in digital assets.",
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting monetization strategies:", error);
        return [];
    }
};

const wordIntelligenceSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            word: { type: Type.STRING },
            metrics: {
                type: Type.OBJECT,
                properties: {
                    length: { type: Type.NUMBER },
                    syllables: { type: Type.NUMBER },
                    pronounceability: { type: Type.NUMBER, description: "Score from 1-10" },
                    memorability: { type: Type.NUMBER, description: "Score from 1-10" },
                },
                required: ["length", "syllables", "pronounceability", "memorability"],
            },
            associations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of common associated words or concepts."
            }
        },
        required: ["word", "metrics", "associations"]
    }
};

export const getWordIntelligence = async (domainName: string): Promise<WordAnalysis[]> => {
    try {
        const words = domainName.split('.')[0].replace('-', ' ').split(' ');
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Analyze each word in this list: [${words.join(', ')}]. For each word, provide metrics (length, syllables, pronounceability score 1-10, memorability score 1-10) and a list of 3-5 common associations. Provide your output in JSON format.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: wordIntelligenceSchema,
                systemInstruction: "You are a linguistic and branding analyst.",
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting word intelligence:", error);
        return [];
    }
};

export const getDomainIdeas = async (inputWords: string): Promise<DomainIdeasResult> => {
    const domainIdeaSchema = {
        type: Type.OBJECT,
        properties: {
            domainName: { type: Type.STRING, description: "The suggested domain name without the TLD. e.g., 'ChainFlow'" },
            tlds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of recommended Top-Level Domains. e.g., ['com', 'io']" },
            brandabilityScore: { type: Type.NUMBER, description: "A score from 0-100 indicating how brandable and valuable it sounds." },
            context: { type: Type.STRING, description: "A brief explanation of the domain's meaning or ideal use case for a startup." }
        },
        required: ["domainName", "tlds", "brandabilityScore", "context"]
    };

    const domainIdeasResultSchema = {
        type: Type.OBJECT,
        properties: {
            relatedWords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A ranked list of 5-7 semantically related or frequently paired words."
            },
            domainIdeas: {
                type: Type.ARRAY,
                items: domainIdeaSchema,
                description: "A list of 8-10 premium, brandable domain name suggestions."
            }
        },
        required: ["relatedWords", "domainIdeas"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Based on the input keywords "${inputWords}", first produce a ranked list of 5-7 semantically related or frequently paired words used in real domain names and startup branding. Then, generate a list of 8 creative and brandable domain suggestions. These suggestions should be a maximum of two words, and can use modern brand suffixes (e.g., fy, ly, labs, tech, hub, ai). For each suggestion, provide the domain name without a TLD, the best matching TLDs (like com, io, ai, xyz), a brandability score from 0 to 100, and a brief context about its market fit.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: domainIdeasResultSchema,
                systemInstruction: "You are an AI brand-naming strategist experienced in domain analysis and startup branding. Your suggestions should be creative, modern, and commercially viable.",
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        throw handleGeminiError(error, 'generate domain ideas');
    }
};

const wordCombinationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            domainName: { type: Type.STRING },
            tlds: { type: Type.ARRAY, items: { type: Type.STRING } },
            brandabilityScore: { type: Type.NUMBER, description: "Score from 0-100 for how startup-friendly it sounds." },
            industry: { type: Type.STRING, description: "e.g., tech, fintech, AI, health" },
            availability: { type: Type.STRING, description: "Likely Available, Premium, or Taken" }
        },
        required: ["domainName", "tlds", "brandabilityScore", "industry", "availability"]
    }
};

export const getWordCombinations = async (primaryWords: string, secondaryWords: string): Promise<WordCombination[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Generate 12 brandable domain name ideas by combining words from the primary list [${primaryWords}] and the secondary list [${secondaryWords}]. Use smart concatenation, blending, or fusion. For each generated domain, provide ideal matching TLDs, a brandability score (0-100), its most relevant industry, and an availability probability (Likely Available, Premium, or Taken). Analyze linguistic harmony, syllable flow, and industry naming trends.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: wordCombinationSchema,
                systemInstruction: "You are a creative branding expert specializing in generating memorable startup names.",
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        throw handleGeminiError(error, 'generate word combinations');
    }
};

// Fix: Add testApiKey function to resolve import error in Settings.tsx.
export const testApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey) {
        return false;
    }
    try {
        const testAi = new GoogleGenAI({ apiKey });
        await testAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "hello",
        });
        return true;
    } catch (error) {
        console.error("API key test failed:", error);
        return false;
    }
};
