import React from 'react';
import { Film, FileText, Plus, Upload } from 'lucide-react';

const ContentTabs = ({ currentPage, onSetPage, user, authLoading, scenesExist, onNewObservationClick, onUploadAnalysisClick }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center bg-gray-200 dark:bg-slate-800 p-1 rounded-lg">
                <button 
                    onClick={() => onSetPage("observations")} 
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        currentPage === "observations" 
                        ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-slate-100" 
                        : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    <Film size={16} className="inline mr-2"/>Observations
                </button>
                <button 
                    onClick={() => onSetPage("analysis")} 
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        currentPage === "analysis" 
                        ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-slate-100" 
                        : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    <FileText size={16} className="inline mr-2"/>Analysis
                </button>
            </div>
            {!authLoading && user && (
                <>
                    {currentPage === "observations" && scenesExist && (
                        <button onClick={onNewObservationClick} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-medium">
                            <Plus size={16}/> New Observation
                        </button>
                    )}
                    {currentPage === "analysis" && (
                        <button onClick={onUploadAnalysisClick} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm font-medium">
                            <Upload size={16}/> Upload Analysis
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default ContentTabs;