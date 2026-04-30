const MusicWidget = ({ song, artist }) => (
  <div className="music-widget animate-fade-in-up" style={{ animationDelay: '2s' }}>
    <div className="music-info">
      <span className="music-song-name">{song}</span>
      <span className="music-artist">{artist}</span>
    </div>
    <div className="volume-section">
      <div className="volume-knob"></div>
      <div className="volume-bars">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`volume-bar ${i <= 4 ? 'active' : ''}`} style={{ height: `${i * 2 + 4}px` }}></div>
        ))}
      </div>
    </div>
  </div>
)

export default MusicWidget
