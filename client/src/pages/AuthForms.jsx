import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const InputField = ({ name, type, placeholder, value, onChange, icon, error }) => {
    const Icon = icon;
    const errorClasses = "ring-red-500 dark:ring-red-500 focus:ring-red-500";
    const defaultClasses = "ring-gray-300 dark:ring-slate-600 focus:ring-teal-500";

    return (
        <div>
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
                    className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 dark:text-slate-200 bg-white dark:bg-slate-700/50 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm ${error ? errorClasses : defaultClasses}`}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};


export function AuthForm({ type, role }) {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    // --- MODIFIED: Changed from a single error string to an errors object ---
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear error for the field being edited
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    // --- MODIFIED: Complete overhaul of validation logic ---
    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (type === 'register') {
            if (!form.username.trim()) {
                newErrors.username = 'Username is required.';
            } else if (form.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters long.';
            } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
                newErrors.username = 'Username can only contain letters, numbers, and underscores.';
            }
        }
        
        // Email validation
        if (!form.email) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Password validation
        if (!form.password) {
            newErrors.password = 'Password is required.';
        } else if (form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
        }

        // Confirm Password validation
        if (type === 'register') {
            if (!form.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password.';
            } else if (form.password && form.password !== form.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match.';
            }
        }

        setErrors(newErrors);
        // Returns true if the newErrors object is empty
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }
        
        setSuccessMessage('');
        setLoading(true);

        try {
            const endpoint = type;
            const { confirmPassword, ...formData } = form;
            const payload = { ...formData, role };
            
            const res = await axios.post(`/auth/${endpoint}`, payload);

            if (type === 'register') {
                setSuccessMessage(res.data.message);
            } else {
                login(res.data.user);
                navigate('/');
            }
        } catch (err) {
            // Display server-side errors in a general error box
            setErrors({ form: err.response?.data?.message || 'An unexpected error occurred.' });
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
                            <InputField name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} icon={User} error={errors.username} />
                        )}
                        <InputField name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} icon={Mail} error={errors.email} />
                        <InputField name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} icon={KeyRound} error={errors.password} />
                        
                        {type === 'register' && (
                            <InputField name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} icon={KeyRound} error={errors.confirmPassword} />
                        )}
                        
                        {/* --- MODIFIED: For general form errors from the server --- */}
                        {errors.form && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 p-3 rounded-md">
                                <AlertCircle className="h-5 w-5"/>
                                <span>{errors.form}</span>
                            </div>
                        )}
                        
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center gap-2 rounded-md bg-teal-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50"
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