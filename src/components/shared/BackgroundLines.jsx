import { useLocation } from 'react-router-dom'

const BackgroundLines = () => {
  const location = useLocation()
  
  // Hide on player detail pages
  const isPlayerPage = location.pathname.includes('/heroes/') || location.pathname.includes('/knights/')
  
  if (isPlayerPage) return null

  return (
    <div className="bg-lines-container">
      <svg className="bg-lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d="M-10,50 Q25,20 50,50 T110,50" 
          fill="none" 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="1.2" 
        />
        <path 
          d="M-10,30 Q30,60 60,30 T110,30" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="0.8" 
        />
        <path 
          d="M-10,70 Q40,40 70,70 T110,70" 
          fill="none" 
          stroke="rgba(255,255,255,0.12)" 
          strokeWidth="1.0" 
        />
      </svg>
    </div>
  )
}

export default BackgroundLines
