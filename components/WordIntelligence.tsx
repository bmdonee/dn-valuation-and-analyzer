import React from 'react';
import type { WordAnalysis } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface WordIntelligenceProps {
  analysis: WordAnalysis[];
}

export const WordIntelligence: React.FC<WordIntelligenceProps> = ({ analysis }) => {
    if (!analysis || analysis.length === 0) {
        return null;
    }

    const chartData = analysis.map(item => ({
        name: item.word,
        Pronounceability: item.metrics.pronounceability,
        Memorability: item.metrics.memorability
    }));

    return (
        <div className="bg-slate-800 p-6 rounded-lg mt-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-sky-400 mb-4 text-center">Linguistic Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-white mb-3 text-center">Brand Word Metrics</h4>
                    <div style={{ width: '100%', height: 250 }}>
                         <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis domain={[0, 10]} stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}/>
                                <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                                <Bar dataKey="Pronounceability" fill="#38bdf8" />
                                <Bar dataKey="Memorability" fill="#818cf8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div>
                     <h4 className="font-semibold text-white mb-3 text-center">Word Associations</h4>
                     <div className="space-y-4">
                         {analysis.map(item => (
                             <div key={item.word}>
                                 <p className="font-bold text-slate-300">{item.word}</p>
                                 <div className="flex flex-wrap gap-2 mt-1">
                                     {item.associations.map(assoc => (
                                         <span key={assoc} className="bg-slate-700 text-slate-300 text-xs font-medium px-2 py-1 rounded-full">
                                             {assoc}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};
