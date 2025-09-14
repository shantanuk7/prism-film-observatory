import { ThumbsUp, Bookmark } from 'lucide-react'

export default function ObservationPost({ observation, onLike, onBookmark }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <p className="text-gray-800">{observation.content}</p>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>By {observation.user?.username || "Anonymous"}</span>
        <div className="flex space-x-4">
          <button onClick={onLike} className="flex items-center gap-1 hover:text-teal-600">
            <ThumbsUp size={16} /> {observation.likes || 0}
          </button>
          <button onClick={onBookmark} className="flex items-center gap-1 hover:text-teal-600">
            <Bookmark size={16} /> {observation.bookmarks || 0}
          </button>
        </div>
      </div>
    </div>
  )
}
