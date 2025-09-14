import React from 'react';
import ObservationPost from './posts/ObservationPost';

const ObservationFeed = ({ observations, user, onLike, onBookmark }) => {
    if (observations.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-slate-400 py-12">
                <p>No observations for this scene yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div>
            {observations.map(obs => (
                <ObservationPost
                    key={obs._id}
                    observation={obs}
                    user={user}
                    onLike={onLike}
                    onBookmark={onBookmark}
                />
            ))}
        </div>
    );
};

export default ObservationFeed;