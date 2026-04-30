import { Link } from 'react-router-dom'

const Knights = () => {
  const knights = [
    { id: 'ryzen', name: 'Ryzen', role: 'E-KITTEN' },
    { id: 'dan', name: 'Dan', role: 'Knight' },
    { id: 'aki', name: 'Aki', role: 'TSBCC Staff' }
  ]
  return (
    <section id="knights" className="heroes-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 className="section-title animate-fade-in">THE KNIGHTS</h2>
      <div className="heroes-list">
        {knights.map((knight, index) => (
          <Link to={`/knights/${knight.id}`} key={index} className="hero-simple-card animate-fade-in" style={{ animationDelay: `${index * 0.2}s`, textDecoration: 'none', color: 'inherit' }}>
            <span className="hero-name">{knight.name}</span>
            <span className="hero-divider">/</span>
            <span className="hero-role">{knight.role}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Knights
