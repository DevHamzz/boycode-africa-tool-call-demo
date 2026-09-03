import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RiSaveLine, RiEyeLine, RiEyeOffLine, RiRobot2Line,
  RiSettings4Line, RiShieldCheckLine, RiTerminalBoxLine,
} from 'react-icons/ri'
import { HiOutlineLightningBolt } from 'react-icons/hi'

const AVATAR_IMG = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80&auto=format&fit=crop'

interface SettingItem {
  id: string; label: string; desc: string
  type: 'select' | 'toggle' | 'text'; options?: string[]
}

const SETTINGS: SettingItem[] = [
  { id: 'model',     label: 'AI Model',      desc: 'DeepSeek model used for all responses.',     type: 'select', options: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'] },
  { id: 'streaming', label: 'Streaming',     desc: 'Show output word-by-word as it arrives.',    type: 'toggle' },
  { id: 'toolCalls', label: 'Tool Calls',    desc: 'Allow AI to run commands and manage files.', type: 'toggle' },
  { id: 'sysPrompt', label: 'System Prompt', desc: 'Custom instructions for every session.',     type: 'text' },
]

// ── Animated toggle ───────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={onToggle}
      className="relative w-10 h-[22px] rounded-full transition-all flex-shrink-0"
      style={{
        background: on ? 'var(--accent)' : 'var(--surface-hover)',
        border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
      }}>
      <motion.span animate={{ x: on ? 18 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-[17px] h-[17px] rounded-full bg-white shadow-sm block" />
    </button>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const iconMap: Record<string, React.ElementType> = {
  model: RiRobot2Line,
  streaming: RiSettings4Line,
  toolCalls: RiTerminalBoxLine,
  sysPrompt: RiShieldCheckLine,
}
const iconColor: Record<string, string> = {
  model: 'var(--accent-light)',
  streaming: '#38bdf8',
  toolCalls: '#34d399',
  sysPrompt: '#fbbf24',
}

export default function Settings() {
  const [values, setValues] = useState<Record<string, string | boolean>>({
    model: 'deepseek-chat', streaming: false, toolCalls: true, sysPrompt: '',
  })
  const [showKey, setShowKey] = useState(false)
  const [saved,   setSaved]   = useState(false)

  const set  = (id: string, v: string | boolean) => setValues((p) => ({ ...p, [id]: v }))
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-7 flex flex-col gap-5 sm:gap-7 max-w-2xl">
      {/* Ambient */}
      <div className="pointer-events-none fixed top-0 right-0 w-[300px] h-[250px] rounded-full blur-[100px]"
        style={{ background: 'var(--glow)', opacity: 0.1 }} />

      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-3)' }}>Configuration</p>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Configure your GenZpt AI environment.</p>
      </motion.div>

      {/* Profile card */}
      <motion.div {...fadeUp(0.08)} className="glass flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
        <img src={AVATAR_IMG} alt="avatar"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0"
          style={{ border: '1px solid var(--border)' }} />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>DevHamz</p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>Free plan · GenZpt AI</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="btn-outline text-xs ml-auto flex-shrink-0">Sign In</motion.button>
      </motion.div>

      {/* API key */}
      <motion.div {...fadeUp(0.15)} className="glass p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <HiOutlineLightningBolt style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>DeepSeek API Key</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>
          Stored in your{' '}
          <code className="px-1.5 py-0.5 rounded text-xs"
            style={{ background: 'var(--surface-hover)', color: 'var(--text-2)' }}>.env</code>{' '}
          file. Never transmitted anywhere except the DeepSeek API.
        </p>
        <div className="flex items-center gap-2">
          <input type={showKey ? 'text' : 'password'} placeholder="sk-••••••••••••••••"
            className="flex-1 text-sm rounded-xl px-3 py-2 outline-none transition-colors min-w-0"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }} />
          <button onClick={() => setShowKey(!showKey)}
            className="p-2 sm:p-2.5 rounded-xl transition-colors flex-shrink-0"
            style={{ border: '1px solid var(--border)', color: 'var(--text-3)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}>
            {showKey ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>
      </motion.div>

      {/* Settings list */}
      <motion.div {...fadeUp(0.22)} className="glass overflow-hidden">
        {SETTINGS.map((s, i) => {
          const Icon = iconMap[s.id]
          return (
            <motion.div key={s.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.28 + i * 0.06 }}
              className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 transition-colors"
              style={{ borderBottom: i !== SETTINGS.length - 1 ? '1px solid var(--border)' : 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>

              {/* Label + icon */}
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--surface-hover)' }}>
                  <Icon className="text-xs sm:text-sm" style={{ color: iconColor[s.id] }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.label}</p>
                  <p className="text-xs mt-0.5 hidden sm:block" style={{ color: 'var(--text-3)' }}>{s.desc}</p>
                </div>
              </div>

              {/* Control */}
              {s.type === 'select' && (
                <select value={values[s.id] as string} onChange={(e) => set(s.id, e.target.value)}
                  className="text-xs sm:text-sm rounded-xl px-2 sm:px-3 py-1.5 outline-none cursor-pointer flex-shrink-0"
                  style={{
                    background: 'var(--surface-hover)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}>
                  {s.options?.map((o) => (
                    <option key={o} value={o} style={{ background: 'var(--bg-2)', color: 'var(--text)' }}>{o}</option>
                  ))}
                </select>
              )}
              {s.type === 'toggle' && (
                <Toggle on={values[s.id] as boolean} onToggle={() => set(s.id, !values[s.id])} />
              )}
              {s.type === 'text' && (
                <input type="text" value={values[s.id] as string} onChange={(e) => set(s.id, e.target.value)}
                  placeholder="Enter value…"
                  className="text-xs sm:text-sm rounded-xl px-2 sm:px-3 py-1.5 outline-none transition-colors w-28 sm:w-48 flex-shrink-0"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }} />
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Save */}
      <motion.button {...fadeUp(0.45)}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
        onClick={save} className="btn-primary self-start flex items-center gap-2">
        <motion.span animate={saved ? { rotate: 360 } : {}} transition={{ duration: 0.4 }}>
          <RiSaveLine />
        </motion.span>
        {saved ? 'Saved ✓' : 'Save Settings'}
      </motion.button>
    </div>
  )
}
