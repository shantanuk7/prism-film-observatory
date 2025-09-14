import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../api/axios';
import { Plus, X, Loader2, ImagePlus } from 'lucide-react';

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
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="border-b dark:border-slate-700 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold dark:text-slate-100">Manage Scenes</h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200"><X size={24} /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg dark:text-slate-200">Existing Scenes ({scenes.length})</h3>
                        <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                            {scenes.length > 0 ? scenes.map(scene => (
                                <div key={scene._id} className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-md text-sm text-gray-800 dark:text-slate-300"><b>Scene {scene.sceneNumber}:</b> {scene.description.substring(0, 70)}...</div>
                            )) : <p className="text-sm text-gray-500 dark:text-slate-400">No scenes added yet.</p>}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="border-t dark:border-slate-700 pt-6 space-y-4">
                        <h3 className="font-semibold text-lg dark:text-slate-200">Add New Scene</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Start Time (e.g., 01:25:00)" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400"/>
                            <input type="text" placeholder="End Time (e.g., 01:32:00)" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400"/>
                        </div>
                        <textarea placeholder="Scene Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400" rows={3}></textarea>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button type="button" onClick={() => startFrameRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-slate-600 p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 dark:text-slate-400 hover:border-teal-500">
                                <ImagePlus size={24} className="mb-2"/> {startFrame ? startFrame.name : 'Upload Start Frame'}
                            </button>
                            <input type="file" ref={startFrameRef} onChange={(e) => handleFileChange(e, setStartFrame)} className="hidden" accept="image/*" required/>
                            <button type="button" onClick={() => endFrameRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-slate-600 p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 dark:text-slate-400 hover:border-teal-500">
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

export default ManageScenesModal;