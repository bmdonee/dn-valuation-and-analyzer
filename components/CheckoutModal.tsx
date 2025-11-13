import React, { useState } from 'react';
import type { Domain } from '../types';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';

interface CheckoutModalProps {
    domain: Domain;
    onClose: () => void;
    onConfirm: (domainName: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ domain, onClose, onConfirm }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onConfirm(domain.name);
            }, 2000);
        }, 1500);
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 m-4" onClick={(e) => e.stopPropagation()}>
                {!isSuccess ? (
                <>
                    <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Complete Your Purchase</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <p className="text-sm text-slate-400">You are purchasing:</p>
                            <p className="text-2xl font-bold text-sky-400">{domain.name}</p>
                            <p className="text-3xl font-bold text-white mt-2">${(domain.price || 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-4">
                             <input type="text" placeholder="Full Name" className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                             <input type="email" placeholder="Email Address" className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <button 
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="w-full bg-sky-600 text-white font-semibold p-3 rounded-md hover:bg-sky-700 transition disabled:bg-slate-600 flex items-center justify-center"
                        >
                            {isProcessing ? <Spinner className="w-6 h-6" /> : 'Confirm Purchase'}
                        </button>
                    </div>
                </>
                ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                            <Icon name="check" className="w-8 h-8"/>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Purchase Successful!</h2>
                        <p className="text-slate-300 mt-2">You are now the owner of <span className="font-bold text-sky-400">{domain.name}</span>.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
