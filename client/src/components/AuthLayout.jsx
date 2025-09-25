// client/src/components/AuthLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const prismLogo = '/src/assets/logo.png'; // Make sure this path is correct

const AuthLayout = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/20 via-transparent to-transparent dark:from-teal-900/30"></div>
            <div className="z-10 text-center mb-8">
                <Link to="/" className="inline-flex items-center gap-3">
                    <img src={prismLogo} alt="Prism Logo" className="w-12 h-12" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Prism</h1>
                </Link>
            </div>
            <div className="z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;