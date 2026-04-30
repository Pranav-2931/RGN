import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AuthPage = ({ mode, onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ gamertag: '', email: '', password: '' })
  const [status, setStatus] = useState('')

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

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

    const baseUrl = import.meta.env.PROD ? '' : 'http://localhost:5000'
    const fullUrl = `${baseUrl}${endpoint}`

    console.log('DEBUG: Fetching from:', fullUrl)
    setStatus(`Connecting to: ${fullUrl}...`)

    try {
      const response = await fetch(fullUrl, {
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
            {mode === 'login' ? 'UNREGISTERED? ' : 'ALREADY ELIGIBLE? '}
            <Link to={mode === 'login' ? '/signup' : '/login'} style={{ color: '#fff', textDecoration: 'underline' }}>
              {mode === 'login' ? 'SIGN UP' : 'LOGIN'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
