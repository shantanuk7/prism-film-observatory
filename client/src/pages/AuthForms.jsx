import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // Use the configured axios instance
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

// Reusable Input Field Component
const InputField = ({ name, type, placeholder, value, onChange, icon }) => {
    const Icon = icon;
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 dark:text-slate-200 bg-white dark:bg-slate-700/50 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm"
            />
        </div>
    );
};

export function AuthForm({ type, role }) {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const validateForm = () => {
        if (type === 'register' && !form.username.trim()) {
            setError('Username is required.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        return true;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const endpoint = type; // 'login' or 'register'
            const payload = { ...form, role };
            
            // --- MODIFIED: Direct API call with simplified endpoint ---
            const res = await axios.post(`/auth/${endpoint}`, payload);

            if (type === 'register') {
                setSuccessMessage(res.data.message);
            } else {
                // For login, use the AuthContext and navigate
                login(res.data.user);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-8">
                <h2 className="text-2xl mb-2 font-bold text-center text-gray-900 dark:text-slate-100 capitalize">
                    {type === 'register' ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-6">
                    {type === 'login' ? 'Log in to continue to Prism' : `Signing up as an ${role}`}
                </p>

                {!successMessage ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {type === 'register' && (
                            <InputField name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} icon={User} />
                        )}
                        <InputField name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} icon={Mail} />
                        <InputField name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} icon={KeyRound} />
                        
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 p-3 rounded-md">
                                <AlertCircle className="h-5 w-5"/>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center gap-2 rounded-md bg-teal-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50"
                            >
                                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                                {loading ? 'Processing...' : (type === 'login' ? 'Log In' : 'Create Account')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500"/>
                        <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-slate-200">Success!</h3>
                        <p className="mt-2 text-gray-600 dark:text-slate-400">{successMessage}</p>
                    </div>
                )}
                
                <p className='text-center w-full pt-6 text-sm text-gray-500 dark:text-slate-400'>
                    {type === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <Link to={type === 'login' ? `/${role}/register` : `/${role}/login`} className='font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 ml-1'>
                        {type === 'login' ? 'Sign up' : 'Log in'}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}