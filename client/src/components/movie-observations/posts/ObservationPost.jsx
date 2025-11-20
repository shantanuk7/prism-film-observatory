import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, Bookmark, MoreHorizontal, UserCircle, Send, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ObservationPost = ({ observation, onLike, onBookmark, onReply, user }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const isLiked = user && observation.likes.includes(user._id);
    const isBookmarked = user && user.bookmarks?.includes(observation._id);
    
    const avatarUrl = observation.user?.avatarUrl;
    const username = observation.user?.username || 'User';

    const handleShare = () => {
        // Mock share functionality
        navigator.clipboard.writeText(`${window.location.origin}/post/${observation._id}`)
            .then(() => alert("Link copied!"))
            .catch(err => console.error(err));
    };

    const handleSubmitReply = () => {
        if (onReply && replyText.trim()) {
            onReply(observation._id, replyText);
            setReplyText('');
            setIsReplying(false);
        }
    };

    return (
        <div className="flex gap-3 mb-4 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-900/40 transition-colors duration-200 group">
            
            {/* --- LEFT RAIL: Avatar & Thread Line --- */}
            <div className="flex flex-col items-center flex-shrink-0 w-10">
                <div className="cursor-pointer">
                    {avatarUrl ? (
                        <img 
                            src={avatarUrl} 
                            alt={username}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                        />
                    ) : (
                        <UserCircle className="text-gray-300 dark:text-slate-600" size={40} />
                    )}
                </div>
                {/* Thread Line: Visual hierarchy cue */}
                <div className={`w-0.5 flex-grow mt-2 rounded-full transition-colors duration-300 
                    ${isReplying ? 'bg-gray-200 dark:bg-slate-700' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-slate-800'}`} 
                />
            </div>

            {/* --- RIGHT RAIL: Main Content --- */}
            <div className="flex-1 min-w-0">
                
                {/* Header */}
                <div className="flex items-center gap-2 mb-1.5 text-xs sm:text-sm">
                    <span className="font-bold text-gray-900 dark:text-slate-100 hover:underline cursor-pointer">
                        {username}
                    </span>
                    <span className="text-gray-500 dark:text-slate-500">
                        • {formatDistanceToNow(new Date(observation.createdAt), { addSuffix: true })}
                    </span>
                </div>

                {/* Body Text */}
                <div className="mb-3">
                    <p className="text-gray-900 dark:text-slate-200 leading-relaxed text-[15px] selection:bg-teal-100 dark:selection:bg-teal-900">
                        {observation.content}
                    </p>
                </div>

                {/* Categories / Tags (Pill Style Restored) */}
                {observation.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {observation.categories.map((category) => (
                            <span 
                                key={category} 
                                className="bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20 text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Bar - Buttons with Labels & Hover Backgrounds */}
                <div className="flex items-center flex-wrap gap-1 text-gray-500 dark:text-slate-400 text-xs sm:text-sm font-semibold select-none -ml-2">
                    
                    {/* Like Button */}
                    <button 
                        onClick={() => onLike(observation._id)} 
                        className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer ${isLiked ? 'text-teal-600' : ''}`}
                    >
                        <ThumbsUp size={18} className={isLiked ? 'fill-current' : ''} />
                        <span>{observation.likes?.length || 0}</span>
                    </button>

                    {/* Reply Button */}
                    <button 
                        onClick={() => setIsReplying(!isReplying)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer ${isReplying ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-200' : ''}`}
                    >
                        <MessageSquare size={18} />
                        <span>Reply</span>
                    </button>

                    {/* Bookmark/Save Button */}
                    <button 
                        onClick={() => onBookmark(observation._id)} 
                        className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer ${isBookmarked ? 'text-yellow-500' : ''}`}
                    >
                        <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                        <span>Save</span>
                    </button>

                    {/* Share Button */}
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <Share2 size={18} />
                        <span>Share</span>
                    </button>

                    {/* More Options (Grouped with others) */}
                    <button className="flex items-center px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                {/* --- REPLY INPUT --- */}
                {isReplying && (
                    <div className="mt-3 pr-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="relative group/input">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Replying to ${username}...`}
                                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[100px] resize-y text-gray-900 dark:text-slate-100 placeholder-gray-400 block shadow-sm"
                                autoFocus
                            />
                            
                            <div className="flex justify-end gap-2 mt-2">
                                <button 
                                    onClick={() => setIsReplying(false)}
                                    className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSubmitReply}
                                    disabled={!replyText.trim()}
                                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                >
                                    <Send size={14} /> Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObservationPost;