// client/src/pages/VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        console.log("on verify page");
        

        if (!token) {
            setStatus('error');
            setMessage('No verification token found. Please check the link from your email.');
            return;
        }

        const verify = async () => {
            try {
                const res = await axios.post('/auth/verify-email', { token });
                setStatus('success');
                setMessage(res.data.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };
        verify();
    }, [token]);

    return (
        <AuthLayout>
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-8 text-center">
                {status === 'verifying' && (
                    <>
                        <Loader2 className="mx-auto h-12 w-12 text-teal-500 animate-spin" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-slate-200">Verifying...</h2>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-slate-200">Verification Successful!</h2>
                        <p className="mt-2 text-gray-600 dark:text-slate-400">{message}</p>
                        <Link to="/observer/login" className="mt-6 inline-block w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition">
                            Proceed to Login
                        </Link>
                    </>
                )}
                {status === 'error' && (
                     <>
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-slate-200">Verification Failed</h2>
                        <p className="mt-2 text-gray-600 dark:text-slate-400">{message}</p>
                    </>
                )}
            </div>
        </AuthLayout>
    );
}