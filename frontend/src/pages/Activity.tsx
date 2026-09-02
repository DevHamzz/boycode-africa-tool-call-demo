import { Bot, Terminal, FileText, Folder, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SAMPLE_LOGS = [
  {
    id: 1,
    type: 'tool',
    icon: Terminal,
    label: 'Ran command',
    detail: 'npm install express cors',
    time: '2m ago',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    id: 2,
    type: 'file',
    icon: FileText,
    label: 'Wrote file',
    detail: 'server.ts',
    time: '3m ago',
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    id: 3,
    type: 'file',
    icon: Folder,
    label: 'Listed directory',
    detail: './',
    time: '3m ago',
    color: 'text-amber-500 bg-amber-50',
  },
  {
    id: 4,
    type: 'ai',
    icon: Bot,
    label: 'AI responded',
    detail: 'Explained how to set up an Express server',
    time: '4m ago',
    color: 'text-brand-purple bg-brand-purple/10',
  },
]

export default function Activity() {
  const navigate = useNavigate()

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-gray-900">AI Activity</h1>
          <p className="text-sm text-gray-400 mt-1">
            Full log of everything GenZpt AI has done this session.
          </p>
        </div>
        <button
          onClick={() => navigate('/chat')}
          className="btn-primary flex items-center gap-1.5"
        >
          New Chat <ArrowRight size={14} />
        </button>
      </div>

      {/* Log list */}
      <div className="card p-1 flex flex-col divide-y divide-cream-200">
        {SAMPLE_LOGS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Bot size={32} className="text-gray-300" />
            <p className="text-sm text-gray-400">No activity yet. Start chatting!</p>
          </div>
        ) : (
          SAMPLE_LOGS.map((log) => {
            const Icon = log.icon
            return (
              <div
                key={log.id}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-cream-50 transition-colors rounded-xl"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${log.color}`}
                >
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">{log.label}</p>
                  <p className="text-xs text-gray-400 truncate">{log.detail}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{log.time}</span>
              </div>
            )
          })
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Actions', value: SAMPLE_LOGS.length },
          { label: 'Files Touched', value: 2 },
          { label: 'Commands Run', value: 1 },
        ].map((s) => (
          <div key={s.label} className="card p-5 flex flex-col items-center gap-1">
            <p className="text-3xl font-light text-gray-800">{s.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
