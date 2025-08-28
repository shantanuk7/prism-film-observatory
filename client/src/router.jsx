import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ObserverLogin from './pages/ObserverLogin'
import ObserverRegister from './pages/ObserverRegister'
import ContributorLogin from './pages/ContributorLogin'
import ContributorRegister from './pages/ContributorRegister'

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/observer/login" element={<ObserverLogin />} />
        <Route path="/observer/register" element={<ObserverRegister />} />
        <Route path="/contributor/login" element={<ContributorLogin />} />
        <Route path="/contributor/register" element={<ContributorRegister />} />
      </Routes>
    </BrowserRouter>
  )
}
