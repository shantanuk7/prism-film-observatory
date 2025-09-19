import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../api/axios';
import { Plus, X, Loader2, ImagePlus, Save } from 'lucide-react';

const ManageScenesModal = ({ isOpen, onClose, movieId, scenes, onSceneAdded, isEditing, sceneToEdit }) => {
    const [formData, setFormData] = useState({ description: '', startTime: '', endTime: '' });
    const [startFrame, setStartFrame] = useState(null);
    const [endFrame, setEndFrame] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const startFrameRef = useRef(null);
    const endFrameRef = useRef(null);

    useEffect(() => {
        // Pre-populate form if in edit mode
        if (isOpen && isEditing && sceneToEdit) {
            setFormData({
                description: sceneToEdit.description || '',
                startTime: sceneToEdit.startTime || '',
                endTime: sceneToEdit.endTime || '',
            });
        } else {
            // Reset for create mode
            setFormData({ description: '', startTime: '', endTime: '' });
        }
        // Reset files and messages when modal opens/closes
        setStartFrame(null);
        setEndFrame(null);
        setError('');
    }, [isOpen, isEditing, sceneToEdit]);

    const handleFileChange = (e, setter) => setter(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const submissionData = new FormData();
        submissionData.append('movieId', movieId);
        submissionData.append('description', formData.description);
        submissionData.append('startTime', formData.startTime);
        submissionData.append('endTime', formData.endTime);
        if (startFrame) submissionData.append('startFrame', startFrame);
        if (endFrame) submissionData.append('endFrame', endFrame);

        try {
            if (isEditing) {
                // UPDATE existing scene
                await axios.put(`/scenes/${sceneToEdit._id}`, submissionData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // CREATE new scene
                const newSceneNumber = scenes.length > 0 ? Math.max(...scenes.map(s => s.sceneNumber)) + 1 : 1;
                submissionData.append('sceneNumber', newSceneNumber);
                await axios.post('/scenes', submissionData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSceneAdded(); // A generic callback to refetch scenes
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save scene.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;
    const title = isEditing ? `Edit Scene ${sceneToEdit.sceneNumber}` : 'Add New Scene';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="border-b dark:border-slate-700 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold dark:text-slate-100">{title}</h2>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-gray-600" size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    {/* ... form fields for startTime, endTime, description ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" placeholder="Start Time (e.g., 01:25:00)" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                         <input type="text" placeholder="End Time (e.g., 01:32:00)" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <textarea placeholder="Scene Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" rows={3}></textarea>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <button type="button" onClick={() => startFrameRef.current.click()} className="border-2 border-dashed p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-500 dark:border-slate-600 dark:text-slate-400">
                             <ImagePlus size={24} className="mb-2"/> {startFrame ? startFrame.name : (isEditing ? 'Upload New Start Frame' : 'Upload Start Frame')}
                         </button>
                         <input type="file" ref={startFrameRef} onChange={(e) => handleFileChange(e, setStartFrame)} className="hidden" accept="image/*"/>
                         <button type="button" onClick={() => endFrameRef.current.click()} className="border-2 border-dashed p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-500 dark:border-slate-600 dark:text-slate-400">
                             <ImagePlus size={24} className="mb-2"/> {endFrame ? endFrame.name : (isEditing ? 'Upload New End Frame' : 'Upload End Frame')}
                         </button>
                         <input type="file" ref={endFrameRef} onChange={(e) => handleFileChange(e, setEndFrame)} className="hidden" accept="image/*"/>
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center w-full">{error}</p>}
                    
                    <div className="border-t dark:border-slate-700 pt-4 flex justify-end gap-3">
                         <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-slate-600 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button>
                         <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 disabled:opacity-50">
                             {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : (isEditing ? <Save size={16}/> : <Plus size={16}/>)}
                             {isEditing ? 'Save Changes' : 'Add Scene'}
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageScenesModal;