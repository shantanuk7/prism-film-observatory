export default function SceneList({ scenes }) {
  if (!scenes?.length) {
    return <p className="text-gray-500">No scenes available.</p>
  }

  return (
    <ul className="space-y-2">
      {scenes.map((scene) => (
        <li key={scene.id} className="p-3 bg-gray-100 rounded-md">
          <p className="font-medium">{scene.title}</p>
          <p className="text-sm text-gray-600">
            {scene.startTime} – {scene.endTime}
          </p>
        </li>
      ))}
    </ul>
  )
}
