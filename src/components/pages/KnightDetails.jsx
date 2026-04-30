import { Link, useParams, Navigate } from 'react-router-dom'
import MusicWidget from '../shared/MusicWidget'
import ryzenData from '../knights/ryzen'
import danData from '../knights/dan'
import akiData from '../knights/aki'

const KnightDetails = () => {
  const { id } = useParams()

  const knightData = {
    ryzen: ryzenData,
    dan: danData,
    aki: akiData
  }

  const knight = knightData[id]
  if (!knight) return <Navigate to="/knights" />

  return (
    <section className="hero-details-page animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '12vh 10%', position: 'relative' }}>
      {knight.bgUrl ? (
        <img src={knight.bgUrl} alt="" className="hero-bg-overlay" />
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
        borderLeft: `5px solid ${knight.theme ? knight.theme.primary : '#fff'}`,
        borderRadius: '0 40px 40px 0',
        boxShadow: knight.theme ? `30px 0 60px ${knight.theme.secondary}11` : 'none'
      }}>
        <div className="hero-detail-content">
          <h1 className="hero-detail-name animate-reveal-text" style={{
            color: '#fff',
            textShadow: knight.theme ? `3px 3px 0 ${knight.theme.primary}, -3px -3px 0 ${knight.theme.secondary}` : 'none'
          }}>
            {knight.name}
          </h1>
          <h2 className="hero-detail-role animate-reveal-text" style={{
            color: 'var(--text-muted)',
            marginBottom: '4rem',
            letterSpacing: '8px',
            animationDelay: '0.3s'
          }}>
            {knight.role}
          </h2>

          <div className="detail-grid">
            {knight.stats.map((stat, i) => (
              <div key={i} className="detail-stat-item animate-fade-in-up" style={{
                animationDelay: `${0.6 + i * 0.2}s`,
                borderColor: knight.theme ? knight.theme.primary : '#fff'
              }}>
                <span className="detail-label">{stat.label}</span>
                <span className="detail-value" style={{ color: knight.theme ? '#fff' : 'inherit' }}>{stat.value}</span>
              </div>
            ))}
          </div>

          {knight.spotifyId && (
            <div className="spotify-embed animate-fade-in-up" style={{ marginTop: '3rem', animationDelay: '1.2s' }}>
              <iframe
                style={{ borderRadius: '12px' }}
                src={`https://open.spotify.com/embed/track/${knight.spotifyId}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          )}

          <div className="animate-fade-in-up" style={{ marginTop: '4rem', animationDelay: '1.5s' }}>
            <Link to="/knights" className="btn-outline" style={{
              borderColor: knight.theme ? knight.theme.primary : '#fff',
              color: knight.theme ? knight.theme.primary : '#fff'
            }}>
              Return to Knights
            </Link>
          </div>
        </div>
        <div className="bg-decor-text" style={{ color: knight.theme ? `${knight.theme.primary}05` : 'rgba(255, 255, 255, 0.02)' }}>{knight.name}</div>
      </div>

      {knight.songName && <MusicWidget song={knight.songName} artist={knight.artistName} />}
    </section>
  )
}

export default KnightDetails
