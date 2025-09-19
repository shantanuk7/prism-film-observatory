import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Loader2 } from 'lucide-react';

import { useMovieData } from '../hooks/useMovieData';

import Header from '../components/Header';
import SceneListSidebar from '../components/movie-observations/SceneListSidebar';
import MovieHeader from '../components/movie-observations/MovieHeader';
import ContentTabs from '../components/movie-observations/ContentTabs';
import SceneDetail from '../components/movie-observations/SceneDetail';
import ObservationFeed from '../components/movie-observations/ObservationFeed';
import AnalysisFeed from '../components/movie-observations/AnalysisFeed';

import NewObservationModal from '../components/movie-observations/modals/NewObservationModal';
import UploadAnalysisModal from '../components/movie-observations/modals/UploadAnalysisModal';
import ManageScenesModal from '../components/movie-observations/modals/ManageScenesModal';
import SuggestionModal from '../components/movie-observations/modals/SuggestionModal';

export default function MovieObservationsPage() {
    const { user, loading: authLoading, setUser } = useAuth();

    const observationCategories = [
        "Cinematography",
        "Editing",
        "Sound & Music",
        "Symbolism",
        "Foreshadowing",
        "Character Arc",
        "Dialogue",
        "Pacing",
        "World-Building",
        "Costume & Set Design",
        "Visual Effects",
        "Performance / Acting",
        "Other"
    ];

    const {
        movieId,
        movieDetails,
        scenes, setScenes,
        fetchAllData: refetchAllData,
        observations, setObservations,
        analyses, setAnalyses,
        loading,
        error
    } = useMovieData();
    
    const [showObservationModal, setShowObservationModal] = useState(false);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showManageScenesModal, setShowManageScenesModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("observations");
    const [selectedScene, setSelectedScene] = useState(1);

    // Observation Categories And Sorting
    const [observationSort, setObservationSort] = useState('newest');
    const [activeCategory, setActiveCategory] = useState('All');
    const [analysisSort, setAnalysisSort] = useState('newest');

    const [editingScene, setEditingScene] = useState(null);

    useEffect(() => {
        // If the user is logged in, log this movie to their history
        if (user && movieId) {
            const logView = async () => {
                try {
                    axios.post('/users/history', { movieId });
                } catch (err) {
                    console.error("Failed to log view history:", err);
                }
            };
            logView();
        }
    }, [user, movieId]);

    // Correctly use useEffect to update selectedScene when scenes data loads
    useEffect(() => {
        if (scenes.length > 0 && !scenes.find(s => s.sceneNumber === selectedScene)) {
            setSelectedScene(scenes[0].sceneNumber);
        }
    }, [scenes]);

    // Logic to process observations based on filters/sort
    const processedObservations = useMemo(() => {
        return observations
            .filter(obs => obs.sceneId == selectedScene)
            .filter(obs => {
                if (activeCategory === 'All') return true;
                return obs.categories.includes(activeCategory);
            })
            .sort((a, b) => {
                switch (observationSort) {
                    case 'oldest':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'mostLiked':
                        return (b.likes?.length || 0) - (a.likes?.length || 0);
                    case 'newest':
                    default:
                        return new Date(b.createdAt) - new Date(a.createdAt);
                }
            });
    }, [observations, selectedScene, activeCategory, observationSort]);

    // Logic to sort analyses 
    const sortedAnalyses = useMemo(() => {
        return [...analyses].sort((a, b) => {
             switch (analysisSort) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
    }, [analyses, analysisSort]);

    // Handlers for adding new content
    const handleObservationAdded = useCallback((newObs) => setObservations(p => [newObs, ...p].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))), [setObservations]);
    const handleAnalysisAdded = useCallback((newAnl) => setAnalyses(p => [newAnl, ...p].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))), [setAnalyses]);
    const handleSceneAdded = useCallback((newScene) => setScenes(p => [...p, newScene].sort((a,b) => a.sceneNumber - b.sceneNumber)), [setScenes]);

    const [showSuggestionModal, setShowSuggestionModal] = useState(false);
    const [suggestionType, setSuggestionType] = useState('NEW_SCENE');

    const handleSuggestEdit = (type) => {
        setSuggestionType(type);
        setShowSuggestionModal(true);
    };

    // Handlers for likes and bookmarks
    const handleLikeObservation = async (observationId) => {
        if (!user) return alert("Please log in to like observations.");
        try {
            const { data: updatedObservation } = await axios.put(`/observations/${observationId}/like`);
            setObservations(observations.map(obs => obs._id === observationId ? updatedObservation : obs));
        } catch (err) {
            console.error("Failed to like observation:", err);
        }
    };

    const handleBookmarkObservation = async (observationId) => {
        if (!user) return alert("Please log in to bookmark observations.");
        try {
            const { data } = await axios.put(`/observations/${observationId}/bookmark`); 
            setUser({ ...user, bookmarks: data.bookmarks });
        } catch (err) {
            console.error("Failed to bookmark observation:", err);
        }
    };

    const handleLikeAnalysis = async (analysisId) => {
        if (!user) return alert("Please log in to like analyses.");
        try {
            const { data: updatedAnalysis } = await axios.put(`/analyses/${analysisId}/like`);
            setAnalyses(analyses.map(anl => anl._id === analysisId ? updatedAnalysis : anl));
        } catch (err) {
            console.error("Failed to like analysis:", err);
        }
    };

    const handleBookmarkAnalysis = async (analysisId) => {
        if (!user) return alert("Please log in to bookmark analyses.");
        try {
            const { data } = await axios.put(`/analyses/${analysisId}/bookmark`);
            setUser({ ...user, analysisBookmarks: data.analysisBookmarks });
        } catch (err) {
            console.error("Failed to bookmark analysis:", err);
        }
    };

    const handleEditSceneClick = () => {
        setEditingScene(currentSceneData); // Set the current scene as the one to edit
        setShowManageScenesModal(true);
    };

    const handleCloseManageModal = () => {
        setShowManageScenesModal(false);
        setEditingScene(null); // Clear the editing scene when modal closes
    };

    const handleDeleteScene = async () => {
        if (window.confirm(`Are you sure you want to delete Scene ${currentSceneData.sceneNumber}? This will also delete all of its observations.`)) {
            try {
                await axios.delete(`/scenes/${currentSceneData._id}`);
                // Refetch all movie data to ensure the UI is up-to-date
                refetchAllData(); 
            } catch (error) {
                console.error("Failed to delete scene:", error);
                alert("Could not delete the scene. Please try again.");
            }
        }
    };
    
    // Derived State
    const currentSceneData = scenes.find(s => s.sceneNumber === selectedScene) || {};

    // Loading and Error States
    if (loading) {
        return <><Header /><div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-teal-600 dark:text-teal-500" size={48} /></div></>;
    }
    if (error) {
        return <><Header /><div className="text-center pt-32"><h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2><p className="text-gray-600 dark:text-slate-400 mt-2">{error}</p></div></>;
    }

    // Main Render
    return (
        <div className="bg-gray-100 dark:bg-slate-900 min-h-screen transition-colors">
            <Header />
            <div className="flex pt-16">
                <SceneListSidebar
                    scenes={scenes}
                    selectedScene={selectedScene}
                    onSelectScene={setSelectedScene}
                    user={user}
                    authLoading={authLoading}
                    onManageScenesClick={() => {
                        setEditingScene(null); // Ensure it's in "create" mode
                        setShowManageScenesModal(true);
                    }}
                    onSuggestNewSceneClick={() => handleSuggestEdit('NEW_SCENE')}
                />

                <main className="flex-1 lg:ml-80 flex flex-col h-[calc(100vh-4rem)]">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                        <div className="max-w-4xl mx-auto">
                            <MovieHeader details={movieDetails} />

                            <ContentTabs
                                currentPage={currentPage}
                                onSetPage={setCurrentPage}
                                user={user}
                                authLoading={authLoading}
                                scenesExist={scenes.length > 0}
                                onNewObservationClick={() => setShowObservationModal(true)}
                                onUploadAnalysisClick={() => setShowAnalysisModal(true)}
                            />

                            {currentPage === "observations" ? (
                                scenes.length > 0 ? (
                                    <>
                                        <SceneDetail 
                                            sceneData={currentSceneData} 
                                            selectedScene={selectedScene} 
                                            movieDetails={movieDetails}
                                            onSuggestEdit={handleSuggestEdit}
                                            onEditScene={handleEditSceneClick}
                                            onDeleteScene={handleDeleteScene}
                                        />
                                        <ObservationFeed
                                            observations={processedObservations}
                                            user={user}
                                            onLike={handleLikeObservation}
                                            onBookmark={handleBookmarkObservation}
                                            categories={observationCategories}
                                            activeCategory={activeCategory}
                                            setActiveCategory={setActiveCategory}
                                            sort={observationSort}
                                            setSort={setObservationSort}
                                        />
                                    </>
                                ) : (
                                    // If no scenes exist, show this single message
                                    <div className="text-center text-gray-500 dark:text-slate-400 py-12">
                                        <p className="mb-4">No scenes have been added for this movie yet.</p>
                                        {user && (
                                            <button 
                                                onClick={() => handleSuggestEdit('NEW_SCENE')} 
                                                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                                            >
                                                Be the first to add one!
                                            </button>
                                        )}
                                    </div>
                                )
                            ) : (
                                <AnalysisFeed
                                    analyses={sortedAnalyses}
                                    user={user}
                                    onLike={handleLikeAnalysis}
                                    onBookmark={handleBookmarkAnalysis}
                                    sort={analysisSort}
                                    setSort={setAnalysisSort}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Any logged-in user can access these modals */}
            {user && (
                <>
                    <NewObservationModal 
                        isOpen={showObservationModal} 
                        onClose={() => setShowObservationModal(false)} 
                        movieId={movieId} 
                        selectedScene={selectedScene} 
                        sceneData={currentSceneData} 
                        onObservationAdded={handleObservationAdded}
                    />
                    <UploadAnalysisModal 
                        isOpen={showAnalysisModal} 
                        onClose={() => setShowAnalysisModal(false)} 
                        movieId={movieId} 
                        onAnalysisAdded={handleAnalysisAdded}
                    />
                    <SuggestionModal 
                        isOpen={showSuggestionModal}
                        onClose={() => setShowSuggestionModal(false)}
                        movieId={movieId}
                        suggestionType={suggestionType}
                        sceneToEdit={currentSceneData}
                        scenes={scenes}
                    />
                </>
            )}

            {/* Only Admins can access the direct Scene Management Modal */}
            {user?.role === 'admin' && (
                <ManageScenesModal 
                    isOpen={showManageScenesModal} 
                    onClose={handleCloseManageModal} 
                    movieId={movieId} 
                    scenes={scenes} 
                    onSceneAdded={() => {
                        // This should be a function to refetch all scenes to see updates
                        // For now, we'll just close, but a proper implementation would update the state.
                        console.log("Scene saved, refetching would happen here.");
                    }}
                    isEditing={!!editingScene}
                    sceneToEdit={editingScene}
                />
            )}
        </div>
    );
}
