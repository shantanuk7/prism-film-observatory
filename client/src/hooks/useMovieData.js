import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

export const useMovieData = () => {
    const { id: movieId } = useParams();
    
    // All data-related state is now managed here
    const [movieDetails, setMovieDetails] = useState(null);
    const [scenes, setScenes] = useState([]);
    const [observations, setObservations] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // The data fetching logic is moved into the hook
    useEffect(() => {
        if (!movieId) return;

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [detailsRes, scenesRes, obsRes, anlsRes] = await Promise.all([
                    axios.get(`/movies/${movieId}`),
                    axios.get(`/scenes/${movieId}`),
                    axios.get(`/observations/${movieId}`),
                    axios.get(`/analyses/${movieId}`),
                ]);
                
                setMovieDetails(detailsRes.data);
                
                const sortedScenes = scenesRes.data.sort((a, b) => a.sceneNumber - b.sceneNumber);
                setScenes(sortedScenes);
                
                setObservations(obsRes.data);
                setAnalyses(anlsRes.data);

            } catch(err) { 
                console.error("Failed to fetch page data:", err);
                setError("Could not load data for this film. Please try again later.");
            } finally { 
                setLoading(false);
            }
        };

        fetchAllData();
    }, [movieId]);

    // The hook returns the state and setters for the component to use
    return {
        movieId,
        movieDetails,
        scenes,
        setScenes,
        observations,
        setObservations,
        analyses,
        setAnalyses,
        loading,
        error,
    };
};