import React from 'react';
import AnalysisPost from './posts/AnalysisPost';

const AnalysisFeed = ({ analyses, user, onLike, onBookmark }) => {
    if (analyses.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-slate-400 py-12">
                <p>No analysis has been uploaded for this movie yet.</p>
            </div>
        );
    }

    return (
        <div>
            {analyses.map(anl => (
                <AnalysisPost
                    key={anl._id}
                    analysis={anl}
                    user={user}
                    onLike={onLike}
                    onBookmark={onBookmark}
                />
            ))}
        </div>
    );
};

export default AnalysisFeed;