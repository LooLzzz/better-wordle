import { useEffect, useRef } from 'react'

interface SwipeOptions {
  left?: () => void
  right?: () => void
  up?: () => void
  down?: () => void
}

const useSwipe = ({ left, right, up, down }: SwipeOptions = {}) => {
  const touchCoordsRef = useRef({ touchStart: { x: 0, y: 0, time: Date.now() } })
  const fnsRef = useRef({ up, down, left, right })
  fnsRef.current = {
    up,
    left,
    down,
    right,
  }
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchCoordsRef.current.touchStart.x = e.targetTouches[0].clientX
      touchCoordsRef.current.touchStart.y = e.targetTouches[0].clientY
      touchCoordsRef.current.touchStart.time = Date.now()
    }
    const handleTouchEnd = (e: TouchEvent) => {
      const threshold = 100
      const swipeSpeed = 1 // sec;
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const touchStartX = touchCoordsRef.current.touchStart.x
      const touchStartY = touchCoordsRef.current.touchStart.y
      const elapsedTime = (Date.now() - touchCoordsRef.current.touchStart.time) / 1000
      if (elapsedTime > swipeSpeed) {
        return
      }
      const xDistance = touchStartX - touchEndX
      const yDistance = touchStartY - touchEndY

      if (Math.abs(xDistance) < threshold && Math.abs(yDistance) < threshold) {
        return
      }

      if (Math.abs(xDistance) >= Math.abs(yDistance)) {
        xDistance > 0 ? fnsRef.current.left?.() : fnsRef.current.right?.()
      } else {
        yDistance > 0 ? fnsRef.current.down?.() : fnsRef.current.up?.()
      }
    }
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  })
}

export default useSwipe
