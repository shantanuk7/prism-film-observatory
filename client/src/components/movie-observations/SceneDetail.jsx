import { useState } from 'react';
import { Share2, Check, Edit, GitPullRequestCreate } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // To check if user is logged in

const SceneDetail = ({ sceneData, selectedScene, movieDetails, onSuggestEdit, onEditScene }) => { // Add onSuggestEdit prop
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

    // ... handleCite function remains the same ...
    const handleCite = () => {
        const url = window.location.href;
        const citation = `${url}\nScene ${selectedScene} (${sceneData.startTime} - ${sceneData.endTime}) from ${movieDetails.title} (${movieDetails.release_date?.substring(0,4)}).`;
        navigator.clipboard.writeText(citation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!sceneData || !sceneData.description) {
        return (
            <div className="text-center text-gray-500 dark:text-slate-400 py-12">
                <p>No scenes have been added for this movie yet.</p>
                {user && <button onClick={() => onSuggestEdit('NEW_SCENE')} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700">Be the first to add one!</button>}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6 transition-colors">
            <div className="flex justify-between items-start mb-2 gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Scene {selectedScene}: Context</h2>
                <div className="flex items-center flex-shrink-0 gap-2">
                    {user && (
                        user.role === 'admin' ? (
                            <button onClick={onEditScene} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                                <Edit size={14} /> Edit Scene
                            </button>
                        ) : (
                            <button onClick={() => onSuggestEdit('EDIT_SCENE')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                                <GitPullRequestCreate size={14} /> Suggest an Edit
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
                <div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">START • {sceneData.startTime}</span>
                    <img src={sceneData.startFrameUrl} alt={`Scene ${selectedScene} Start`} className="mt-1 w-full h-40 object-cover rounded-md border dark:border-slate-600"/>
                </div>
                <div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">END • {sceneData.endTime}</span>
                    <img src={sceneData.endFrameUrl} alt={`Scene ${selectedScene} End`} className="mt-1 w-full h-40 object-cover rounded-md border dark:border-slate-600"/>
                </div>
            </div>
        </div>
    );
};

export default SceneDetail;