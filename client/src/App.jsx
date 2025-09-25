import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ObserverLogin from './pages/ObserverLogin';
import ObserverRegister from './pages/ObserverRegister';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import MovieObservationsPage from './pages/MovieObservationsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import BookmarksPage from './pages/BookmarksPage';
import ViewingHistoryPage from './pages/ViewingHistoryPage';
import SettingsPage from './pages/SettingsPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResultsPage />} />
        
        {/* Simplified Movie Route */}
        <Route path="/movie/:id" element={<MovieObservationsPage />} />

        {/* Auth Routes */}
        <Route path="/observer/login" element={<ObserverLogin />} />
        <Route path="/observer/register" element={<ObserverRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* -- Observer Protected Route -- */}
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><ViewingHistoryPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* -- Admin Protected Route -- */}
        <Route 
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}