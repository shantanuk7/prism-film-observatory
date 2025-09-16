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
import ContributorDashboard from './pages/ContributorDashboard';

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

        {/* Contributor Protected Route */}
        <Route 
          path="/contributor/dashboard" 
          element={
            <ProtectedRoute role="contributor">
              <ContributorDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}