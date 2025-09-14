export default function UploadAnalysisModal ({ isOpen, onClose, movieId, onAnalysisAdded }) {
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !file || isSubmitting) return;
        setIsSubmitting(true);
        setError('');
        
        const submissionData = new FormData();
        submissionData.append('movieId', movieId);
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('analysisFile', file);

        try {
            const res = await axios.post('/analyses', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onAnalysisAdded(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload analysis.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            setFormData({ title: "", description: "" });
            setFile(null);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="border-b p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Upload Analysis</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow space-y-4">
                    <input type="text" placeholder="Analysis Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required/>
                    <textarea placeholder="Brief Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-md" rows={4} required></textarea>
                    <button type="button" onClick={() => fileInputRef.current.click()} className="w-full border-2 border-dashed p-4 rounded-md flex flex-col items-center justify-center text-sm text-gray-500 hover:border-teal-500">
                        <Upload size={24} className="mb-2"/> {file ? file.name : 'Upload PDF Analysis'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} className="hidden" accept=".pdf" />
                </div>
                <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting || !formData.title || !formData.description || !file} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                        {isSubmitting ? "Uploading..." : "Upload Analysis"}
                    </button>
                </div>
            </div>
        </div>
    );
};