import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import prismLogo from '../assets/logo.png'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <Link to="/" className="text-2xl font-semibold">
        <img src={prismLogo} width="40px" alt="Prism Logo" className='inline pr-2'/>
        Prism
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <span>{user.username}</span>
          <button onClick={logout} className="px-4 py-2 bg-[#2D98E4] text-white rounded">Logout</button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/observer/login" className="px-4 py-2 bg-[#E93844] text-white rounded">Observer Login</Link>
          <Link to="/contributor/login" className="px-4 py-2 bg-[#2D98E4] text-white rounded">Contributor Login</Link>
        </div>
      )}
    </nav>
  )
}