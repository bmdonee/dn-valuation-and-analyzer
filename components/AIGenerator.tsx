
import React, { useState } from 'react';
import { Icon } from './common/Icon';
import { SimilarWordGenerator } from './SimilarWordGenerator';
import { WordCombinationGenerator } from './WordCombinationGenerator';

type GeneratorTool = 'similar' | 'combination';

interface AIGeneratorProps {
    onValuateRequest: (domainName: string) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onValuateRequest }) => {
    const [activeTool, setActiveTool] = useState<GeneratorTool>('similar');

    const renderTool = () => {
        switch (activeTool) {
            case 'similar':
                return <SimilarWordGenerator onValuateRequest={onValuateRequest} />;
            case 'combination':
                return <WordCombinationGenerator onValuateRequest={onValuateRequest} />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tool: GeneratorTool; label: string }> = ({ tool, label }) => (
        <button
            onClick={() => setActiveTool(tool)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
                activeTool === tool
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <Icon name="lightbulb" className="w-12 h-12 text-sky-400 mx-auto" />
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-4">AI Name Generator</h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-400">
                    Leverage linguistic creativity and startup trend analysis to discover your next brandable domain name.
                </p>
            </div>
            
            <div className="flex justify-center space-x-4">
                <TabButton tool="similar" label="Similar Word Generator" />
                <TabButton tool="combination" label="Word Combination Generator" />
            </div>

            <div className="max-w-7xl mx-auto relative">
                <div>
                    {renderTool()}
                </div>
            </div>
        </div>
    );
};
