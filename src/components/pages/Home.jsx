import { Link } from 'react-router-dom'
import heroBg from '../../assets/hero-bg-bw.png'

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

export default Home
