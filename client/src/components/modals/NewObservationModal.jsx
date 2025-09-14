export default function NewObservationModal({ onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
          <h2 className="text-xl font-bold mb-4">Add New Observation</h2>
          <form onSubmit={onSubmit}>
            <textarea
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Write your observation..."
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300">
                Cancel
              </button>
              <button type="submit"
                className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
