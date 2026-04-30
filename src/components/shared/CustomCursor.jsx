import { useEffect, useState, useRef } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dotsCount = 8
  const [trail, setTrail] = useState(new Array(dotsCount).fill({ x: 0, y: 0 }))

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  useEffect(() => {
    const updateTrail = () => {
      setTrail(prev => {
        const newTrail = [...prev]
        // The first dot follows the mouse
        newTrail[0] = {
          x: newTrail[0].x + (position.x - newTrail[0].x) * 0.5,
          y: newTrail[0].y + (position.y - newTrail[0].y) * 0.5
        }
        // Each subsequent dot follows the one before it
        for (let i = 1; i < dotsCount; i++) {
          newTrail[i] = {
            x: newTrail[i].x + (newTrail[i - 1].x - newTrail[i].x) * 0.4,
            y: newTrail[i].y + (newTrail[i - 1].y - newTrail[i].y) * 0.4
          }
        }
        return newTrail
      })
      requestAnimationFrame(updateTrail)
    }
    const animationFrame = requestAnimationFrame(updateTrail)
    return () => cancelAnimationFrame(animationFrame)
  }, [position])

  return (
    <>
      <div 
        className="custom-cursor-dot main"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {trail.map((point, index) => (
        <div 
          key={index}
          className="custom-cursor-dot trail"
          style={{ 
            left: `${point.x}px`, 
            top: `${point.y}px`,
            opacity: (dotsCount - index) / dotsCount,
            transform: `translate(-50%, -50%) scale(${(dotsCount - index) / dotsCount})`
          }}
        />
      ))}
    </>
  )
}

export default CustomCursor
