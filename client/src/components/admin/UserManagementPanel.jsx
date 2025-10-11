import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Loader2, Shield, User, MoreVertical, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserManagementPanel() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/admin/users');
            setUsers(data);
        } catch (err) {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, role) => {
        try {
            await axios.put(`/admin/users/${userId}/role`, { role });
            setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
            setActiveMenu(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update role.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            try {
                await axios.delete(`/admin/users/${userId}`);
                setUsers(users.filter(u => u._id !== userId));
                setActiveMenu(null);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-500" size={32} /></div>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {/* --- CHANGE 1: Get the index from the map function --- */}
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-slate-200">{user.username}</div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {user.role === 'admin' 
                                    ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">Admin</span>
                                    : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300">Observer</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="relative inline-block text-left">
                                    <button onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                                        <MoreVertical size={16}/>
                                    </button>
                                    {activeMenu === user._id && (
                                        /* --- CHANGE 2: Conditionally apply positioning classes --- */
                                        <div className={`
                                            absolute right-0 w-48 rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 z-10
                                            ${index >= users.length - 2 ? 'bottom-full origin-bottom-right mb-2' : 'origin-top-right mt-2'}
                                        `}>
                                            <div className="py-1">
                                                {user.role === 'observer' ? (
                                                    <button onClick={() => handleRoleChange(user._id, 'admin')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                                                        <Shield size={14}/> Make Admin
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleRoleChange(user._id, 'observer')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">
                                                        <User size={14}/> Make Observer
                                                    </button>
                                                )}
                                                {currentUser._id !== user._id && (
                                                    <button onClick={() => handleDeleteUser(user._id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                                        <Trash2 size={14}/> Delete User
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}