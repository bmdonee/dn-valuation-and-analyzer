import React from 'react';
import type { Domain, SalesHistory } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SALES_DATA } from '../constants';
import { Icon } from './common/Icon';

interface DashboardProps {
  listedDomains: Domain[];
  biddingOn: Domain[];
}

const StatCard: React.FC<{title: string, value: string, iconName: 'tag' | 'chart' | 'hammer'}> = ({title, value, iconName}) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-slate-700 p-3 rounded-full">
            <Icon name={iconName} className="w-6 h-6 text-sky-400" />
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DomainTable: React.FC<{ title: string; domains: Domain[] }> = ({ title, domains }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-slate-700 text-sm text-slate-400">
                    <tr>
                        <th className="py-2">Domain</th>
                        <th className="py-2">Valuation</th>
                        <th className="py-2">Price/Bid</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-300">
                    {domains.map(d => (
                        <tr key={d.name} className="border-b border-slate-700/50">
                            <td className="py-3 font-semibold">{d.name}</td>
                            <td className="py-3 text-green-400">${d.valuation.toLocaleString()}</td>
                            <td className="py-3">${(d.currentBid || d.price || 0).toLocaleString()}</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${d.type === 'auction' ? 'bg-orange-500/20 text-orange-300' : 'bg-green-500/20 text-green-300'}`}>
                                    {d.type === 'auction' ? 'Auction' : 'Listed'}
                                </span>
                            </td>
                            <td className="py-3">
                                <button className="text-sky-400 hover:text-sky-300 text-sm">Manage</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ listedDomains, biddingOn }) => {
    const portfolioValue = listedDomains.reduce((acc, domain) => acc + domain.valuation, 0);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Dashboard</h2>
            <p className="mt-4 text-lg text-slate-400">Manage your domain portfolio and track your activity.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Listings" value={listedDomains.length.toString()} iconName="tag" />
            <StatCard title="Portfolio Valuation" value={`$${portfolioValue.toLocaleString()}`} iconName="chart" />
            <StatCard title="Active Bids" value={biddingOn.length.toString()} iconName="hammer" />
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Sales History ($)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={SALES_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                        <Line type="monotone" dataKey="sales" stroke="#38bdf8" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="space-y-8">
           <DomainTable title="My Listed Domains" domains={listedDomains} />
        </div>
    </div>
  );
};