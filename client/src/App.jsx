import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ObserverLogin from './pages/ObserverLogin'
import ObserverRegister from './pages/ObserverRegister'
import ContributorLogin from './pages/ContributorLogin'
import ContributorRegister from './pages/ContributorRegister'
import MovieObservationsPage from './pages/MovieObservationsPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Observer Routes */}
        <Route path="/observer/login" element={<ObserverLogin />} />
        <Route path="/observer/register" element={<ObserverRegister />} />
        <Route path="/observer/movie-posts" element={<MovieObservationsPage />} />
        
        {/* Contributor Routes */}
        <Route path="/contributor/login" element={<ContributorLogin />} />
        <Route path="/contributor/register" element={<ContributorRegister />} />
      </Routes>
    </BrowserRouter>
  )
}   