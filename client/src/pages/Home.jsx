export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-4xl font-bold mb-6">Prism</h1>
      <input type="text" placeholder="Search movies..." className="border rounded px-4 py-2 w-96" />
    </div>
  )
}