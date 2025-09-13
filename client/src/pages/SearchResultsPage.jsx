import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { Loader2 } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Prevent API call if query is empty or just whitespace
        if (!query || !query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`/movies/search?query=${encodeURIComponent(query)}`);
                setResults(res.data);
            } catch (err) {
                console.error("Failed to fetch search results:", err);
                setError('Could not perform search. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        // Debounce the search request to avoid excessive API calls
        const searchTimeout = setTimeout(() => {
            fetchResults();
        }, 300); // 300ms delay

        return () => clearTimeout(searchTimeout);

    }, [query]); // Re-run effect when the query parameter changes

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-teal-600" size={48} />
                </div>
            );
        }

        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }

        if (results.length === 0) {
            return <p className="text-center text-gray-500">No results found for "{query}".</p>;
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                {results.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen pt-24">
            <main className="container mx-auto px-6 py-8">
                {query && (
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                        Search Results for: <span className="text-teal-600">"{query}"</span>
                    </h1>
                )}
                {renderContent()}
            </main>
        </div>
    );
}