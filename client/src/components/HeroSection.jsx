import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <div className="relative h-80 md:h-96 bg-gray-900 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"
        alt="Cinema background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Deconstruct Your Favorite Films
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300">
          Join a community of film enthusiasts in scene-by-scene analysis and in-depth discussion.
        </p>
        <Link
          to="/movies"
          className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
        >
          Explore Films
        </Link>
      </div>
    </div>
  )
}
