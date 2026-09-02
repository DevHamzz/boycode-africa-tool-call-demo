import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  ShieldAlert,
  CheckCircle2,
  Activity,
  ArrowRight,
  Sparkles,
  Bot,
} from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// ── sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub: string
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-1 py-6 px-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="text-5xl font-light text-gray-800 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

function DonutCard({ percent }: { percent: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = (percent / 100) * circ

  return (
    <div className="card flex flex-col items-center justify-center gap-2 py-8 px-6 min-w-[160px]">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="#eeede6"
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="#7c6ff7"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-light text-gray-800">{percent}%</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            Done
          </span>
        </div>
      </div>
    </div>
  )
}

function HeroBanner() {
  const now = new Date()
  const day = now.getDate().toString().padStart(2, '0')
  const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
  const year = now.getFullYear()

  return (
    <div
      className="rounded-2xl overflow-hidden relative flex-shrink-0"
      style={{ width: 220, height: 160 }}
    >
      {/* gradient sky background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #1a2a4a 0%, #2d4a7a 40%, #3a5f8a 60%, #6b8fa8 80%, #8fafb8 100%)',
        }}
      />

      {/* stars */}
      {[
        [30, 18], [55, 12], [80, 22], [140, 10], [170, 25],
        [100, 35], [45, 40], [160, 38], [190, 15],
      ].map(([x, y], i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-70"
          style={{ left: x, top: y }}
        />
      ))}

      {/* moon */}
      <div
        className="absolute w-10 h-10 rounded-full opacity-90"
        style={{
          right: 38,
          top: 14,
          background: 'radial-gradient(circle at 35% 35%, #fffde7, #f5e880)',
          boxShadow: '0 0 18px 6px rgba(255,240,100,0.25)',
        }}
      />

      {/* rolling hills */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 220 70"
        preserveAspectRatio="none"
      >
        <path d="M0,70 Q55,30 110,50 Q165,70 220,40 L220,70 Z" fill="#3a6b4a" opacity="0.9" />
        <path d="M0,70 Q40,45 90,60 Q140,75 220,55 L220,70 Z" fill="#2d5a3a" />
      </svg>

      {/* date overlay card */}
      <div
        className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg"
      >
        <p className="text-3xl font-light text-gray-800 leading-none">{day}</p>
        <p className="text-[9px] tracking-widest text-gray-500 uppercase mt-0.5">
          {month} {year}
        </p>
      </div>
    </div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [greeting] = useState(getGreeting())
  const [dateStr] = useState(formatDate(new Date()))
  const [recentChats] = useState([
    { id: 1, text: 'Explain how promises work in JavaScript', time: '2m ago' },
    { id: 2, text: 'Write a Python script to parse JSON files', time: '18m ago' },
    { id: 3, text: 'How do I set up a REST API with Express?', time: '1h ago' },
  ])

  const stats = [
    { label: 'Active Goals', value: 0, sub: '0 total tasks', icon: Target },
    { label: 'Blocked Tasks', value: 0, sub: '0 completed', icon: ShieldAlert },
    { label: 'Completed Tasks', value: 0, sub: '0% of total', icon: CheckCircle2 },
  ]

  return (
    <div className="p-8 flex flex-col gap-6 min-h-screen">
      {/* ── Header row ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900">{greeting}.</h1>
          <p className="text-sm text-gray-400 mt-1">
            Here's what's happening with your AI today.
          </p>
          <p className="text-xs text-gray-300 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline">Log In</button>
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            New Chat
          </button>
        </div>
      </div>

      {/* ── Top cards row ── */}
      <div className="flex gap-4">
        {/* Hero banner */}
        <HeroBanner />

        {/* Donut */}
        <DonutCard percent={0} />

        {/* Stats */}
        <div className="flex-1 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
          ))}
        </div>
      </div>

      {/* ── Bottom panels row ── */}
      <div className="flex gap-4 flex-1">
        {/* AI Activity panel */}
        <div className="card flex-1 flex flex-col p-5 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                AI Activity
              </span>
            </div>
            <button
              onClick={() => navigate('/activity')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-purple transition-colors"
            >
              Full log <ArrowRight size={12} />
            </button>
          </div>

          {/* Next action hint */}
          <div className="rounded-xl border border-cream-300 bg-cream-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Next Planned Action
            </p>
            <p className="text-sm text-gray-700">
              Start a conversation to activate the AI agent
            </p>
          </div>

          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-6">
            <Bot size={28} className="text-gray-300" />
            <p className="text-sm text-gray-400">
              No activity yet. Start a chat to get going.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="btn-primary mt-2 text-xs"
            >
              Open Chat
            </button>
          </div>
        </div>

        {/* Recent chats / Goals panel */}
        <div className="card flex-1 flex flex-col p-5 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Recent Chats
            </span>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-purple transition-colors"
            >
              Go to chat <ArrowRight size={12} />
            </button>
          </div>

          {recentChats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
              <Activity size={28} className="text-gray-300" />
              <p className="text-sm text-gray-400">No recent chats yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {recentChats.map((c) => (
                <li
                  key={c.id}
                  onClick={() => navigate('/chat')}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-cream-100 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-brand-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageIcon />
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">
                      {c.text}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                    {c.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c6ff7" strokeWidth="2.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
