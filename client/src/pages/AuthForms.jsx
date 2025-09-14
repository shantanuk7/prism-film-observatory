import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthForm({ type, role }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const endpoint = `${role}/${type}`; // e.g. observer/login
      await login(endpoint, form);
      navigate('/');
    } catch (error) {
        console.error("Authentication failed:", error);
        // Here you could set an error state to display to the user
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-16">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 shadow-md dark:border dark:border-slate-700 rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900 dark:text-slate-100 capitalize">{role} {type}</h2>
        {type === 'register' && (
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 p-2 w-full mb-4 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400" required />
        )}
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 p-2 w-full mb-4 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200 p-2 w-full mb-6 rounded-md placeholder:text-gray-400 dark:placeholder:text-slate-400" required />
        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition-colors">
          {type === 'login' ? 'Login' : 'Register'}
        </button>
        <div className='text-center w-full pt-4 text-sm text-gray-600 dark:text-slate-400'>
          {type === 'login' ? 
            <>
              Don't have an account?
              <Link to={`/${role}/register`} className='font-medium text-teal-600 dark:text-teal-400 hover:underline ml-1'>Register</Link>
            </> : 
            <>
              Already have an account?
              <Link to={`/${role}/login`} className='font-medium text-teal-600 dark:text-teal-400 hover:underline ml-1'>Login</Link>
            </>
          }
        </div>
      </form>
    </div>
  )
}