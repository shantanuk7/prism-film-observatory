import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  ChevronDown, Plus, ThumbsUp, Bookmark, Share2, MoreHorizontal,
  Download, Upload, UserCircle, X, Film, FileText, Settings, Loader2, ImagePlus
} from 'lucide-react';
import Header from '../components/Header';
import { formatDistanceToNow } from 'date-fns';

// --- MODALS ---

const NewObservationModal = ({ isOpen, onClose, movieId, selectedScene, sceneData, onObservationAdded }) => {
  const [formData, setFormData] = useState({ content: '', categories: [], timestamp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ["Cinematography", "Animation", "Symbolism", "Visual Storytelling", "Storytelling", "Character Development"];

  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || !formData.content.trim() || formData.categories.length === 0) return;
    setIsSubmitting(true);
    setError('');
    try {
      const payload = { ...formData, movieId, sceneId: String(selectedScene) };
      const res = await axios.post('/observations', payload);
      onObservationAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post observation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
        setFormData({ content: '', categories: [], timestamp: '' });
        setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const currentScene = sceneData || {};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">New Observation</h2>
            <p className="text-sm text-gray-600">Scene {selectedScene} • {currentScene.startTime} - {currentScene.endTime}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Scene Context</h3>
                <p className="text-sm text-gray-700">{currentScene.description}</p>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timestamp (optional)</label>
                <input type="text" value={formData.timestamp} onChange={(e) => setFormData(prev => ({ ...prev, timestamp: e.target.value }))} placeholder="e.g., 3:41" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Observation *</label>
                <textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} placeholder="Share your observation..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Categories (select up to 3)</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button key={category} type="button" onClick={() => handleCategoryToggle(category)} disabled={!formData.categories.includes(category) && formData.categories.length >= 3} className={`px-3 py-1.5 text-sm rounded-full border transition-all ${formData.categories.includes(category) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500 disabled:opacity-50'}`}>
                            {category}
                        </button>
                    ))}
                </div>
             </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-col items-end gap-3">
          {error && <p className="text-sm text-red-600 w-full text-left">{error}</p>}
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={isSubmitting || !formData.content.trim() || formData.categories.length === 0} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              {isSubmitting ? 'Posting...' : 'Post Observation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadAnalysisModal = ({ isOpen, onClose, movieId, onAnalysisAdded }) => {
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !file || isSubmitting) return;
        setIsSubmitting(true);
        setError('');
        
        const submissionData = new FormData();
        submissionData.append('movieId', movieId);
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('analysisFile', file);

        try {
            const res = await axios.post('/analyses', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onAnalysisAdded(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload analysis.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            setFormData({ title: "", description: "" });
            setFile(null);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="border-b p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Upload Analysis</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow space-y-4">
                    <input type="text" placeholder="Analysis Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required/>
                    <textarea placeholder="Brief Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={4} required></textarea>
                    <button type="button" onClick={() => fileInputRef.current.click()} className="w-full border-2 border-dashed p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-500">
                        <Upload size={24} className="mb-2"/> {file ? file.name : 'Upload PDF Analysis'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} className="hidden" accept=".pdf" />
                </div>
                <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting || !formData.title || !formData.description || !file} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                        {isSubmitting ? "Uploading..." : "Upload Analysis"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ManageScenesModal = ({ isOpen, onClose, movieId, scenes, onSceneAdded }) => {
    const [formData, setFormData] = useState({ description: '', startTime: '', endTime: '' });
    const [startFrame, setStartFrame] = useState(null);
    const [endFrame, setEndFrame] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const startFrameRef = useRef(null);
    const endFrameRef = useRef(null);

    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) setter(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startFrame || !endFrame || isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        const newSceneNumber = scenes.length > 0 ? Math.max(...scenes.map(s => s.sceneNumber)) + 1 : 1;

        const submissionData = new FormData();
        submissionData.append('movieId', movieId);
        submissionData.append('sceneNumber', newSceneNumber);
        submissionData.append('description', formData.description);
        submissionData.append('startTime', formData.startTime);
        submissionData.append('endTime', formData.endTime);
        submissionData.append('startFrame', startFrame);
        submissionData.append('endFrame', endFrame);

        try {
            const res = await axios.post('/scenes', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSceneAdded(res.data);
            setFormData({ description: '', startTime: '', endTime: '' });
            setStartFrame(null);
            setEndFrame(null);
            if(startFrameRef.current) startFrameRef.current.value = null;
            if(endFrameRef.current) endFrameRef.current.value = null;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add scene.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            setFormData({ description: '', startTime: '', endTime: '' });
            setStartFrame(null);
            setEndFrame(null);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="border-b p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Manage Scenes</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Existing Scenes ({scenes.length})</h3>
                        <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                            {scenes.length > 0 ? scenes.map(scene => (
                                <div key={scene._id} className="bg-gray-50 p-2 rounded-md text-sm"><b>Scene {scene.sceneNumber}:</b> {scene.description.substring(0, 70)}...</div>
                            )) : <p className="text-sm text-gray-500">No scenes added yet.</p>}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="border-t pt-6 space-y-4">
                        <h3 className="font-semibold text-lg">Add New Scene</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Start Time (e.g., 01:25:00)" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            <input type="text" placeholder="End Time (e.g., 01:32:00)" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                        <textarea placeholder="Scene Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}></textarea>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button type="button" onClick={() => startFrameRef.current.click()} className="border-2 border-dashed p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-500">
                                <ImagePlus size={24} className="mb-2"/> {startFrame ? startFrame.name : 'Upload Start Frame'}
                            </button>
                            <input type="file" ref={startFrameRef} onChange={(e) => handleFileChange(e, setStartFrame)} className="hidden" accept="image/*" required/>
                            <button type="button" onClick={() => endFrameRef.current.click()} className="border-2 border-dashed p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-500">
                                <ImagePlus size={24} className="mb-2"/> {endFrame ? endFrame.name : 'Upload End Frame'}
                            </button>
                            <input type="file" ref={endFrameRef} onChange={(e) => handleFileChange(e, setEndFrame)} className="hidden" accept="image/*" required/>
                        </div>
                         {error && <p className="text-sm text-red-600 text-center w-full">{error}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50">
                             {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>}
                             {isSubmitting ? 'Adding Scene...' : 'Add Scene'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ObservationPost = ({ observation, onLike, onBookmark, user }) => {
    const isLiked = user && observation.likes.includes(user._id);
    const isBookmarked = user && user.bookmarks?.includes(observation._id);

    const handleShare = () => {
        const url = `${window.location.origin}/movie/${observation.movieId}`;
        navigator.clipboard.writeText(url)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
                <UserCircle className="text-gray-400 flex-shrink-0" size={40} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{observation.user?.username || 'User'}</span>
                        <span className="text-gray-500 text-sm font-light">• {formatDistanceToNow(new Date(observation.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="text-gray-800 mb-3 leading-relaxed">{observation.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {observation.categories.map((category) => (
                            <span key={category} className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded-full">{category}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-5 text-gray-500">
                        <button onClick={() => onLike(observation._id)} className={`flex items-center gap-1.5 hover:text-teal-600 transition-colors group ${isLiked ? 'text-teal-600' : ''}`}>
                            <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
                            <span className="text-sm font-medium">{observation.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => onBookmark(observation._id)} className={`hover:text-teal-600 transition-colors group ml-auto ${isBookmarked ? 'text-yellow-500' : ''}`}>
                            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={handleShare} className="hover:text-teal-600 transition-colors group"><Share2 size={16} /></button>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={20} /></button>
            </div>
        </div>
    );
};

const AnalysisPost = ({ analysis, user, onLike, onBookmark }) => {
    const isLiked = user && analysis.likes.includes(user._id);
    const isBookmarked = user && user.analysisBookmarks?.includes(analysis._id);

    const handleShare = () => {
        const url = `${window.location.origin}/movie/${analysis.movieId}`;
        navigator.clipboard.writeText(url)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error('Failed to copy text: ', err));
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // THIS IS THE CORRECT URL CONSTRUCTION
    // We take the unique public ID from the database and append .pdf to create a valid link.
    const cloudName = 'dh2izwsin'; // Your Cloudinary cloud name
    const downloadUrl = analysis.filePublicId 
        ? `https://res.cloudinary.com/${cloudName}/raw/upload/${analysis.filePublicId}`
        : '#';
    
    const suggestedFilename = `${analysis.title.replace(/\s+/g, '_')}.pdf`;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
                <UserCircle className="text-gray-400 flex-shrink-0" size={40} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{analysis.user?.username || 'User'}</span>
                        <span className="text-gray-500 text-sm font-light">• {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{analysis.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{analysis.description}</p>
                    
                    <a href={downloadUrl} download={suggestedFilename} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3 border mb-4 text-sm w-full sm:w-auto">
                        <FileText size={24} className="text-teal-600 flex-shrink-0" />
                        <div className='min-w-0'>
                            <span className="font-medium text-gray-800 truncate block">{analysis.title}.pdf</span>
                            <span className="text-gray-500 block">{formatBytes(analysis.fileSize)}</span>
                        </div>
                        <Download size={16} className="ml-auto text-gray-500 flex-shrink-0" />
                    </a>

                    <div className="flex items-center gap-5 text-gray-500 mt-2">
                        <button onClick={() => onLike(analysis._id)} className={`flex items-center gap-1.5 hover:text-teal-600 transition-colors group ${isLiked ? 'text-teal-600' : ''}`}>
                            <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
                            <span className="text-sm font-medium">{analysis.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => onBookmark(analysis._id)} className={`hover:text-teal-600 transition-colors group ml-auto ${isBookmarked ? 'text-yellow-500' : ''}`}>
                             <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={handleShare} className="hover:text-teal-600 transition-colors group"><Share2 size={16} /></button>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={20} /></button>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function MovieObservationsPage() {
    const { id: movieId } = useParams();
    const { user, loading: authLoading, setUser } = useAuth();
    
    const [movieDetails, setMovieDetails] = useState(null);
    const [scenes, setScenes] = useState([]);
    const [observations, setObservations] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showObservationModal, setShowObservationModal] = useState(false);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showManageScenesModal, setShowManageScenesModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("observations");
    const [selectedScene, setSelectedScene] = useState(1);

    useEffect(() => {
        if (!movieId) return;
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [details, scenesData, obs, anls] = await Promise.all([
                    axios.get(`/movies/${movieId}`),
                    axios.get(`/scenes/${movieId}`),
                    axios.get(`/observations/${movieId}`),
                    axios.get(`/analyses/${movieId}`),
                ]);
                setMovieDetails(details.data);
                const sortedScenes = scenesData.data.sort((a, b) => a.sceneNumber - b.sceneNumber);
                setScenes(sortedScenes);
                if (sortedScenes.length > 0) {
                    setSelectedScene(sortedScenes[0].sceneNumber);
                }
                setObservations(obs.data);
                setAnalyses(anls.data);
            } catch(err) { 
                console.error("Failed to fetch page data:", err);
                setError("Could not load data for this film. Please try again later.");
            } finally { 
                setLoading(false);
            }
        };
        fetchAllData();
    }, [movieId]);

    const handleObservationAdded = useCallback((newObs) => setObservations(p => [newObs, ...p].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))), []);
    const handleAnalysisAdded = useCallback((newAnl) => setAnalyses(p => [newAnl, ...p].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))), []);
    const handleSceneAdded = useCallback((newScene) => setScenes(p => [...p, newScene].sort((a,b) => a.sceneNumber - b.sceneNumber)), []);

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
            const { data } = await axios.put(`/auth/bookmarks/${observationId}`);
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
            const { data } = await axios.put(`/auth/bookmarks/analysis/${analysisId}`);
            setUser({ ...user, analysisBookmarks: data.analysisBookmarks });
        } catch (err) {
            console.error("Failed to bookmark analysis:", err);
        }
    };
    
    const currentSceneData = scenes.find(s => s.sceneNumber === selectedScene) || {};
    const filteredObservations = observations.filter(obs => obs.sceneId == selectedScene);

    if (loading) {
        return <><Header /><div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-teal-600" size={48} /></div></>;
    }
    if (error) {
        return <><Header /><div className="text-center pt-32"><h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2><p className="text-gray-600 mt-2">{error}</p></div></>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="flex pt-16">
                <aside className="w-80 bg-white border-r border-gray-200 flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] z-10 hidden lg:flex">
                    <nav className="flex-grow p-4 overflow-y-auto">
                        <h3 className="px-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Scenes</h3>
                        {scenes.length > 0 ? (
                            <ul>
                                {scenes.map(({ sceneNumber, description }) => (
                                    <li key={sceneNumber}>
                                        <button onClick={() => setSelectedScene(sceneNumber)} className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm flex flex-col ${selectedScene === sceneNumber ? "bg-teal-600 text-white shadow-sm" : "hover:bg-gray-100 text-gray-700"}`}>
                                            <span className="font-semibold">Scene {sceneNumber}</span>
                                            <span className={`transition-opacity ${selectedScene === sceneNumber ? "opacity-70" : "opacity-100"}`}>{description.substring(0, 40)}...</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="px-3 text-sm text-gray-500">No scenes have been added for this movie.</p>}
                    </nav>
                    <div className="p-4 border-t border-gray-200 space-y-2">
                         {!authLoading && user?.role === 'contributor' && (
                            <button onClick={() => setShowManageScenesModal(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors">
                                <Plus size={16} /> Manage Scenes
                            </button>
                        )}
                        <a href="#" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"><Settings size={16} /> Settings</a>
                    </div>
                </aside>

                <main className="flex-1 lg:ml-80 flex flex-col h-[calc(100vh-4rem)]">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">{movieDetails.title} ({movieDetails.release_date?.substring(0,4)})</h1>
                                <p className="text-sm text-gray-500">Runtime: {movieDetails.runtime} minutes</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div className="flex items-center bg-gray-200 p-1 rounded-lg">
                                    <button onClick={() => setCurrentPage("observations")} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${currentPage === "observations" ? "bg-white shadow-sm" : "text-gray-600"}`}><Film size={16} className="inline mr-2"/>Observations</button>
                                    <button onClick={() => setCurrentPage("analysis")} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${currentPage === "analysis" ? "bg-white shadow-sm" : "text-gray-600"}`}><FileText size={16} className="inline mr-2"/>Analysis</button>
                                </div>
                                {!authLoading && user && (
                                    <>
                                        {currentPage === "observations" && scenes.length > 0 && <button onClick={() => setShowObservationModal(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-medium"><Plus size={16}/> New Observation</button>}
                                        {currentPage === "analysis" && <button onClick={() => setShowAnalysisModal(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-medium"><Upload size={16}/> Upload Analysis</button>}
                                    </>
                                )}
                            </div>

                            {currentPage === "observations" ? (
                                <div>
                                    {scenes.length > 0 ? (
                                        <>
                                            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Scene {selectedScene}: Context</h2>
                                                <p className="text-gray-600 text-sm mb-4">{currentSceneData.description}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs font-semibold text-gray-500">START • {currentSceneData.startTime}</span>
                                                        <img src={currentSceneData.startFrameUrl} alt={`Scene ${selectedScene} Start`} className="mt-1 w-full h-40 object-cover rounded-md border"/>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-gray-500">END • {currentSceneData.endTime}</span>
                                                        <img src={currentSceneData.endFrameUrl} alt={`Scene ${selectedScene} End`} className="mt-1 w-full h-40 object-cover rounded-md border"/>
                                                    </div>
                                                </div>
                                            </div>
                                            {filteredObservations.length > 0 ? filteredObservations.map(obs => <ObservationPost key={obs._id} observation={obs} user={user} onLike={handleLikeObservation} onBookmark={handleBookmarkObservation} />) : <div className="text-center text-gray-500 py-12"><p>No observations for this scene yet. Be the first!</p></div>}
                                        </>
                                    ) : (
                                       <div className="text-center text-gray-500 py-12"><p>A contributor needs to add scenes before observations can be made.</p></div> 
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {analyses.length > 0 ? analyses.map(anl => <AnalysisPost key={anl._id} analysis={anl} user={user} onLike={handleLikeAnalysis} onBookmark={handleBookmarkAnalysis} />) : <div className="text-center text-gray-500 py-12"><p>No analysis has been uploaded for this movie yet.</p></div>}
                                </div>
                            )}
                        </div>
                   </div>
                </main>
            </div>
            
            <NewObservationModal isOpen={showObservationModal} onClose={() => setShowObservationModal(false)} movieId={movieId} selectedScene={selectedScene} sceneData={currentSceneData} onObservationAdded={handleObservationAdded}/>
            <UploadAnalysisModal isOpen={showAnalysisModal} onClose={() => setShowAnalysisModal(false)} movieId={movieId} onAnalysisAdded={handleAnalysisAdded}/>
            <ManageScenesModal isOpen={showManageScenesModal} onClose={() => setShowManageScenesModal(false)} movieId={movieId} scenes={scenes} onSceneAdded={handleSceneAdded}/>
        </div>
    );
}

