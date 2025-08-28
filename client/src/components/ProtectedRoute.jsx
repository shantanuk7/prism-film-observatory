import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/observer/login" />
  return children
}

// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-4xl font-bold mb-6">Prism</h1>
      <input type="text" placeholder="Search movies..." className="border rounded px-4 py-2 w-96" />
    </div>
  )
}