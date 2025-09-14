import React from 'react';

const SceneDetail = ({ sceneData, selectedScene }) => {
    if (!sceneData || !sceneData.description) {
        return (
            <div className="text-center text-gray-500 dark:text-slate-400 py-12">
                <p>A contributor needs to add scenes before observations can be made.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6 transition-colors">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Scene {selectedScene}: Context</h2>
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