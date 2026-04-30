import { Link } from 'react-router-dom'

const Heroes = () => {
  const heroes = [
    { id: 'stark', name: 'Stark', role: 'Leader' },
    { id: 'nix', name: 'Nix', role: 'Leader' },
    { id: 'huhplayz', name: 'HUHPLAYZ', role: 'Homie' }
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

export default Heroes
