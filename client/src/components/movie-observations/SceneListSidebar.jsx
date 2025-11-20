import React from 'react';
import { Plus, GitPullRequestCreate } from 'lucide-react';

const SceneListSidebar = ({ scenes, selectedScene, onSelectScene, user, authLoading, onManageScenesClick, onSuggestNewSceneClick }) => {
    return (
        <aside className="w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] z-10 hidden lg:flex transition-colors">
            <nav className="flex-grow p-4 overflow-y-auto">
                <h3 className="px-2 text-sm font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">Scenes</h3>
                {scenes.length > 0 ? (
                    <ul>
                        {scenes.map(({ sceneNumber, description }) => (
                            <li key={sceneNumber}>
                                <button
                                    onClick={() => onSelectScene(sceneNumber)}
                                    className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-sm flex flex-col ${
                                        selectedScene === sceneNumber 
                                        ? "bg-teal-600 text-white shadow-sm" 
                                        : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                                    }`}
                                >
                                    <span className="font-semibold">Scene {sceneNumber}</span>
                                    <span className={`transition-opacity ${selectedScene === sceneNumber ? "opacity-70" : "opacity-100"}`}>{description.substring(0, 40)}...</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="px-3 text-sm text-gray-500 dark:text-slate-400">No scenes have been added for this movie.</p>
                )}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
                {!authLoading && user && (
                    user.role === 'admin' ? (
                        <button onClick={onManageScenesClick} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors">
                            <Plus size={16} /> Add Scene
                        </button>
                    ) : (
                        <button onClick={onSuggestNewSceneClick} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                            <GitPullRequestCreate size={16} /> Suggest New Scene
                        </button>
                    )
                )}
            </div>
        </aside>
    );
};

export default SceneListSidebar;
