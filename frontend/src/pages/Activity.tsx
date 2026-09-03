import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiRobot2Line, RiTerminalBoxLine, RiFileTextLine, RiFolderOpenLine,
  RiArrowRightLine, RiSparklingLine,
} from 'react-icons/ri'

const LOGS = [
  { id: 1, Icon: RiTerminalBoxLine, label: 'Ran command', detail: 'npm install express cors', time: '2m ago', color: 'bg-sky-500/10 text-sky-400',      border: 'border-sky-500/20' },
  { id: 2, Icon: RiFileTextLine,    label: 'Wrote file',  detail: 'server.ts',               time: '3m ago', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' },
  { id: 3, Icon: RiFolderOpenLine,  label: 'Listed dir',  detail: './',                       time: '4m ago', color: 'bg-amber-500/10 text-amber-400',    border: 'border-amber-500/20' },
  { id: 4, Icon: RiRobot2Line,      label: 'AI replied',  detail: 'Explained Express setup',  time: '5m ago', color: 'bg-violet-500/10 text-violet-400',  border: 'border-violet-500/20' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Activity() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-7 flex flex-col gap-5 sm:gap-7">
      {/* Ambient */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[400px] h-[200px] rounded-full blur-[100px]"
        style={{ background: 'var(--glow)', opacity: 0.1 }} />

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-3)' }}>System Log</p>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>AI Activity</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Full log of everything GenZpt AI has done.</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/chat')}
          className="btn-primary flex items-center gap-1.5 self-start text-xs sm:text-sm">
          <RiSparklingLine /> New Chat
        </motion.button>
      </motion.div>

      {/* Stat cards */}
      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Total Actions', value: LOGS.length },
          { label: 'Files Touched', value: 1 },
          { label: 'Commands Run',  value: 1 },
        ].map((s) => (
          <motion.div key={s.label}
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            whileHover={{ y: -3 }}
            className="glass flex flex-col items-center py-5 sm:py-6 gap-1">
            <p className="text-2xl sm:text-3xl font-light" style={{ color: 'var(--text)' }}>{s.value}</p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-center"
              style={{ color: 'var(--text-3)' }}>{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Log table */}
      <motion.div {...fadeUp(0.2)} className="glass rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[2fr_3fr_1fr] gap-3 sm:gap-4 px-4 sm:px-5 py-2.5"
          style={{ borderBottom: '1px solid var(--border)' }}>
          {['Action', 'Detail', 'Time'].map((h, i) => (
            <span key={h} className={`text-[9px] uppercase tracking-widest font-semibold ${i === 1 ? 'hidden sm:block' : ''}`}
              style={{ color: 'var(--text-3)' }}>{h}</span>
          ))}
        </div>

        {LOGS.map((log, i) => {
          const Icon = log.Icon
          return (
            <motion.div key={log.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="grid grid-cols-[1fr_1fr] sm:grid-cols-[2fr_3fr_1fr] gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 items-center transition-colors"
              style={{ borderBottom: i !== LOGS.length - 1 ? '1px solid var(--border)' : 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${log.color} ${log.border}`}>
                  <Icon className="text-xs sm:text-sm" />
                </div>
                <span className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--text-2)' }}>
                  {log.label}
                </span>
              </div>
              <span className="hidden sm:block text-sm truncate" style={{ color: 'var(--text-3)' }}>{log.detail}</span>
              <span className="text-[10px] sm:text-[11px] text-right sm:text-left" style={{ color: 'var(--text-3)' }}>
                {log.time}
              </span>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.button {...fadeUp(0.4)}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/chat')}
        className="btn-outline self-start flex items-center gap-2 text-sm">
        Continue chatting <RiArrowRightLine />
      </motion.button>
    </div>
  )
}
