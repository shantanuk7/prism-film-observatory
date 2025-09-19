import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ObserverLogin from './pages/ObserverLogin';
import ObserverRegister from './pages/ObserverRegister';
import ContributorLogin from './pages/ContributorLogin';
import ContributorRegister from './pages/ContributorRegister';
import MovieObservationsPage from './pages/MovieObservationsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import BookmarksPage from './pages/BookmarksPage';
import ViewingHistoryPage from './pages/ViewingHistoryPage';
import SettingsPage from './pages/SettingsPage';

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
        <Route path="/contributor/login" element={<ContributorLogin />} />
        <Route path="/contributor/register" element={<ContributorRegister />} />

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