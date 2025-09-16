import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            {/* The spinner will now use a slightly brighter teal in dark mode for better visibility */}
            <Loader2 className="animate-spin text-teal-600 dark:text-teal-500" size={48} />
        </div>
    );
  }

  // If not logged in, redirect to the login page.
  if (!user) {
    return <Navigate to="/observer/login" />;
  }

  // If a role is required and the user's role doesn't match, redirect to the home page.
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  
  return children;
}