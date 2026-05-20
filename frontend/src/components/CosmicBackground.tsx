"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkleSpeed: number
  twinklePhase: number
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  active: boolean
  life: number
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize stars
    const starCount = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200)
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }))

    // Initialize shooting stars
    shootingStarsRef.current = Array.from({ length: 3 }, () => ({
      x: 0,
      y: 0,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 4 + 2,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 0,
      active: false,
      life: 0,
    }))

    let time = 0

    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.3,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      )
      gradient.addColorStop(0, "rgba(15, 23, 42, 1)")
      gradient.addColorStop(0.5, "rgba(10, 15, 30, 1)")
      gradient.addColorStop(1, "rgba(5, 8, 20, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        const alpha = star.opacity * twinkle

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()

        // Glow effect for brighter stars
        if (star.size > 1.5) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.1})`
          ctx.fill()
        }
      }

      // Draw shooting stars
      for (const ss of shootingStarsRef.current) {
        if (!ss.active) {
          ss.life++
          if (ss.life > Math.random() * 300 + 200) {
            ss.active = true
            ss.x = Math.random() * canvas.width * 0.8
            ss.y = Math.random() * canvas.height * 0.3
            ss.opacity = 1
            ss.life = 0
          }
          continue
        }

        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y + Math.sin(ss.angle) * ss.length
        )
        ctx.strokeStyle = `rgba(255, 255, 255, ${ss.opacity})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Glow
        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length * 0.5,
          ss.y + Math.sin(ss.angle) * ss.length * 0.5
        )
        ctx.strokeStyle = `rgba(200, 220, 255, ${ss.opacity * 0.3})`
        ctx.lineWidth = 4
        ctx.stroke()

        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y -= Math.sin(ss.angle) * ss.speed
        ss.opacity -= 0.003

        if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
          ss.active = false
          ss.life = 0
          ss.opacity = 0
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  )
}
