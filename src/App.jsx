import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom'
import heroBg from './assets/hero-bg-bw.png'
import './App.css'

// --- Components ---

const Navbar = ({ scrolled, user, onLogout }) => (
  <nav className={`navbar ${scrolled ? 'glass' : ''}`}>
    <Link to="/" className="brand">RGN</Link>
    <div className="nav-links">
      <Link to="/about">About Us</Link>
      <Link to="/heroes">Heroes</Link>
      {user && user.role === 'Admin' && <Link to="/admin" style={{ color: '#44ff44' }}>Admin Panel</Link>}
      {!user ? (
        <>
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/signup" className="btn-primary">Join Clan</Link>
        </>
      ) : (
        <button onClick={onLogout} className="btn-outline">Logout</button>
      )}
    </div>
  </nav>
)

const Footer = () => (
  <footer style={{ padding: '5rem 5%', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', background: '#000' }}>
    <div className="brand" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>RGN</div>
    <p style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>EST. 2026 | ROYAL GAMING NETWORK | NO LIMITS</p>
  </footer>
)

// --- Pages ---

const Home = ({ user }) => (
  <section className="hero-section">
    <img src={heroBg} alt="RGN Clan" className="hero-bg" />
    <div className="hero-content animate-fade-in">
      <h1 className="hero-title">RGN CLAN</h1>
      <p className="hero-subtitle">
        {user ? `Welcome back, ${user.gamertag || 'Hero'}. Your legacy continues.` : 'Elegance in shadows. Power in silence. The elite of the digital frontier.'}
      </p>
      <div className="cta-group">
        {!user && <Link to="/signup" className="btn-primary">Initiate</Link>}
        <Link to="/about" className="btn-outline">The Manifesto</Link>
      </div>
    </div>
  </section>
)

const AdminPage = ({ user }) => {
  if (!user || user.role !== 'Admin') return <Navigate to="/" />
  
  return (
    <section className="admin-page glass animate-fade-in" style={{ margin: '8rem 5%', padding: '5rem', minHeight: '60vh' }}>
      <h2 className="section-title" style={{ color: '#44ff44' }}>COMMAND CENTER</h2>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>Welcome, Leader Nix. The clan awaits your orders.</p>
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-number">48</span>
            <span className="stat-label">Pending Initiates</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">ACTIVE</span>
            <span className="stat-label">RAID Status</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Critical Alerts</span>
          </div>
        </div>
        <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <button className="btn-primary">Deploy RAID</button>
          <button className="btn-outline">Ban Teamers</button>
          <button className="btn-outline">Manage Heroes</button>
        </div>
      </div>
    </section>
  )
}

const About = () => (
  <section id="about" className="about-section glass animate-fade-in" style={{ margin: '8rem 5%', padding: '5rem' }}>
    <h2 className="section-title">THE MANIFESTO</h2>
    <div className="about-content">
      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Active Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">TOP 38</span>
          <span className="stat-label">Former Asia Rank</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">RAID</span>
          <span className="stat-label">Anti-Teamer System</span>
        </div>
      </div>
      <div className="about-text" style={{ marginTop: '4rem', textAlign: 'center', maxWidth: '800px', marginInline: 'auto' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          RGN is not just a clan; it's a legacy. Having achieved a peak rank of Top 38 in Asia, we continue our relentless climb to the summit. 
          Our community of over 500 elite players is protected by our proprietary RAID System, specifically engineered to dismantle teamers and restore honor to the battlefield.
        </p>
      </div>
    </div>
  </section>
)

const Heroes = () => {
  const heroes = [
    { id: 'stark', name: 'Stark', role: 'Leader' },
    { id: 'nix', name: 'Nix', role: 'Leader' }
  ]
  return (
    <section id="heroes" className="heroes-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 className="section-title animate-fade-in">THE HEROES</h2>
      <div className="heroes-list">
        {heroes.map((hero, index) => (
          <Link to={`/heroes/${hero.id}`} key={index} className="hero-simple-card animate-fade-in" style={{ animationDelay: `${index * 0.2}s`, textDecoration: 'none', color: 'inherit' }}>
            <span className="hero-name">{hero.name}</span>
            <span className="hero-divider">/</span>
            <span className="hero-role">{hero.role}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

const HeroDetails = () => {
  const { id } = useParams()
  const heroData = {
    nix: {
      name: 'NIX',
      role: 'LEADER',
      bgUrl: 'https://media1.tenor.com/m/n1-pMIAmy-IAAAAC/micheal-kaiser-blue-lock.gif',
      theme: { primary: '#00ffff', secondary: '#ff0033' }, // Cyan & Red
      stats: [
        { label: 'Total Kills', value: '45,000+' },
        { label: 'TSBAH Stage', value: 'Official 2-High' },
        { label: 'Current Objective', value: 'Going for 1 Low' }
      ]
    },
    stark: {
      name: 'STARK',
      role: 'LEADER',
      bgUrl: 'https://media1.tenor.com/m/E19MfksQI4IAAAAC/sukuna.gif',
      theme: { primary: '#ffffff', secondary: '#333333' }, // Strictly Black & White
      stats: [
        { label: 'Peak Rank', value: 'Former Top 11 India' },
        { label: 'Total Kills', value: '35,000+' },
        { label: 'Current Stage', value: '1 Low Stable' }
      ]
    }
  }

  const hero = heroData[id]
  if (!hero) return <Navigate to="/heroes" />

  return (
    <section className="hero-details-page animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '12vh 10%', position: 'relative' }}>
      {/* Dynamic Background */}
      {hero.bgUrl ? (
        <div className="hero-bg-overlay" style={{ backgroundImage: `url(${hero.bgUrl})` }}></div>
      ) : (
        <div className="hero-bg-overlay-default"></div>
      )}

      <div className="hero-detail-card" style={{ 
        width: '100%', 
        maxWidth: '700px', 
        padding: '5rem', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.2)', // Higher transparency
        backdropFilter: 'blur(10px)',
        borderLeft: `5px solid ${hero.theme ? hero.theme.primary : '#fff'}`,
        borderRadius: '0 40px 40px 0', // Rounded on one side
        boxShadow: hero.theme ? `30px 0 60px ${hero.theme.secondary}11` : 'none'
      }}>
        <div className="hero-detail-content">
          <h1 className="hero-detail-name animate-reveal-text" style={{ 
            color: '#fff',
            textShadow: hero.theme ? `3px 3px 0 ${hero.theme.primary}, -3px -3px 0 ${hero.theme.secondary}` : 'none'
          }}>
            {hero.name}
          </h1>
          <h2 className="hero-detail-role animate-reveal-text" style={{ 
            color: 'var(--text-muted)', 
            marginBottom: '4rem', 
            letterSpacing: '8px', 
            animationDelay: '0.3s' 
          }}>
            {hero.role}
          </h2>
          
          <div className="detail-grid">
            {hero.stats.map((stat, i) => (
              <div key={i} className="detail-stat-item animate-fade-in-up" style={{ 
                animationDelay: `${0.6 + i * 0.2}s`,
                borderColor: hero.theme ? hero.theme.primary : '#fff'
              }}>
                <span className="detail-label">{stat.label}</span>
                <span className="detail-value" style={{ color: hero.theme ? '#fff' : 'inherit' }}>{stat.value}</span>
              </div>
            ))}
          </div>
          
          <div className="animate-fade-in-up" style={{ marginTop: '8rem', animationDelay: '1.5s' }}>
            <Link to="/heroes" className="btn-outline" style={{ 
              borderColor: hero.theme ? hero.theme.primary : '#fff',
              color: hero.theme ? hero.theme.primary : '#fff'
            }}>
              Return to Roster
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Text */}
        <div className="bg-decor-text" style={{ color: hero.theme ? `${hero.theme.primary}05` : 'rgba(255, 255, 255, 0.02)' }}>{hero.name}</div>
      </div>
    </section>
  )
}

const AuthPage = ({ mode, onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ gamertag: '', email: '', password: '' })
  const [status, setStatus] = useState('')

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Verifying Identity...')
    
    if (formData.email === 'pranavrajkichu@gmail.com' && formData.password === 'nix2931') {
      setStatus('SUCCESS: Welcome, Leader Nix')
      onLogin({ gamertag: 'Nix', email: formData.email, role: 'Admin' })
      setTimeout(() => navigate('/admin'), 1500)
      return
    }

    const endpoint = mode === 'login' ? '/api/login' : '/api/register'
    const payload = mode === 'login' ? { email: formData.email, password: formData.password } : formData

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (response.ok) {
        setStatus(`SUCCESS: ${data.message}`)
        onLogin(data.user || { gamertag: formData.gamertag, email: formData.email, role: 'Member' })
        setTimeout(() => navigate('/'), 1500)
      } else {
        setStatus(`ERROR: ${data.message || data.error}`)
      }
    } catch (err) {
      setStatus('ERROR: Connection failed')
    }
  }

  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card glass animate-fade-in">
        <div className="auth-form">
          <h2>{mode === 'login' ? 'IDENTITY VERIFIED' : 'CLAN INITIATION'}</h2>
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <input type="text" name="gamertag" placeholder="GAMERTAG" value={formData.gamertag} onChange={handleInputChange} required />
              </div>
            )}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input type="email" name="email" placeholder="ENCRYPTED EMAIL" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input type="password" name="password" placeholder="PASSPHRASE" value={formData.password} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {mode === 'login' ? 'ENTER SYSTEM' : 'REQUEST ENTRANCE'}
            </button>
          </form>
          {status && (
            <p style={{ marginTop: '1rem', textAlign: 'center', color: status.startsWith('ERROR') ? '#ff4444' : '#44ff44', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {status}
            </p>
          )}
          <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '1px' }}>
            {mode === 'login' ? "UNREGISTERED? " : "ALREADY ELIGIBLE? "}
            <Link to={mode === 'login' ? '/signup' : '/login'} style={{ color: '#fff', textDecoration: 'underline' }}>
              {mode === 'login' ? 'SIGN UP' : 'LOGIN'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

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
