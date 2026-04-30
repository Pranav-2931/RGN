import { Navigate } from 'react-router-dom'

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

export default AdminPage
