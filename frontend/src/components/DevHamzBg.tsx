/**
 * DevHamzBg
 * – GSAP infinite horizontal marquee (18 s loop)
 * – Each letter gets its own Framer Motion colour cycle
 *   going through the full accent palette in a staggered wave
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'

const LETTERS = 'DevHamz'.split('')

// Accent colours that work across all four themes
const COLORS = [
  '#a78bfa', // violet-light
  '#818cf8', // indigo
  '#38bdf8', // sky
  '#34d399', // emerald
  '#fbbf24', // amber
  '#f472b6', // pink
  '#a78bfa', // back to violet
]

function AnimatedLetter({ char, index }: { char: string; index: number }) {
  return (
    <motion.span
      style={{ display: 'inline-block' }}
      animate={{
        color: COLORS,
        // slight vertical bob per letter, offset by index
        y: [0, -6, 0, 6, 0],
      }}
      transition={{
        color: {
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
          delay: index * 0.35,   // stagger so letters cycle at different phases
        },
        y: {
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.2,
        },
      }}
    >
      {char}
    </motion.span>
  )
}

function DevHamzWord({ opacity = 1 }: { opacity?: number }) {
  return (
    <span
      className="block pr-24 font-black uppercase select-none"
      style={{
        fontSize: 'clamp(100px, 20vw, 300px)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        opacity,
        // Base stroke — colour of each letter overrides the fill
        WebkitTextStroke: '1px rgba(255,255,255,0.04)',
      }}
    >
      {LETTERS.map((ch, i) => (
        <AnimatedLetter key={i} char={ch} index={i} />
      ))}
    </span>
  )
}

export default function DevHamzBg() {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const child = el.firstElementChild as HTMLElement
    if (!child) return

    // wait one frame for layout
    const raf = requestAnimationFrame(() => {
      const w = child.offsetWidth

      gsap.set(el, { x: 0 })

      const tl = gsap.to(el, {
        x: -w,
        duration: 20,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x: number) => parseFloat(x) % w),
        },
      })

      // cleanup
      ;(el as HTMLElement & { _gsapTl?: gsap.core.Tween })._gsapTl = tl
    })

    return () => {
      cancelAnimationFrame(raf)
      const stored = (el as HTMLElement & { _gsapTl?: gsap.core.Tween })._gsapTl
      stored?.kill()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none fixed inset-0 overflow-hidden z-0 flex items-center"
    >
      <div ref={track} className="flex whitespace-nowrap will-change-transform">
        {/* Two identical copies for seamless loop */}
        <DevHamzWord />
        <DevHamzWord />
      </div>
    </div>
  )
}
