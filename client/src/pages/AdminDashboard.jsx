import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import UserPageLayout from '../components/UserPageLayout';
import SuggestionReviewPanel from '../components/admin/SuggestionReviewPanel'; 
import UserManagementPanel from '../components/admin/UserManagementPanel';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('suggestions');

    return (
        <UserPageLayout title="Admin Dashboard" icon={ShieldCheck}>
            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('suggestions')}
                        className={`${
                            activeTab === 'suggestions'
                                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        Pending Suggestions
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${
                            activeTab === 'users'
                                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        User Management
                    </button>
                </nav>
            </div>

            {/* Content based on active tab */}
            <div>
                {activeTab === 'suggestions' && <SuggestionReviewPanel />}
                {activeTab === 'users' && <UserManagementPanel />}
            </div>
        </UserPageLayout>
    );
}