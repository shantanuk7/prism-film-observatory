// client/src/components/movie-observations/SceneDetail.jsx

import { useState } from 'react';
import { Share2, Check, Edit, GitPullRequestCreate, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SceneFrame from './SceneFrame';

const SceneDetail = ({ sceneData, selectedScene, movieDetails, onSuggestEdit, onEditScene, onDeleteScene }) => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

    const handleCite = () => {
        const url = window.location.href;
        const citation = `${url}\nScene ${selectedScene} (${sceneData.startTime} - ${sceneData.endTime}) from ${movieDetails.title} (${movieDetails.release_date?.substring(0,4)}).`;
        navigator.clipboard.writeText(citation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6 transition-colors">
            <div className="flex justify-between items-start mb-2 gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Scene {selectedScene}: Context</h2>
                <div className="flex items-center flex-shrink-0 gap-2">
                    {user && (
                        user.role === 'admin' ? (
                            <>
                                <button onClick={onEditScene} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                                    <Edit size={14} /> Edit
                                </button>
                                <button onClick={onDeleteScene} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-full transition-colors">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </>
                        ) : (
                            <button onClick={() => onSuggestEdit('EDIT_SCENE')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                                <GitPullRequestCreate size={14} /> Suggest Edit
                            </button>
                        )
                    )}
                    <button onClick={handleCite} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                        {copied ? <Check size={14} className="text-green-500"/> : <Share2 size={14} />}
                        {copied ? 'Copied!' : 'Cite'}
                    </button>
                </div>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">{sceneData.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SceneFrame
                    label="START"
                    timestamp={sceneData.startTime}
                    imageUrl={sceneData.startFrameUrl}
                    alt={`Scene ${selectedScene} Start`}
                />
                <SceneFrame
                    label="END"
                    timestamp={sceneData.endTime}
                    imageUrl={sceneData.endFrameUrl}
                    alt={`Scene ${selectedScene} End`}
                />
            </div>
        </div>
    );
};

export default SceneDetail;