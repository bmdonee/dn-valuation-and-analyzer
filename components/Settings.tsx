import React, { useState, useEffect } from 'react';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';
import { testApiKey } from '../services/geminiService';

interface SettingsProps {
    apiKey: string | null;
    onApiKeyUpdate: (key: string | null) => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

export const Settings: React.FC<SettingsProps> = ({ apiKey, onApiKeyUpdate }) => {
    const [keyInput, setKeyInput] = useState(apiKey || '');
    const [showKey, setShowKey] = useState(false);
    const [testStatus, setTestStatus] = useState<TestStatus>('idle');

    useEffect(() => {
        // If an API key already exists from a previous session, mark status as success.
        if (apiKey) {
            setTestStatus('success');
        }
    }, [apiKey]);

    const handleSaveAndTest = async () => {
        if (!keyInput.trim()) {
            onApiKeyUpdate(null);
            setTestStatus('idle');
            return;
        }
        
        setTestStatus('testing');
        const isValid = await testApiKey(keyInput);

        if (isValid) {
            onApiKeyUpdate(keyInput);
            setTestStatus('success');
        } else {
            // Do not clear the key on failed test, to allow user to correct it.
            // But update the global state to reflect it's invalid.
            onApiKeyUpdate(null);
            setTestStatus('error');
        }
    };
    
    const getStatusIndicator = () => {
        switch (testStatus) {
            case 'testing':
                return <Spinner className="w-5 h-5" />;
            case 'success':
                return <span className="flex items-center gap-2 text-green-400"><Icon name="check" className="w-5 h-5" /> Connected</span>;
            case 'error':
                return <span className="flex items-center gap-2 text-red-400"><Icon name="close" className="w-5 h-5" /> Invalid or Failed</span>;
            default:
                 return <span className="text-slate-400">Not Connected</span>;
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center">
                <Icon name="settings" className="w-12 h-12 text-sky-400 mx-auto" />
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-4">Settings</h2>
                <p className="mt-4 text-lg text-slate-400">Configure your application settings and API connections.</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-700">
                <h3 className="text-2xl font-semibold text-white mb-2">API Configuration</h3>
                <p className="text-slate-400 mb-6">Your Google Gemini API key is required for all AI-powered features. It is stored securely in your browser's local storage and never sent to our servers.</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="api-key" className="block text-sm font-medium text-slate-300 mb-1">Project API Key</label>
                        <div className="relative">
                            <input
                                id="api-key"
                                type={showKey ? 'text' : 'password'}
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                placeholder="Enter your Google Gemini API key"
                                className="w-full rounded-md border-0 bg-slate-700 pr-10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                            >
                                <Icon name={showKey ? 'eye-off' : 'eye'} className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                         <div className="text-sm font-medium order-2 sm:order-1">
                            <span className="text-slate-300">Status: </span>
                            {getStatusIndicator()}
                        </div>
                        <button
                            onClick={handleSaveAndTest}
                            disabled={testStatus === 'testing'}
                            className="w-full sm:w-auto order-1 sm:order-2 flex-none rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:bg-slate-600 flex items-center justify-center gap-2"
                        >
                            {testStatus === 'testing' ? <Spinner className="w-5 h-5" /> : 'Save & Test Connection'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
