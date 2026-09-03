import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiSparklingLine, RiArrowRightLine, RiRobot2Line,
  RiChat3Line, RiCodeSSlashLine, RiUser3Line,
} from 'react-icons/ri'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { TbTargetArrow, TbShieldCheck, TbCircleCheck } from 'react-icons/tb'
import { BiTrendingUp } from 'react-icons/bi'
import { useChat } from '../context/ChatContext'
import PageTransition from '../components/PageTransition'

const HERO_IMG   = 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80&auto=format&fit=crop'
const CARD_IMG_1 = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format&fit=crop'
const CARD_IMG_2 = 'https://images.unsplash.com/photo-1655720035861-ba4fd21a598d?w=600&q=80&auto=format&fit=crop'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}
function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}
function timeAgo(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60)  return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return d.toLocaleDateString()
}

/* ── animation helpers ── */
const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 22 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
})
const staggerList = {
  animate: { transition: { staggerChildren: 0.07 } },
}
const listItem = {
  initial:    { opacity: 0, x: -14 },
  animate:    { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
}

/* ── Donut ── */
function DonutRing({ percent }: { percent: number }) {
  const r = 42, circ = 2 * Math.PI * r, dash = (percent / 100) * circ
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="9" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="url(#dg)" strokeWidth="9"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        />
        <defs>
          <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-light)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text)' }}>{percent}%</span>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Done</span>
      </div>
    </div>
  )
}

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: number; sub: string; accent: string
}) {
  return (
    <motion.div
      variants={listItem}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      className="glass glass-hover glass-shine stat-chip relative overflow-hidden"
    >
      {/* ambient glow behind icon */}
      <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full blur-2xl opacity-20"
        style={{ background: accent }} />
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 relative z-10"
        style={{ background: `${accent}22` }}>
        <Icon className="text-base" style={{ color: accent }} />
      </div>
      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest relative z-10"
        style={{ color: 'var(--text-3)' }}>{label}</p>
      <p className="text-2xl sm:text-3xl font-light mt-0.5 relative z-10"
        style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-[10px] sm:text-[11px] relative z-10"
        style={{ color: 'var(--text-3)' }}>{sub}</p>
    </motion.div>
  )
}

/* ── Hero image card ── */
function HeroCard() {
  const now   = new Date()
  const day   = now.getDate().toString().padStart(2, '0')
  const month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const year  = now.getFullYear()
  return (
    <motion.div
      {...fadeUp(0.1)}
      whileHover={{ scale: 1.025, transition: { duration: 0.3 } }}
      className="relative overflow-hidden rounded-2xl flex-shrink-0 w-full sm:w-[240px] lg:w-[260px] h-[160px] sm:h-[185px]"
      style={{ border: '1px solid var(--border)' }}
    >
      <img src={HERO_IMG} alt="AI" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
      {/* glass overlay */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
      {/* inner shine */}
      <div className="absolute inset-0 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)' }} />

      {/* date badge */}
      <div className="absolute bottom-3 left-3 rounded-xl px-3 py-2"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <p className="text-xl sm:text-2xl font-light leading-none text-white">{day}</p>
        <p className="text-[8px] sm:text-[9px] tracking-widest uppercase mt-0.5 text-white/60">{month} {year}</p>
      </div>

      {/* live badge */}
      <motion.div
        animate={{ opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[10px] text-white/80">Live</span>
      </motion.div>
    </motion.div>
  )
}

/* ── Capability card ── */
function CapabilityCard({ img, title, desc, tag, delay }: {
  img: string; title: string; desc: string; tag: string; delay: number
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ duration: 0.25 }}
      className="glass glass-shine rounded-2xl overflow-hidden flex flex-col cursor-default relative"
    >
      {/* image */}
      <div className="relative h-28 sm:h-32 overflow-hidden flex-shrink-0">
        <motion.img
          src={img} alt={title}
          className="w-full h-full object-cover"
          style={{ opacity: 0.55 }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--bg) 100%)' }} />
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="absolute top-2.5 left-2.5 text-[9px] uppercase tracking-widest text-white px-2.5 py-0.5 rounded-full font-semibold"
          style={{ background: 'var(--accent)', boxShadow: '0 2px 8px var(--glow)' }}
        >
          {tag}
        </motion.span>
      </div>
      <div className="p-3.5 flex flex-col gap-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{desc}</p>
      </div>
      {/* bottom accent line */}
      <div className="absolute bottom-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent-light), transparent)', opacity: 0.3 }} />
    </motion.div>
  )
}

/* ── Floating particles behind the page ── */
function FloatingOrbs() {
  return (
    <>
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none fixed top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: 'var(--accent)', zIndex: 0 }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], opacity: [0.04, 0.09, 0.04] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="pointer-events-none fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: 'var(--accent-light)', zIndex: 0 }}
      />
    </>
  )
}

/* ── Page ── */
export default function Dashboard() {
  const navigate   = useNavigate()
  const [greeting] = useState(getGreeting())
  const [dateStr]  = useState(formatDate(new Date()))
  const { messages } = useChat()

  // Build recent chats from real history — only user messages, newest first, deduplicated
  const recentChats = messages
    .filter((m) => m.role === 'user')
    .slice()
    .reverse()
    .slice(0, 5)

  const stats = [
    { icon: TbTargetArrow, label: 'Active Goals',  value: 0, sub: '0 total tasks', accent: '#8b5cf6' },
    { icon: TbShieldCheck, label: 'Blocked Tasks', value: 0, sub: '0 completed',   accent: '#ef4444' },
    { icon: TbCircleCheck, label: 'Completed',     value: 0, sub: '0% of total',   accent: '#10b981' },
    { icon: BiTrendingUp,  label: 'Messages',      value: messages.length, sub: 'total sent', accent: '#0ea5e9' },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen p-4 sm:p-6 lg:p-7 flex flex-col gap-5 sm:gap-6 relative">
        <FloatingOrbs />

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-3)' }}>{dateStr}</p>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              {greeting}.
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-3)' }}>
              Your AI is online and ready to assist.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <button className="btn-outline text-xs sm:text-sm">Sign in</button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chat')}
              className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <RiSparklingLine className="text-base" /> New Chat
            </motion.button>
          </div>
        </motion.div>

        {/* ── Top row ── */}
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <HeroCard />

          {/* donut */}
          <motion.div {...fadeUp(0.15)}
            className="glass glass-shine flex flex-col items-center justify-center gap-3 px-5 sm:px-8 py-5 flex-shrink-0 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />
            <DonutRing percent={0} />
            <p className="text-[10px] uppercase tracking-widest relative z-10" style={{ color: 'var(--text-3)' }}>
              Progress
            </p>
          </motion.div>

          {/* stats */}
          <motion.div variants={staggerList} initial="initial" animate="animate"
            className="flex-1 grid grid-cols-2 gap-3">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </motion.div>
        </div>

        {/* ── Capability cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <CapabilityCard img={CARD_IMG_1} title="AI-Powered Coding"
            desc="Write, debug, and refactor code with full tool access — shell, files, and more."
            tag="Core" delay={0.18} />
          <CapabilityCard img={CARD_IMG_2} title="Autonomous Agents"
            desc="Chain multi-step tasks using DeepSeek's reasoning engine with zero friction."
            tag="Agents" delay={0.26} />
        </div>

        {/* ── Bottom panels ── */}
        <div className="flex flex-col lg:flex-row gap-4 relative z-10">

          {/* Activity panel */}
          <motion.div {...fadeUp(0.28)}
            className="glass glass-shine flex-1 flex flex-col p-4 sm:p-5 gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'var(--accent)', opacity: 0.06 }} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-light)' }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--text-3)' }}>AI Activity</span>
              </div>
              <motion.button whileHover={{ x: 2 }}
                onClick={() => navigate('/activity')}
                className="flex items-center gap-1 text-[11px] transition-colors"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
                Full log <RiArrowRightLine />
              </motion.button>
            </div>

            {/* next action */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-xl p-3 relative overflow-hidden"
              style={{ border: '1px solid var(--accent-bg)', background: 'var(--accent-bg)' }}>
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
              <p className="text-[9px] font-semibold uppercase tracking-widest mb-1 relative z-10"
                style={{ color: 'var(--accent-light)' }}>Next Action</p>
              <p className="text-sm relative z-10" style={{ color: 'var(--text-2)' }}>
                Start a conversation to activate the agent
              </p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4 text-center">
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <RiRobot2Line className="text-4xl" style={{ color: 'var(--text-3)' }} />
              </motion.div>
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>No activity yet.</p>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                onClick={() => navigate('/chat')} className="btn-primary text-xs mt-1">
                Open Chat
              </motion.button>
            </div>
          </motion.div>

          {/* Recent chats panel */}
          <motion.div {...fadeUp(0.36)}
            className="glass glass-shine flex-1 flex flex-col p-4 sm:p-5 gap-4 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'var(--accent-light)', opacity: 0.05 }} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiOutlineLightningBolt style={{ color: 'var(--accent-light)', fontSize: 14 }} />
                <span className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--text-3)' }}>Recent Chats</span>
              </div>
              <motion.button whileHover={{ x: 2 }}
                onClick={() => navigate('/chat')}
                className="flex items-center gap-1 text-[11px] transition-colors"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
                Open <RiArrowRightLine />
              </motion.button>
            </div>

            {recentChats.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
                <RiChat3Line className="text-3xl" style={{ color: 'var(--text-3)' }} />
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>No chats yet.</p>
                <p className="text-xs" style={{ color: 'var(--text-3)', opacity: 0.6 }}>
                  Start a conversation and it'll appear here.
                </p>
              </div>
            ) : (
              <motion.ul variants={staggerList} initial="initial" animate="animate"
                className="flex flex-col gap-1 flex-1">
                {recentChats.map((c) => (
                  <motion.li key={c.id}
                    variants={listItem}
                    whileHover={{ x: 3, backgroundColor: 'var(--surface-hover)' }}
                    onClick={() => navigate('/chat')}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                    style={{ background: 'transparent' }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--accent-bg)' }}>
                      {c.role === 'user'
                        ? <RiUser3Line className="text-sm" style={{ color: 'var(--accent-light)' }} />
                        : <RiCodeSSlashLine className="text-sm" style={{ color: 'var(--accent-light)' }} />
                      }
                    </div>
                    <p className="flex-1 text-sm line-clamp-1 min-w-0" style={{ color: 'var(--text-2)' }}>
                      {c.content}
                    </p>
                    <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-3)' }}>
                      {timeAgo(new Date(c.timestamp))}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            )}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/chat')}
              className="btn-outline flex items-center justify-center gap-2 text-xs w-full mt-auto">
              <RiChat3Line /> Start new chat
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
