import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../api/axios';
import { Plus, X, Loader2, ImagePlus } from 'lucide-react';

const ManageScenesModal = ({ isOpen, onClose, movieId, scenes, onSceneAdded }) => {
    // -- START: Add source fields to state --
    const [formData, setFormData] = useState({ 
        description: '', 
        startTime: '', 
        endTime: '',
        timestampSourceName: '',
        timestampSourceUrl: ''
    });
    // -- END: Add source fields to state --

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
        // -- Add validation for source name if it's the first scene --
        if (!startFrame || !endFrame || isSubmitting || (scenes.length === 0 && !formData.timestampSourceName)) return;

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
        
        // -- START: Append source data to the form submission --
        if (scenes.length === 0) {
            submissionData.append('timestampSourceName', formData.timestampSourceName);
            submissionData.append('timestampSourceUrl', formData.timestampSourceUrl);
        }
        // -- END: Append source data --

        try {
            const res = await axios.post('/scenes', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSceneAdded(res.data);
            // -- Reset all form fields --
            setFormData({ description: '', startTime: '', endTime: '', timestampSourceName: '', timestampSourceUrl: '' });
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
            setFormData({ description: '', startTime: '', endTime: '', timestampSourceName: '', timestampSourceUrl: '' });
            setStartFrame(null);
            setEndFrame(null);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="border-b dark:border-slate-700 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold dark:text-slate-100">Manage Scenes</h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200"><X size={24} /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        {/* ... Existing Scenes List ... */}
                    </div>
                    <form onSubmit={handleSubmit} className="border-t dark:border-slate-700 pt-6 space-y-4">
                        <h3 className="font-semibold text-lg dark:text-slate-200">Add New Scene</h3>

                        {/* -- START: Conditional Source Inputs -- */}
                        {scenes.length === 0 && (
                            <div className="bg-teal-50 dark:bg-teal-500/10 p-4 rounded-lg border border-teal-200 dark:border-teal-500/20">
                                <label className="block text-sm font-medium text-teal-800 dark:text-teal-300 mb-2">
                                    Timestamp Source (e.g., "Netflix US Stream", "4K Blu-Ray")
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Source Name *" value={formData.timestampSourceName} onChange={e => setFormData({...formData, timestampSourceName: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400"/>
                                    <input type="text" placeholder="Source URL (Optional)" value={formData.timestampSourceUrl} onChange={e => setFormData({...formData, timestampSourceUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400"/>
                                </div>
                            </div>
                        )}
                        {/* -- END: Conditional Source Inputs -- */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* ... Time Inputs ... */}
                        </div>
                        <textarea /* ... Scene Description ... */ ></textarea>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* ... Frame Upload Buttons ... */}
                        </div>
                        {error && <p className="text-sm text-red-600 text-center w-full">{error}</p>}
                        <button type="submit" /* ... Submit Button ... */ >
                             {/* ... */}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageScenesModal;