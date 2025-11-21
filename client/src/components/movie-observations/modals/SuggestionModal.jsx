import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../api/axios';
import { Plus, X, Loader2, ImagePlus, AlertCircle, ChevronLeft, ChevronRight, Check, Clock, AlertTriangle } from 'lucide-react';
import TimelineVisualizer from '../../ui/TimelineVisualizer';
import { checkOverlap, secondsToTime, timeToSeconds } from '../../../utils/timeUtils';

const SuggestionModal = ({ isOpen, onClose, movieId, suggestionType, sceneToEdit, scenes, movieDuration = "03:00:00" }) => {
    const [formData, setFormData] = useState({ description: '', startTime: '', endTime: '', notes: '' });
    const [startFrame, setStartFrame] = useState(null);
    const [endFrame, setEndFrame] = useState(null);
    
    // validationMsg can be: { type: 'error' | 'success' | 'warning', text: string }
    const [validationMsg, setValidationMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');
    
    const startFrameRef = useRef(null);
    const endFrameRef = useRef(null);   

    // 1. Reset State on Open
    useEffect(() => {
        if (isOpen) {
            if (suggestionType === 'EDIT_SCENE' && sceneToEdit) {
                setFormData({
                    description: sceneToEdit.description || '',
                    startTime: sceneToEdit.startTime || '',
                    endTime: sceneToEdit.endTime || '',
                    notes: ''
                });
            } else {
                setFormData({ description: '', startTime: '', endTime: '', notes: '' });
            }
            setStartFrame(null);
            setEndFrame(null);
            setApiError('');
            setValidationMsg(null);
        }
    }, [isOpen, suggestionType, sceneToEdit]);

    // 2. Real-time Validation (Overlap + Duration)
    useEffect(() => {
        if (!isOpen) return;

        // Only validate if we have enough characters to resemble a timestamp
        if (formData.startTime.length >= 5 && formData.endTime.length >= 5) {
            
            const startSec = timeToSeconds(formData.startTime);
            const endSec = timeToSeconds(formData.endTime);
            const duration = endSec - startSec;

            // A. Check Overlap (Critical Error)
            const overlapResult = checkOverlap(
                formData.startTime, 
                formData.endTime, 
                suggestionType === 'EDIT_SCENE' ? sceneToEdit?._id : null, 
                scenes
            );

            if (overlapResult.isOverlap) {
                setValidationMsg({ type: 'error', text: overlapResult.message });
                return;
            } 

            // B. Check Duration (Warning) - 30 mins = 1800 seconds
            if (duration > 1800) {
                setValidationMsg({ 
                    type: 'warning', 
                    text: `Scene duration is ${Math.floor(duration/60)} mins. Is this correct?` 
                });
                return;
            }

            // C. Clear messages if no issues, unless we just showed a success message
            if (validationMsg?.type === 'error' || validationMsg?.type === 'warning') {
                setValidationMsg(null);
            }
        }
    }, [formData.startTime, formData.endTime, scenes, sceneToEdit, suggestionType, isOpen]);

    const handleGapSelect = (start, end) => {
        setFormData(prev => ({ ...prev, startTime: start, endTime: end }));
        setValidationMsg({ type: 'success', text: "Timeline gap auto-filled" });
        // Clear success message quickly
        setTimeout(() => setValidationMsg(null), 2000);
    };

    const nudgeTime = (field, amount) => {
        const currentSeconds = timeToSeconds(formData[field]);
        const newSeconds = Math.max(0, currentSeconds + amount);
        setFormData(prev => ({ ...prev, [field]: secondsToTime(newSeconds) }));
    };

    const handleFileChange = (e, setter) => setter(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // BLOCK on Error, ALLOW on Warning
        if (validationMsg?.type === 'error') return;

        const hasTextChanged = (suggestionType === 'EDIT_SCENE') 
            ? formData.description !== sceneToEdit.description || formData.startTime !== sceneToEdit.startTime || formData.endTime !== sceneToEdit.endTime
            : formData.description || formData.startTime || formData.endTime;
        
        const hasFilesChanged = startFrame || endFrame;
        
        if (!hasTextChanged && !hasFilesChanged) {
            setApiError('You must suggest at least one change.');
            return;
        }

        setIsSubmitting(true);
        setApiError('');

        const submissionData = new FormData();
        submissionData.append('movieId', movieId);
        submissionData.append('suggestionType', suggestionType);
        
        if (suggestionType === 'EDIT_SCENE') {
            submissionData.append('sceneToEdit', sceneToEdit._id);
        } else {
            const newSceneNumber = scenes.length > 0 ? Math.max(...scenes.map(s => s.sceneNumber)) + 1 : 1;
            submissionData.append('sceneNumber', newSceneNumber);
        }
        
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (startFrame) submissionData.append('startFrame', startFrame);
        if (endFrame) submissionData.append('endFrame', endFrame);

        try {
            // Simulate API delay for UI demo
            await new Promise(r => setTimeout(r, 800)); 
            // const res = await axios.post('/suggestions', submissionData...); // Uncomment for real API
            
            onClose();
        } catch (err) {
            setApiError(err.response?.data?.message || 'Failed to submit suggestion.');
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;
    
    const title = suggestionType === 'NEW_SCENE' ? 'Suggest New Scene' : `Edit Scene ${sceneToEdit?.sceneNumber}`;

    // Helper for input border colors
    const getInputBorderColor = () => {
        if (validationMsg?.type === 'error') return 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10';
        if (validationMsg?.type === 'warning') return 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10';
        return 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500';
    };

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* 1. TIMELINE SECTION */}
                    <section>
                        <TimelineVisualizer 
                            scenes={scenes} 
                            movieDuration={movieDuration} 
                            onSelectGap={handleGapSelect}
                        />

                        {/* Input Groups */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
                            {['startTime', 'endTime'].map((field) => (
                                <div key={field}>
                                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase mb-2 block">
                                        {field === 'startTime' ? 'Start Time' : 'End Time'}
                                    </label>
                                    
                                    <div className={`flex items-center h-10 rounded-md shadow-sm border transition-colors ${getInputBorderColor()}`}>
                                        <button type="button" onClick={() => nudgeTime(field, -1)} className="h-full px-3 text-gray-400 hover:text-teal-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-l-md transition-colors border-r border-transparent hover:border-gray-200 dark:hover:border-slate-600">
                                            <ChevronLeft size={16} strokeWidth={2.5} />
                                        </button>
                                        
                                        <div className="flex-1 flex items-center justify-center gap-2 h-full">
                                            <Clock size={14} className="text-gray-400" />
                                            <input 
                                                type="text" 
                                                value={formData[field]} 
                                                onChange={e => setFormData({...formData, [field]: e.target.value})} 
                                                className="w-24 text-center font-mono font-medium text-gray-700 dark:text-slate-200 bg-transparent border-none focus:ring-0 p-0 text-sm"
                                                placeholder="00:00:00"
                                            />
                                        </div>

                                        <button type="button" onClick={() => nudgeTime(field, 1)} className="h-full px-3 text-gray-400 hover:text-teal-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-r-md transition-colors border-l border-transparent hover:border-gray-200 dark:hover:border-slate-600">
                                            <ChevronRight size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FIXED HEIGHT STATUS BAR (Prevents scrollbar jumping) */}
                        <div className="h-8 flex items-center">
                            {validationMsg && (
                                <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-top-1 duration-200
                                    ${validationMsg.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : ''}
                                    ${validationMsg.type === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}
                                    ${validationMsg.type === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                                `}>
                                    {validationMsg.type === 'error' && <AlertCircle size={14} />}
                                    {validationMsg.type === 'success' && <Check size={14} />}
                                    {validationMsg.type === 'warning' && <AlertTriangle size={14} />}
                                    {validationMsg.text}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 2. DETAILS SECTION */}
                    <section className="space-y-4 pt-2 border-t border-gray-100 dark:border-slate-800">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-2 mt-4">Description</label>
                            <textarea 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})} 
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none text-sm" 
                                rows={3}
                                placeholder="Describe the key events in this scene..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Image Uploads - Same as before */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Start Frame</label>
                                <button type="button" onClick={() => startFrameRef.current.click()} className="w-full h-24 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-800 transition-all group">
                                    <ImagePlus size={20} className="mb-2 opacity-50 group-hover:opacity-100 transition-opacity"/>
                                    <span className="text-xs truncate max-w-[120px]">{startFrame ? startFrame.name : 'Upload Image'}</span>
                                </button>
                                <input type="file" ref={startFrameRef} onChange={(e) => handleFileChange(e, setStartFrame)} className="hidden" accept="image/*"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">End Frame</label>
                                <button type="button" onClick={() => endFrameRef.current.click()} className="w-full h-24 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-800 transition-all group">
                                    <ImagePlus size={20} className="mb-2 opacity-50 group-hover:opacity-100 transition-opacity"/>
                                    <span className="text-xs truncate max-w-[120px]">{endFrame ? endFrame.name : 'Upload Image'}</span>
                                </button>
                                <input type="file" ref={endFrameRef} onChange={(e) => handleFileChange(e, setEndFrame)} className="hidden" accept="image/*"/>
                            </div>
                        </div>
                    </section>
                    
                    {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}
                </form>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
                     <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors">
                        Cancel
                    </button>
                     <button 
                        onClick={handleSubmit}
                        // Only disable if ERROR. Warnings should still allow submit.
                        disabled={isSubmitting || validationMsg?.type === 'error'} 
                        className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-full shadow-lg transition-all transform active:scale-95
                            ${validationMsg?.type === 'error' ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-900/20'}
                        `}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Check size={16} strokeWidth={2.5} />}
                        {suggestionType === 'NEW_SCENE' ? 'Submit Scene' : 'Save Changes'}
                     </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestionModal;