import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const AdminPage = ({ user }) => {
  if (!user || user.role !== 'Admin') return <Navigate to="/" />

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => { setMembers(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  return (
    <section className="admin-page glass animate-fade-in" style={{ margin: '8rem 5%', padding: '3rem', minHeight: '60vh' }}>
      <h2 className="section-title" style={{ color: '#44ff44' }}>COMMAND CENTER</h2>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Welcome, Leader Nix. The clan awaits your orders.
      </p>

      {/* Stats Row */}
      <div className="stat-grid" style={{ marginBottom: '4rem' }}>
        <div className="stat-item">
          <span className="stat-number">{loading ? '...' : members.length}</span>
          <span className="stat-label">Registered Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">ACTIVE</span>
          <span className="stat-label">RAID Status</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{loading ? '...' : members.filter(m => m.role === 'Admin').length}</span>
          <span className="stat-label">Admins</span>
        </div>
      </div>

      {/* Members Table */}
      <h3 style={{ color: '#44ff44', marginBottom: '1.5rem', fontSize: '1.4rem', letterSpacing: '2px' }}>
        👥 CLAN ROSTER
      </h3>

      {loading && <p style={{ textAlign: 'center', opacity: 0.6 }}>Loading members...</p>}
      {error && <p style={{ textAlign: 'center', color: '#ff4444' }}>❌ Error: {error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '1rem',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #44ff4455' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Gamertag</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                    No members registered yet.
                  </td>
                </tr>
              ) : (
                members.map((m, i) => (
                  <tr key={m._id} style={{ borderBottom: '1px solid #ffffff11', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#44ff4411'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={{ ...tdStyle, color: '#44ff44', fontWeight: 'bold' }}>{m.gamertag}</td>
                    <td style={tdStyle}>{m.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        background: m.role === 'Admin' ? '#44ff4433' : '#ffffff22',
                        color: m.role === 'Admin' ? '#44ff44' : '#aaa',
                        border: `1px solid ${m.role === 'Admin' ? '#44ff44' : '#555'}`
                      }}>{m.role}</span>
                    </td>
                    <td style={{ ...tdStyle, opacity: 0.6, fontSize: '0.85rem' }}>
                      {m._id ? new Date(parseInt(m._id.substring(0, 8), 16) * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary">Deploy RAID</button>
        <button className="btn-outline">Ban Teamers</button>
        <button className="btn-outline">Manage Heroes</button>
      </div>
    </section>
  )
}

const thStyle = {
  padding: '1rem 1.5rem',
  textAlign: 'left',
  color: '#44ff44',
  fontWeight: '600',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  fontSize: '0.85rem',
}

const tdStyle = {
  padding: '1rem 1.5rem',
  color: '#ddd',
}

export default AdminPage
