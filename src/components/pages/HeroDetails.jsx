import { Link, useParams, Navigate } from 'react-router-dom'
import starkData from '../heroes/stark'
import nixData from '../heroes/nix'
import huhplayzData from '../heroes/huhplayz'

const HeroDetails = () => {
  const { id } = useParams()

  const heroData = {
    stark: starkData,
    nix: nixData,
    huhplayz: huhplayzData
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
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderLeft: `5px solid ${hero.theme ? hero.theme.primary : '#fff'}`,
        borderRadius: '0 40px 40px 0',
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

export default HeroDetails
