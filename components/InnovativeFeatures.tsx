import React from 'react';
import type { InnovativeFeature } from '../types';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';

interface InnovativeFeaturesProps {
    features: InnovativeFeature[];
    isLoading: boolean;
}

const FeatureCard: React.FC<{ feature: InnovativeFeature }> = ({ feature }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg transform transition duration-300 hover:-translate-y-2 border border-transparent hover:border-sky-500">
        <div className="flex items-center mb-4">
            <Icon name="lightbulb" className="w-8 h-8 text-sky-400 mr-4" />
            <h3 className="text-xl font-bold text-white">{feature.name}</h3>
        </div>
        <p className="text-slate-300">{feature.description}</p>
    </div>
);


export const InnovativeFeatures: React.FC<InnovativeFeaturesProps> = ({ features, isLoading }) => {
  return (
    <div className="py-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Innovative AI Tools</h2>
            <p className="mt-4 text-lg text-slate-400">Differentiating our platform with next-generation capabilities.</p>
        </div>
        {isLoading ? (
            <div className="flex justify-center">
                <Spinner className="w-12 h-12" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                ))}
                 {/* Manually add a placeholder if API fails or returns less than 3 */}
                {features.length < 3 && (
                    <FeatureCard feature={{name: "Brand Suitability Analysis", description: "AI analyzes a domain's phonetic appeal and semantic fit for various industries, providing a brand suitability score."}}/>
                )}
            </div>
        )}
    </div>
  );
};