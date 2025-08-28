import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AuthForm({ type, role }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    const endpoint = `${role}/${type}` // e.g. observer/login
    await login(endpoint, form)
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-8 w-96">
        <h2 className="text-2xl mb-4 font-semibold capitalize">{role} {type}</h2>
        {type === 'register' && (
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="border p-2 w-full mb-4" required />
        )}
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full mb-4" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 w-full mb-6" required />
        <button type="submit" className="w-full bg-[#2C98E4] text-white py-2 rounded">
          {type === 'login' ? 'Login' : 'Register'}
        </button>
        <div className='text-center w-full pt-4'>
          {type === 'login' ? 
          <>
            Don't have an account?
            <a href={`/${role}/Register`} className='text-blue-800'> Register</a>
          </> : 
          <>
            Already have an account?
            <a href={`/${role}/Login`} className='text-blue-800'> Login</a>
          </>
          }
        </div>
      </form>
    </div>
  )
}