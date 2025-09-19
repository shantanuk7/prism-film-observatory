import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Loader2, ShieldCheck } from 'lucide-react';
import UserPageLayout from '../components/UserPageLayout';
import SuggestionCard from '../components/admin/SuggestionCard';

export default function AdminDashboard() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/admin/suggestions');
            setSuggestions(data);
        } catch (err) {
            setError('Failed to load suggestions.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);
    
    // Function to handle approving or rejecting, passed to child
    const handleUpdateSuggestion = (suggestionId) => {
        // Remove the suggestion from the list optimistically
        setSuggestions(prev => prev.filter(s => s._id !== suggestionId));
    };

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-500" size={48} /></div>;
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        if (suggestions.length === 0) {
            return <p className="text-center text-gray-500 dark:text-slate-400 py-12">No pending suggestions. All caught up!</p>;
        }
        return (
            <div className="space-y-6">
                {suggestions.map(suggestion => (
                    <SuggestionCard 
                        key={suggestion._id} 
                        suggestion={suggestion}
                        onUpdate={handleUpdateSuggestion}
                    />
                ))}
            </div>
        );
    };

    return (
        <UserPageLayout title="Admin Dashboard" icon={ShieldCheck}>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 -mt-4">
                Review and approve or reject user-submitted scene suggestions.
            </p>
            {renderContent()}
        </UserPageLayout>
    );
}