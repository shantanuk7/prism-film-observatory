import React, { useState } from 'react';
import axios from '../../api/axios';
import { Check, X, Clock, User, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// A small component to show differences clearly
const DiffField = ({ label, original, suggested }) => {
    // Don't show if there's no change and it's not a new scene
    if (original === suggested && original !== undefined) return null; 
    
    return (
        <div className="text-sm mb-2">
            <strong className="font-medium text-gray-700 dark:text-slate-300 block">{label}</strong>
            {original && <p className="text-red-600 dark:text-red-500 line-through opacity-70"> - {original}</p>}
            <p className="text-green-600 dark:text-green-500"> + {suggested || "Not provided"}</p>
        </div>
    );
};

export default function SuggestionCard({ suggestion, onUpdate }) {
    const [loading, setLoading] = useState(false);
    
    const handleAction = async (action) => {
        setLoading(true);
        try {
            await axios.put(`/admin/suggestions/${suggestion._id}/${action}`);
            onUpdate(suggestion._id); // Notify parent to remove this card
        } catch (error) {
            console.error(`Failed to ${action} suggestion`, error);
            alert(`Could not ${action} the suggestion.`);
            setLoading(false); // Reset loading state only on error
        }
    };
    
    const { payload, sceneToEdit, suggestionType, suggestedBy } = suggestion;

    return (
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm transition-shadow hover:shadow-md">
            {/* Card Header */}
            <div className="p-4 border-b dark:border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                    <span className={`text-xs font-bold py-1 px-2 rounded-full ${suggestionType === 'NEW_SCENE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>
                        {suggestionType.replace('_', ' ')}
                    </span>
                    <p className="text-lg font-bold mt-2 text-gray-900 dark:text-slate-100">
                        {suggestionType === 'NEW_SCENE' ? `New Scene Suggestion` : `Edit for Scene ${sceneToEdit?.sceneNumber}`}
                        <span className="text-base font-medium text-gray-500 dark:text-slate-400"> for Movie ID: {suggestion.movieId}</span>
                    </p>
                </div>
                <div className="text-left sm:text-right text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <img src={suggestedBy.avatarUrl} alt="Suggester's avatar" className="w-6 h-6 rounded-full"/>
                        <p>{suggestedBy.username}</p>
                    </div>
                    <p className="flex items-center gap-1 justify-start sm:justify-end mt-1"><Clock size={12}/>{formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}</p>
                </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Details Section */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 dark:text-slate-200 border-b dark:border-slate-600 pb-1">Suggested Details</h4>
                    <DiffField label="Description" original={sceneToEdit?.description} suggested={payload.description} />
                    <DiffField label="Start Time" original={sceneToEdit?.startTime} suggested={payload.startTime} />
                    <DiffField label="End Time" original={sceneToEdit?.endTime} suggested={payload.endTime} />
                </div>
                
                {/* Frames Section */}
                <div className="space-y-2">
                     <h4 className="font-semibold text-gray-800 dark:text-slate-200 border-b dark:border-slate-600 pb-1">Frame Comparison</h4>
                     <div className="grid grid-cols-2 gap-2">
                        {suggestionType === 'EDIT_SCENE' && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">ORIGINAL START</p>
                                <img src={sceneToEdit?.startFrameUrl} alt="Original Start" className="w-full rounded object-cover aspect-video bg-gray-200 dark:bg-slate-700 mt-1"/>
                            </div>
                        )}
                         <div>
                            <p className="text-xs font-medium text-green-600 dark:text-green-400">SUGGESTED START</p>
                            <img src={payload.startFrameUrl} alt="Suggested Start" className="w-full rounded object-cover aspect-video bg-gray-200 dark:bg-slate-700 mt-1"/>
                        </div>
                        {suggestionType === 'EDIT_SCENE' && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">ORIGINAL END</p>
                                <img src={sceneToEdit?.endFrameUrl} alt="Original End" className="w-full rounded object-cover aspect-video bg-gray-200 dark:bg-slate-700 mt-1"/>
                            </div>
                        )}
                         <div>
                            <p className="text-xs font-medium text-green-600 dark:text-green-400">SUGGESTED END</p>
                            <img src={payload.endFrameUrl} alt="Suggested End" className="w-full rounded object-cover aspect-video bg-gray-200 dark:bg-slate-700 mt-1"/>
                        </div>
                     </div>
                </div>
            </div>
            
            {/* Actions Footer */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-lg">
                <button onClick={() => handleAction('reject')} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <X size={16} /> Reject
                </button>
                <button onClick={() => handleAction('approve')} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Check size={16} /> Approve
                </button>
            </div>
        </div>
    );
}