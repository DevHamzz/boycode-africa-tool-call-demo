import { Outlet, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiChat3Line, RiPulseLine,
  RiSettings4Line, RiMenu3Line, RiCloseLine,
} from 'react-icons/ri'
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb'
import { MdOutlineCircle } from 'react-icons/md'
import DevHamzBg from './DevHamzBg'
import Logo from './Logo'
import ThemeSwitcher from './ThemeSwitcher'

const navItems = [
  { label: 'Dashboard', icon: RiDashboardLine, to: '/dashboard' },
  { label: 'Chat',      icon: RiChat3Line,     to: '/chat' },
  { label: 'Activity',  icon: RiPulseLine,     to: '/activity' },
  { label: 'Settings',  icon: RiSettings4Line, to: '/settings' },
]

// ── Sidebar inner content ─────────────────────────────────────────────────────
function SidebarContent({
  collapsed,
  onNavClick,
}: {
  collapsed: boolean
  onNavClick?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className={`flex items-center gap-2.5 px-3 pt-4 pb-3 ${collapsed ? 'justify-center' : ''}`}>
        <motion.div
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          className="flex-shrink-0"
        >
          <Logo size={collapsed ? 30 : 34} />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col leading-none"
            >
              <span className="font-extrabold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
                GenZpt
              </span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--accent-light)' }}>
                AI Platform
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* divider */}
      <div className="mx-3 mb-3" style={{ height: '1px', background: 'var(--border)' }} />

      {/* ── Nav label ── */}
      {!collapsed && (
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] px-4 mb-2"
          style={{ color: 'var(--text-3)' }}>
          Navigation
        </p>
      )}

      {/* ── Nav links ── */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {navItems.map(({ label, icon: Icon, to }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
          >
            <NavLink
              to={to}
              title={collapsed ? label : undefined}
              onClick={onNavClick}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Icon className="text-lg flex-shrink-0" style={{ color: 'inherit' }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* ── divider ── */}
      <div className="mx-3 my-3" style={{ height: '1px', background: 'var(--border)' }} />

      {/* ── Theme switcher ── */}
      <ThemeSwitcher collapsed={collapsed} />

      {/* ── divider ── */}
      <div className="mx-3 mt-3 mb-2" style={{ height: '1px', background: 'var(--border)' }} />

      {/* ── Status card ── */}
      <div className="px-3 pb-2">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-xl p-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot" />
                <span className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-2)' }}>
                  System Online
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'Blocked', dot: 'text-red-400' },
                  { label: 'Pending', dot: 'text-amber-400' },
                ].map(({ label, dot }) => (
                  <div key={label} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-3)' }}>
                      <MdOutlineCircle className={`${dot} text-xs`} /> {label}
                    </span>
                    <span className="font-medium" style={{ color: 'var(--text-2)' }}>0</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function Layout() {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-grid relative"
      style={{ background: 'var(--bg)' }}>

      {/* ── DevHamz watermark ── */}
      <DevHamzBg />

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed top-0 left-0 h-full w-[220px] z-40 flex flex-col justify-between sidebar-themed md:hidden overflow-y-auto"
          >
            <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--accent) 10%, transparent), transparent)' }} />
            <div className="flex-1">
              <SidebarContent collapsed={false} onNavClick={() => setMobileOpen(false)} />
            </div>
            <button onClick={() => setMobileOpen(false)}
              className="nav-item justify-center m-3">
              <RiCloseLine className="text-xl" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 220 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="hidden md:flex flex-col relative sidebar-themed flex-shrink-0 z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--accent) 10%, transparent), transparent)' }} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarContent collapsed={collapsed} />
        </div>
        <div className="p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item justify-center w-full"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed
              ? <TbLayoutSidebarRightCollapse className="text-lg" />
              : <TbLayoutSidebarLeftCollapse className="text-lg" />
            }
          </button>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--sidebar-bg)' }}>
          <button onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-2)' }}>
            <RiMenu3Line className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <span className="font-extrabold text-sm" style={{ color: 'var(--text)' }}>GenZpt</span>
            <span className="text-sm font-light" style={{ color: 'var(--accent-light)' }}>AI</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
