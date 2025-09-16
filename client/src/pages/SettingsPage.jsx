import React, { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, User, KeyRound, Trash2 } from 'lucide-react';

// Reusable Card component for the settings page
const SettingsCard = ({ title, description, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700">
        <div className="p-6 border-b dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{description}</p>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State for forms
    const [profileData, setProfileData] = useState({ username: user.username, email: user.email });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    // State for messages
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    
    // State for deleting account
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: 'loading', text: 'Saving...' });
        try {
            await axios.put('/users/profile', profileData);
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: 'loading', text: 'Saving...' });
        try {
            await axios.put('/users/password', passwordData);
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password.' });
        }
    };
    
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'delete my account') return;
        try {
            await axios.delete('/users/profile');
            await logout();
            navigate('/');
        } catch (error) {
            alert('Failed to delete account. Please try again.');
        }
    };
    
    const Message = ({ message }) => {
        if (!message.text) return null;
        const colors = {
            success: 'text-green-600 dark:text-green-400',
            error: 'text-red-600 dark:text-red-500',
            loading: 'text-gray-600 dark:text-slate-400',
        };
        return <p className={`text-sm mt-2 ${colors[message.type]}`}>{message.text}</p>;
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-200 dark:border-slate-700">
                <Settings className="text-teal-600 dark:text-teal-400" size={28} />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Account Settings</h1>
            </div>
            
            <div className="space-y-8">
                {/* Update Profile Form */}
                <SettingsCard title="Profile Information" description="Update your username and email address.">
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Username</label>
                            <input type="text" name="username" id="username" value={profileData.username} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                            <input type="email" name="email" id="email" value={profileData.email} onChange={handleProfileChange} className="mt-1 w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"/>
                        </div>
                        <div className="flex items-center justify-between">
                             <Message message={profileMessage} />
                             <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700">Save Changes</button>
                        </div>
                    </form>
                </SettingsCard>

                {/* Change Password Form */}
                <SettingsCard title="Change Password" description="Choose a new, strong password.">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                         <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium">Current Password</label>
                            <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
                            <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <Message message={passwordMessage} />
                            <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700">Update Password</button>
                        </div>
                    </form>
                </SettingsCard>

                {/* Delete Account Section */}
                <SettingsCard title="Delete Account" description="Permanently delete your account and all associated data. This action cannot be undone.">
                    <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">Delete My Account</button>
                </SettingsCard>
            </div>
            
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-red-600">Are you absolutely sure?</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">This will permanently delete your account. Your observations and analyses will be anonymized. To confirm, please type "delete my account" below.</p>
                        <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="mt-4 w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"/>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-md text-sm">Cancel</button>
                            <button onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'delete my account'} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm disabled:opacity-50">Delete Account</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}