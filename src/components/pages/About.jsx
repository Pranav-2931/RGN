const About = () => (
  <section id="about" className="about-section glass animate-fade-in" style={{ margin: '8rem 5%', padding: '5rem' }}>
    <h2 className="section-title">THE MANIFESTO</h2>
    <div className="about-content">
      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Active Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">TOP 38</span>
          <span className="stat-label">Former Asia Rank</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">RAID</span>
          <span className="stat-label">Anti-Teamer System</span>
        </div>
      </div>
      <div className="about-text" style={{ marginTop: '4rem', textAlign: 'center', maxWidth: '800px', marginInline: 'auto' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          RGN is not just a clan; it's a legacy. Having achieved a peak rank of Top 38 in Asia, we continue our relentless climb to the summit. 
          Our community of over 500 elite players is protected by our proprietary RAID System, specifically engineered to dismantle teamers and restore honor to the battlefield.
        </p>
      </div>
    </div>
  </section>
)

export default About
