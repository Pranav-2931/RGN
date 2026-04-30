import { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  useEffect(() => {
    // Smooth trailing effect
    const followCursor = () => {
      setTrail(prev => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15
      }))
      requestAnimationFrame(followCursor)
    }
    const animationFrame = requestAnimationFrame(followCursor)
    return () => cancelAnimationFrame(animationFrame)
  }, [position])

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        className="custom-cursor-main"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Glowing Trail Orb */}
      <div 
        className="custom-cursor-trail"
        style={{ left: `${trail.x}px`, top: `${trail.y}px` }}
      />
    </>
  )
}

export default CustomCursor
