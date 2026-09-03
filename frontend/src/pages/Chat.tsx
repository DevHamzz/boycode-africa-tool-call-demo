import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiSendPlaneFill, RiSparklingLine, RiRobot2Line, RiUser3Line,
  RiDeleteBin6Line, RiFileCopyLine, RiCheckLine, RiLoader4Line,
  RiLightbulbLine, RiCodeSSlashLine, RiGlobalLine, RiTerminalBoxLine,
} from 'react-icons/ri'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  error?: boolean
}

const SUGGESTIONS = [
  { icon: RiCodeSSlashLine,  text: 'Explain async/await in JavaScript',    color: 'text-violet-400' },
  { icon: RiRobot2Line,      text: 'Write a Python function to sort a list', color: 'text-sky-400' },
  { icon: RiGlobalLine,      text: 'Best practices for REST API design',    color: 'text-emerald-400' },
  { icon: RiTerminalBoxLine, text: 'How do I list all running processes?',  color: 'text-amber-400' },
]

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <motion.button whileTap={{ scale: 0.85 }}
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1800) }}
      className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg"
      style={{ color: 'var(--text-3)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
      {ok ? <RiCheckLine className="text-emerald-400 text-sm" /> : <RiFileCopyLine className="text-sm" />}
    </motion.button>
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2 sm:gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}
        style={{
          background: isUser ? 'var(--surface-hover)' : 'var(--accent-bg)',
          border: `1px solid ${isUser ? 'var(--border)' : 'var(--accent-bg)'}`,
          color: isUser ? 'var(--text-2)' : 'var(--accent-light)',
        }}>
        {isUser ? <RiUser3Line className="text-xs sm:text-sm" /> : <RiRobot2Line className="text-xs sm:text-sm" />}
      </div>

      {/* Bubble content */}
      <div className={`flex flex-col gap-1 max-w-[80%] sm:max-w-[74%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser ? 'rounded-tr-sm' : msg.error ? 'rounded-tl-sm' : 'rounded-tl-sm glass'
        }`}
          style={
            isUser
              ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--glow)' }
              : msg.error
              ? { background: 'rgba(220,38,38,0.12)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.25)' }
              : { color: 'var(--text)' }
          }>
          {msg.content}
        </div>
        <div className={`flex items-center gap-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{formatTime(msg.timestamp)}</span>
          {!isUser && <CopyBtn text={msg.content} />}
        </div>
      </div>
    </motion.div>
  )
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }} className="flex gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-bg)', color: 'var(--accent-light)' }}>
        <RiRobot2Line className="text-sm" />
      </div>
      <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: 'var(--accent-light)', animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </motion.div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onSuggest }: { onSuggest: (t: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 h-full pt-10 sm:pt-16 px-2">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 text-center">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-bg)', boxShadow: '0 8px 32px var(--glow)' }}>
          <RiSparklingLine className="text-3xl sm:text-4xl" style={{ color: 'var(--accent-light)' }} />
        </motion.div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>How can I help?</h3>
          <p className="text-sm mt-1.5 max-w-xs sm:max-w-sm" style={{ color: 'var(--text-3)' }}>
            Ask me anything — code, shell commands, files, explanations, or ideas.
          </p>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xs sm:max-w-xl">
        {SUGGESTIONS.map(({ icon: Icon, text, color }) => (
          <motion.button key={text}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => onSuggest(text)}
            className="glass glass-hover text-left p-4 rounded-xl flex flex-col gap-2.5">
            <Icon className={`text-xl ${color}`} />
            <span className="text-sm leading-snug" style={{ color: 'var(--text-3)' }}>{text}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef   = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed, timestamp: new Date() }
    setMessages((p) => [...p, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setMessages((p) => [...p, {
        id: crypto.randomUUID(), role: 'assistant',
        content: data.reply ?? 'No response.', timestamp: new Date(),
      }])
    } catch (err) {
      setMessages((p) => [...p, {
        id: crypto.randomUUID(), role: 'assistant',
        content: `Something went wrong: ${(err as Error).message}. Make sure the API server is running on port 3001.`,
        timestamp: new Date(), error: true,
      }])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }, [messages, loading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }
  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] md:h-screen">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 right-0 w-[300px] sm:w-[400px] h-[250px] rounded-full blur-[100px]"
        style={{ background: 'var(--glow)', opacity: 0.12 }} />

      {/* Top bar */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 sm:px-7 py-3 sm:py-4 sticky top-0 z-10 backdrop-blur-xl"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--sidebar-bg)' }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-bg)', color: 'var(--accent-light)' }}>
            <RiRobot2Line className="text-sm sm:text-base" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text)' }}>GenZpt AI</p>
            <p className="text-[9px] sm:text-[10px]" style={{ color: 'var(--text-3)' }}>Powered by DeepSeek</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {!isEmpty && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMessages([])}
                className="btn-ghost flex items-center gap-1.5 text-xs px-2 sm:px-3 hover:text-red-400">
                <RiDeleteBin6Line /> <span className="hidden sm:inline">Clear</span>
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1.5 text-[11px] glass px-2 sm:px-2.5 py-1.5 rounded-lg"
            style={{ color: '#34d399' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            <span className="hidden sm:inline">Online</span>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-7 py-4 sm:py-6">
        {isEmpty ? (
          <div className="max-w-2xl mx-auto h-full">
            <EmptyState onSuggest={sendMessage} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-4 sm:gap-5">
            {messages.map((m) => <Bubble key={m.id} msg={m} />)}
            <AnimatePresence>{loading && <TypingIndicator />}</AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="px-3 sm:px-7 py-3 sm:py-4 backdrop-blur-xl"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--sidebar-bg)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 sm:gap-3 glass rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all"
            style={{ ['--focus-border' as string]: 'var(--accent)' }}>
            <RiLightbulbLine className="text-lg flex-shrink-0 mb-0.5 hidden sm:block"
              style={{ color: 'var(--text-3)' }} />
            <textarea ref={textareaRef} rows={1} value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} disabled={loading}
              placeholder="Ask GenZpt AI anything…"
              className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
              style={{
                color: 'var(--text)',
                minHeight: '24px', maxHeight: '160px',
              }}
            />
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
              style={{ background: 'var(--accent)', boxShadow: '0 4px 16px var(--glow)' }}>
              {loading
                ? <RiLoader4Line className="text-sm animate-spin" />
                : <RiSendPlaneFill className="text-sm" />}
            </motion.button>
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: 'var(--text-3)' }}>
            GenZpt AI can make mistakes — verify important info.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
