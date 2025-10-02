

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserIcon, AlertTriangleIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

const AuthScreen: React.FC = () => {
    const { login } = useAppContext();
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [step, setStep] = useState<'phone' | 'otp' | 'email'>('phone');
    
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setError('');
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
        }, 1500);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp !== '123456') { // Mock OTP
            setError('Invalid OTP. Please try again.');
            return;
        }
        setError('');
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (authMode === 'signup') {
                setStep('email');
            } else {
                login(phone, undefined, false); // Login successful for existing user
            }
        }, 1500);
    };

    const handleFinalizeSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate account creation
        setTimeout(() => {
            setIsLoading(false);
            login(phone, email, true); // Signup successful for new user
        }, 1000);
    }
    
    const renderPhoneStep = () => (
        <form onSubmit={handleSendOtp} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
                {authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                     <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 font-semibold">
                        +91
                    </span>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setPhone(value);
                        }}
                        placeholder="Enter your 10-digit mobile number"
                        className="block w-full flex-1 rounded-none rounded-r-md px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                        maxLength={10}
                    />
                </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                {isLoading ? <Spinner /> : 'Send OTP'}
            </button>
        </form>
    );

    const renderOtpStep = () => (
         <form onSubmit={handleVerifyOtp} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Verify Your Number</h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">Enter the 6-digit code sent to +91 {phone}. (Hint: it's 123456)</p>
            <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code (OTP)</label>
                <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-center tracking-[0.5em]"
                    required
                />
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                {isLoading ? <Spinner /> : 'Verify & Continue'}
            </button>
        </form>
    );

    const renderEmailStep = () => (
         <form onSubmit={handleFinalizeSignup} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Account Security (Optional)</h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">Add an email and password for account recovery and easier login.</p>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div className="flex flex-col gap-3">
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                    {isLoading ? <Spinner /> : 'Finish Signup'}
                </button>
                <button type="button" onClick={() => login(phone, undefined, true)} className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:underline">
                    Skip and complete later
                </button>
            </div>
        </form>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-700 dark:text-green-400">NutriScan AI</h1>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                            <AlertTriangleIcon className="w-5 h-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    )}

                    {step === 'phone' && renderPhoneStep()}
                    {step === 'otp' && renderOtpStep()}
                    {step === 'email' && renderEmailStep()}

                    <div className="mt-6 text-center text-sm">
                        {authMode === 'login' ? (
                            <p className="text-gray-600 dark:text-gray-400">
                                No account?{' '}
                                <button onClick={() => { setAuthMode('signup'); setError(''); }} className="font-medium text-green-600 hover:text-green-500">
                                    Sign up
                                </button>
                            </p>
                        ) : (
                             <p className="text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <button onClick={() => { setAuthMode('login'); setError(''); }} className="font-medium text-green-600 hover:text-green-500">
                                    Log in
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
