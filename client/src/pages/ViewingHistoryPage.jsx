import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Loader2, History } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function ViewingHistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/users/history');
                setHistory(data);
            } catch (err) {
                setError('Could not load your viewing history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-600 dark:text-teal-500" size={48} /></div>;
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        return history.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                {history.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
        ) : (
            <p className="text-center text-gray-500 dark:text-slate-400 py-12">You haven't viewed any movies yet.</p>
        );
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-200 dark:border-slate-700">
                <History className="text-teal-600 dark:text-teal-400" size={28} />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Viewing History</h1>
            </div>
            {renderContent()}
        </div>
    );
}