import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  error?: boolean
}

const SUGGESTIONS = [
  'Explain how async/await works in JavaScript',
  'Write a Python function to reverse a linked list',
  'What are the best practices for REST API design?',
  'How do I center a div in CSS?',
]

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-cream-200 text-gray-400 hover:text-gray-600"
      title="Copy"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isUser ? 'bg-gray-800' : 'bg-brand-purple'
        }`}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-white" />
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[72%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-gray-900 text-white rounded-tr-sm'
              : msg.error
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
              : 'bg-white text-gray-800 shadow-card rounded-tl-sm'
          }`}
        >
          {msg.content}
        </div>
        <div className={`flex items-center gap-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</span>
          {!isUser && <CopyButton text={msg.content} />}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-brand-purple flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-white shadow-card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-purple/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply ?? 'No response.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Something went wrong: ${(err as Error).message}. Make sure the API server is running on port 3001.`,
        timestamp: new Date(),
        error: true,
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }, [messages, loading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    if (messages.length === 0) return
    setMessages([])
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-screen">
      {/* ── Topbar ── */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-cream-300 bg-cream-100/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-purple flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">GenZpt AI</h2>
            <p className="text-[10px] text-gray-400">Powered by DeepSeek</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={13} />
              Clear chat
            </button>
          )}
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isEmpty ? (
          <EmptyState onSuggest={sendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div className="px-8 py-4 border-t border-cream-300 bg-cream-100/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-white rounded-2xl shadow-card px-4 py-3 focus-within:ring-2 focus-within:ring-brand-purple/30 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask GenZpt AI anything… (Shift+Enter for new line)"
              className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none leading-relaxed"
              style={{ minHeight: '24px', maxHeight: '160px' }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-brand-purple flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-purple-dark transition-colors"
            >
              {loading ? (
                <Loader2 size={14} className="text-white animate-spin" />
              ) : (
                <Send size={14} className="text-white" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            GenZpt AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onSuggest }: { onSuggest: (t: string) => void }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-full gap-8 pt-16 pb-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center">
          <Sparkles size={28} className="text-brand-purple" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">How can I help you?</h3>
        <p className="text-sm text-gray-400 text-center max-w-sm">
          Ask me anything — code, explanations, file management, shell commands, or ideas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="card text-left p-4 text-sm text-gray-600 hover:shadow-card-hover hover:text-gray-900 transition-all rounded-xl group"
          >
            <RotateCcw
              size={12}
              className="text-brand-purple mb-2 opacity-60 group-hover:opacity-100"
            />
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
