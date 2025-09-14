import { ThumbsUp, Bookmark } from 'lucide-react'

export default function AnalysisPost ({ analysis, user, onLike, onBookmark }) {
    const isLiked = user && analysis.likes.includes(user._id);
    const isBookmarked = user && user.analysisBookmarks?.includes(analysis._id);

    const handleShare = () => {
        const url = `${window.location.origin}/movie/${analysis.movieId}`;
        navigator.clipboard.writeText(url)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error('Failed to copy text: ', err));
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // THIS IS THE CORRECT URL CONSTRUCTION
    // We take the unique public ID from the database and append .pdf to create a valid link.
    const cloudName = 'dh2izwsin'; // Your Cloudinary cloud name
    const downloadUrl = analysis.filePublicId 
        ? `https://res.cloudinary.com/${cloudName}/raw/upload/${analysis.filePublicId}`
        : '#';
    
    const suggestedFilename = `${analysis.title.replace(/\s+/g, '_')}.pdf`;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
                <UserCircle className="text-gray-400 flex-shrink-0" size={40} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{analysis.user?.username || 'User'}</span>
                        <span className="text-gray-500 text-sm font-light">• {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{analysis.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{analysis.description}</p>
                    
                    <a href={downloadUrl} download={suggestedFilename} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3 border mb-4 text-sm w-full sm:w-auto">
                        <FileText size={24} className="text-teal-600 flex-shrink-0" />
                        <div className='min-w-0'>
                            <span className="font-medium text-gray-800 truncate block">{analysis.title}.pdf</span>
                            <span className="text-gray-500 block">{formatBytes(analysis.fileSize)}</span>
                        </div>
                        <Download size={16} className="ml-auto text-gray-500 flex-shrink-0" />
                    </a>

                    <div className="flex items-center gap-5 text-gray-500 mt-2">
                        <button onClick={() => onLike(analysis._id)} className={`flex items-center gap-1.5 hover:text-teal-600 transition-colors group ${isLiked ? 'text-teal-600' : ''}`}>
                            <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
                            <span className="text-sm font-medium">{analysis.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => onBookmark(analysis._id)} className={`hover:text-teal-600 transition-colors group ml-auto ${isBookmarked ? 'text-yellow-500' : ''}`}>
                             <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={handleShare} className="hover:text-teal-600 transition-colors group"><Share2 size={16} /></button>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={20} /></button>
            </div>
        </div>
    );
};