import { motion } from 'framer-motion'
import { useTheme, type Theme } from '../context/ThemeContext'
import { BsSun, BsMoon } from 'react-icons/bs'
import { MdWaterDrop } from 'react-icons/md'
import { RiVipDiamondLine } from 'react-icons/ri'

interface ThemeOption {
  id: Theme
  label: string
  icon: React.ElementType
  dot: string     // tailwind bg colour for the swatch dot
  ring: string    // ring colour on active
}

const OPTIONS: ThemeOption[] = [
  { id: 'dark', label: 'Dark', icon: BsMoon, dot: 'bg-zinc-700', ring: 'ring-zinc-500' },
  { id: 'light', label: 'Light', icon: BsSun, dot: 'bg-zinc-200', ring: 'ring-zinc-400' },
  { id: 'blue', label: 'Ocean', icon: MdWaterDrop, dot: 'bg-sky-500', ring: 'ring-sky-400' },
  { id: 'purple', label: 'Nebula', icon: RiVipDiamondLine, dot: 'bg-violet-500', ring: 'ring-violet-400' },
]

export default function ThemeSwitcher({ collapsed }: { collapsed: boolean }) {
  // Read and update the shared theme so every page changes together.
  const { theme, setTheme } = useTheme()

  return (
    <div className="px-3 pb-1">
      {!collapsed && (
        <p
          className="text-[9px] font-semibold uppercase tracking-[0.15em] px-1 mb-2"
          style={{ color: 'var(--text-3)' }}
        >
          Theme
        </p>
      )}

      <div className={`flex ${collapsed ? 'flex-col items-center gap-1.5' : 'flex-wrap gap-1.5'}`}>
        {OPTIONS.map(({ id, label, icon: Icon, dot, ring }) => {
          const active = theme === id
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setTheme(id)}
              title={label}
              className={`flex items-center gap-1.5 rounded-lg transition-all duration-200
                ${collapsed
                  ? 'w-8 h-8 justify-center'
                  : 'px-2 py-1.5 flex-1 min-w-[calc(50%-4px)]'
                }
                ${active
                  ? `ring-1 ${ring} bg-[var(--surface-hover)]`
                  : 'hover:bg-[var(--surface-hover)]'
                }
              `}
            >
              {/* colour swatch dot */}
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot} ${active ? 'ring-1 ring-white/30' : ''}`} />

              {!collapsed && (
                <>
                  <Icon
                    className="text-xs flex-shrink-0"
                    style={{ color: active ? 'var(--accent-light)' : 'var(--text-3)' }}
                  />
                  <span
                    className="text-[10px] font-medium truncate"
                    style={{ color: active ? 'var(--text)' : 'var(--text-3)' }}
                  >
                    {label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="theme-check"
                      className="ml-auto w-1 h-1 rounded-full"
                      style={{ background: 'var(--accent-light)' }}
                    />
                  )}
                </>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
