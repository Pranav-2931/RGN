import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AuthPage = ({ mode, onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ gamertag: '', email: '', password: '' })
  const [status, setStatus] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [tempEmail, setTempEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const getBaseUrl = () => {
    return import.meta.env.PROD ? '' : 'http://localhost:5000'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Verifying Identity...')

    const endpoint = mode === 'login' ? '/api/login' : '/api/register'
    const payload = mode === 'login' ? { email: formData.email, password: formData.password } : formData
    const fullUrl = `${getBaseUrl()}${endpoint}`

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      
      if (response.ok) {
        setStatus(`SUCCESS: ${data.message}`)
        
        if (mode === 'login') {
          if (data.token) localStorage.setItem('rgn_token', data.token)
          onLogin(data.user)
          const target = data.user?.role === 'Admin' ? '/admin' : '/'
          setTimeout(() => navigate(target), 1500)
        } else {
          // For signup, save email in temp state and show OTP input
          setTempEmail(formData.email)
          setTimeout(() => {
            setShowOtp(true)
            setStatus('')
          }, 1000)
        }
      } else {
        setStatus(`ERROR: ${data.message || data.error}`)
      }
    } catch (err) {
      setStatus('ERROR: Connection failed')
    }
  }

  const handleOtpVerify = async (e) => {
    e.preventDefault()
    if (otpCode.length !== 6) {
      setStatus('ERROR: Security code must be 6 digits')
      return
    }

    setStatus('Verifying authentication key...')
    const fullUrl = `${getBaseUrl()}/api/verify-otp`

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempEmail, otp: otpCode })
      })
      const data = await response.json()

      if (response.ok) {
        setStatus(`SUCCESS: ${data.message}`)
        setTimeout(() => {
          navigate('/login')
          // Reset states
          setShowOtp(false)
          setOtpCode('')
          setFormData({ gamertag: '', email: '', password: '' })
          setStatus('')
        }, 2000)
      } else {
        setStatus(`ERROR: ${data.message || data.error}`)
      }
    } catch (err) {
      setStatus('ERROR: Verification failed')
    }
  }

  const handleOtpResend = async () => {
    if (isResending) return
    setIsResending(true)
    setStatus('Re-transmitting security code...')
    const fullUrl = `${getBaseUrl()}/api/resend-otp`

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempEmail })
      })
      const data = await response.json()

      if (response.ok) {
        setStatus('SUCCESS: A new key has been dispatched.')
      } else {
        setStatus(`ERROR: ${data.message || data.error}`)
      }
    } catch (err) {
      setStatus('ERROR: Re-transmission failed')
    } finally {
      setIsResending(false)
    }
  }

  const handleBackToSignup = () => {
    setShowOtp(false)
    setOtpCode('')
    setStatus('')
  }

  return (
    <div className="auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card glass animate-fade-in">
        <div className="auth-form">
          {showOtp ? (
            <>
              <h2>DECRYPT TRANSMISSION</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                An encrypted 6-digit key was dispatched to:<br />
                <span style={{ color: '#66fcf1', fontWeight: 'bold' }}>{tempEmail}</span>
              </p>
              
              <form onSubmit={handleOtpVerify}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="6-DIGIT OTP KEY" 
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required 
                    style={{ 
                      textAlign: 'center', 
                      letterSpacing: '8px', 
                      fontSize: '1.4rem', 
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#66fcf1',
                      border: '1px solid #1f2833',
                      background: 'rgba(0, 0, 0, 0.4)'
                    }} 
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  AUTHENTICATE SECURELY
                </button>
              </form>

              {status && (
                <p style={{ marginTop: '1rem', textAlign: 'center', color: status.startsWith('ERROR') ? '#ff4444' : '#44ff44', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {status}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', fontSize: '0.8rem' }}>
                <button 
                  onClick={handleOtpResend} 
                  disabled={isResending}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: isResending ? 'var(--text-muted)' : '#66fcf1', 
                    cursor: isResending ? 'not-allowed' : 'pointer',
                    textDecoration: 'underline',
                    fontFamily: 'inherit'
                  }}
                >
                  RESEND KEY
                </button>
                <button 
                  onClick={handleBackToSignup} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontFamily: 'inherit'
                  }}
                >
                  ABORT
                </button>
              </div>
            </>
          ) : (
            <>
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
                <Link to={mode === 'login' ? '/signup' : '/login'} onClick={() => setStatus('')} style={{ color: '#fff', textDecoration: 'underline' }}>
                  {mode === 'login' ? 'SIGN UP' : 'LOGIN'}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
