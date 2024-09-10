import { RefObject, useEffect, useState } from 'react'

interface PositionDelta {
  dx: number
  dy: number
}

interface Position {
  x: number
  y: number
}

interface DraggableState extends PositionDelta {
  dragging: boolean
}

interface DraggableOptions {
  disableTouch?: boolean
  disableMouse?: boolean
  onStart?: (state: Position) => void
  onDrag?: (state: PositionDelta) => void
  onStop?: (state: PositionDelta) => void
}


const useDraggable = (ref: RefObject<HTMLElement>, options: DraggableOptions = {}): DraggableState => {
  const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 })
  const [dragging, setDragging] = useState(false)

  const handleMouseDown = (e: MouseEvent) => {
    const startPos = {
      x: e.clientX - dx,
      y: e.clientY - dy,
    }
    options.onStart?.(startPos)

    const handleMouseMove = (e: MouseEvent) => {
      const ele = ref.current
      if (!ele) {
        return
      }

      const dx = e.clientX - startPos.x
      const dy = e.clientY - startPos.y
      setDragging(true)
      setOffset({ dx, dy })
      options.onDrag?.({ dx, dy })
    }

    const handleMouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setDragging(false)
      setOffset({ dx: 0, dy: 0 })

      const dx = e.clientX - startPos.x
      const dy = e.clientY - startPos.y
      options.onStop?.({ dx, dy })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    const startPos = {
      x: touch.clientX - dx,
      y: touch.clientY - dy,
    }
    options.onStart?.(startPos)

    const handleTouchMove = (e: TouchEvent) => {
      const ele = ref.current
      if (!ele) {
        return
      }

      const touch = e.touches[0]
      const dx = touch.clientX - startPos.x
      const dy = touch.clientY - startPos.y
      setDragging(true)
      setOffset({ dx, dy })
      options.onDrag?.({ dx, dy })
    }

    const handleTouchEnd = (e: TouchEvent) => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      setDragging(false)
      setOffset({ dx: 0, dy: 0 })

      const touch = e.changedTouches[0]
      const dx = touch.clientX - startPos.x
      const dy = touch.clientY - startPos.y
      options.onStop?.({ dx, dy })
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  useEffect(() => {
    !options?.disableMouse && ref.current?.addEventListener('mousedown', handleMouseDown)
    !options?.disableTouch && ref.current?.addEventListener('touchstart', handleTouchStart)
    return () => {
      ref.current?.removeEventListener('mousedown', handleMouseDown)
      ref.current?.removeEventListener('touchstart', handleTouchStart)
    }
  }, [ref.current])

  return { dx, dy, dragging }
}

export {
  useDraggable as default,
  type DraggableState,
  type Position,
  type PositionDelta
}
