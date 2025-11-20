import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Plus, X, Loader2 } from 'lucide-react';
import TimestampSelector from '../TimestampSelector';
import TimeScrubber from '../../ui/TimeScrubber';

const NewObservationModal = ({ isOpen, onClose, movieId, selectedScene, sceneData, onObservationAdded }) => {
  const [formData, setFormData] = useState({ content: '', categories: [], timestamp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
      "Cinematography",
      "Editing",
      "Sound & Music",
      "Symbolism",
      "Foreshadowing",
      "Character Arc",
      "Dialogue",
      "Pacing",
      "World-Building",
      "Costume & Set Design",
      "Visual Effects",
      "Performance / Acting",
      "Other"
  ];
  
  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || !formData.content.trim() || formData.categories.length === 0) return;
    setIsSubmitting(true);
    setError('');
    try {
      const payload = { ...formData, movieId, sceneId: String(selectedScene) };
      const res = await axios.post('/observations', payload);
      onObservationAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post observation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({ content: '', categories: [], timestamp: '' });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const currentScene = sceneData || {};

  // Default bounds if scene data is missing
  const sceneStart = currentScene.startTime || "00:00:00";
  const sceneEnd = currentScene.endTime || "00:10:00";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 dark:border-slate-700 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">New Observation</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">Scene {selectedScene} • {currentScene.startTime} - {currentScene.endTime}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <h3 className="font-medium text-gray-900 dark:text-slate-200 mb-2">Scene Context</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300">{currentScene.description}</p>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Timestamp (optional)</label>
                <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg border border-gray-100 dark:border-slate-600/50">
                <TimeScrubber 
                    label="Timeline Timestamp"
                    value={formData.timestamp || sceneStart} // Default to start if empty
                    onChange={(val) => setFormData(prev => ({ ...prev, timestamp: val }))}
                    minTime={sceneStart}
                    maxTime={sceneEnd}
                    helperText="Slide to pinpoint the exact moment within this scene."
                />
                </div>

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Your Observation *</label>
                <textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} placeholder="Share your observation..." rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Categories (select up to 3)</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button key={category} type="button" onClick={() => handleCategoryToggle(category)} disabled={!formData.categories.includes(category) && formData.categories.length >= 3} className={`px-3 py-1.5 text-sm rounded-full border transition-all ${formData.categories.includes(category) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:border-teal-500 disabled:opacity-50'}`}>
                            {category}
                        </button>
                    ))}
                </div>
              </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800/50 flex flex-col items-end gap-3">
          {error && <p className="text-sm text-red-600 w-full text-left">{error}</p>}
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-md hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={isSubmitting || !formData.content.trim() || formData.categories.length === 0} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              {isSubmitting ? 'Posting...' : 'Post Observation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewObservationModal;
