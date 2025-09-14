import React from 'react';
import { ThumbsUp, Bookmark, Share2, MoreHorizontal, UserCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ObservationPost = ({ observation, onLike, onBookmark, user }) => {
    const isLiked = user && observation.likes.includes(user._id);
    const isBookmarked = user && user.bookmarks?.includes(observation._id);

    const handleShare = () => {
        const url = `${window.location.origin}/movie/${observation.movieId}`;
        navigator.clipboard.writeText(url)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-5 mb-4 transition-colors shadow-sm hover:shadow-md">
            <div className="flex items-start gap-4">
                <UserCircle className="text-gray-400 dark:text-slate-500 flex-shrink-0" size={40} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-slate-100">{observation.user?.username || 'User'}</span>
                        <span className="text-gray-500 dark:text-slate-400 text-sm font-light">• {formatDistanceToNow(new Date(observation.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="text-gray-800 dark:text-slate-300 mb-3 leading-relaxed">{observation.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {observation.categories.map((category) => (
                            <span key={category} className="bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-medium px-2.5 py-1 rounded-full">{category}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-5 text-gray-500 dark:text-slate-400">
                        <button onClick={() => onLike(observation._id)} className={`flex items-center gap-1.5 hover:text-teal-600 transition-colors group ${isLiked ? 'text-teal-600' : ''}`}>
                            <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
                            <span className="text-sm font-medium">{observation.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => onBookmark(observation._id)} className={`hover:text-teal-600 transition-colors group ml-auto ${isBookmarked ? 'text-yellow-500' : ''}`}>
                            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={handleShare} className="hover:text-teal-600 transition-colors group"><Share2 size={16} /></button>
                    </div>
                </div>
                <button className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"><MoreHorizontal size={20} /></button>
            </div>
        </div>
    );
};

export default ObservationPost;