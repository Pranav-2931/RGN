import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// --- Shared Components ---
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'

// --- Pages ---
import Home from './components/pages/Home'
import About from './components/pages/About'
import Heroes from './components/pages/Heroes'
import Knights from './components/pages/Knights'
import HeroDetails from './components/pages/HeroDetails'
import KnightDetails from './components/pages/KnightDetails'
import AdminPage from './components/pages/AdminPage'
import AuthPage from './components/pages/AuthPage'

// --- Main App ---

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rgn_user')) || null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('rgn_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('rgn_user')
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar scrolled={scrolled} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/heroes/:id" element={<HeroDetails />} />
          <Route path="/knights" element={<Knights />} />
          <Route path="/knights/:id" element={<KnightDetails />} />
          <Route path="/admin" element={<AdminPage user={user} />} />
          <Route path="/login" element={<AuthPage mode="login" onLogin={handleLogin} />} />
          <Route path="/signup" element={<AuthPage mode="signup" onLogin={handleLogin} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
