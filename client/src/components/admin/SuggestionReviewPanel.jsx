import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import SuggestionCard from './SuggestionCard';
import { Loader2 } from 'lucide-react';

export default function SuggestionReviewPanel() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
        fetchSuggestions();
    }, []);

    const handleUpdateSuggestion = (suggestionId) => {
        setSuggestions(prev => prev.filter(s => s._id !== suggestionId));
    };

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
}