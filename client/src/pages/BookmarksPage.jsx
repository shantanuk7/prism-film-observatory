import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Loader2, Bookmark } from 'lucide-react';
import BookmarkCard from '../components/BookmarkCard'; // <-- Import the new card
import Header from '../components/Header';

export default function BookmarksPage() {
    const [activeTab, setActiveTab] = useState('observations');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [data, setData] = useState({
        bookmarks: [],
        analysisBookmarks: [],
        movieDetailsMap: {}
    });

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/users/bookmarks');
                setData(response.data);
            } catch (err) {
                setError('Could not load your bookmarks.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-600 dark:text-teal-500" size={48} /></div>;
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }

        const itemsToDisplay = activeTab === 'observations' ? data.bookmarks : data.analysisBookmarks;
        const emptyMessage = activeTab === 'observations' ? "You haven't bookmarked any observations yet." : "You haven't bookmarked any analyses yet.";
        
        return itemsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {itemsToDisplay.map(item => {
                    const movie = data.movieDetailsMap[item.movieId];
                    if (!movie) return null; // Failsafe if movie details are missing
                    return <BookmarkCard key={item._id} bookmark={item} movie={movie} />;
                })}
            </div>
        ) : (
            <p className="text-center text-gray-500 dark:text-slate-400 py-12">{emptyMessage}</p>
        );
    };

    return (
        <div>
            <Header/>

            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-200 dark:border-slate-700">
                <Bookmark className="text-teal-600 dark:text-teal-400" size={28} />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">My Bookmarks</h1>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('observations')} className={`${activeTab === 'observations' ? 'bg-teal-100 dark:bg-slate-700 text-teal-700 dark:text-slate-100' : 'text-gray-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800'} px-4 py-2 font-medium text-sm rounded-md transition-colors`}>
                        Observations
                    </button>
                    <button onClick={() => setActiveTab('analyses')} className={`${activeTab === 'analyses' ? 'bg-teal-100 dark:bg-slate-700 text-teal-700 dark:text-slate-100' : 'text-gray-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800'} px-4 py-2 font-medium text-sm rounded-md transition-colors`}>
                        Analyses
                    </button>
                </nav>
            </div>

            {renderContent()}
        </div>
    );
}