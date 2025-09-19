// client/src/components/UserPageLayout.jsx

import React from 'react';
import Header from './Header';

const UserPageLayout = ({ title, icon, children }) => {
    // The Icon component is passed as a prop, so we render it directly.
    const IconComponent = icon; 

    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen transition-colors">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-200 dark:border-slate-700">
                        {IconComponent && <IconComponent className="text-teal-600 dark:text-teal-400" size={28} />}
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{title}</h1>
                    </div>
                    {/* Page Content */}
                    <div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserPageLayout;