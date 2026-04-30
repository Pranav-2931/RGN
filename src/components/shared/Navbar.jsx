import { Link } from 'react-router-dom'

const Navbar = ({ scrolled, user, onLogout }) => (
  <nav className={`navbar ${scrolled ? 'glass' : ''}`}>
    <Link to="/" className="brand">RGN</Link>
    <div className="nav-links">
      <Link to="/about">About Us</Link>
      <Link to="/heroes">Heroes</Link>
      <Link to="/knights">Knights</Link>
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

export default Navbar
