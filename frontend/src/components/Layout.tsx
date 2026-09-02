import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Activity,
  Settings,
  Zap,
  ChevronLeft,
  Clock,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Chat', icon: MessageSquare, to: '/chat' },
  { label: 'AI Activity', icon: Activity, to: '/activity' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cream-100">
      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col justify-between bg-cream-100 border-r border-cream-300 transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-52'
        }`}
      >
        {/* Top */}
        <div className="flex flex-col gap-5 p-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-white" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-gray-900 text-sm tracking-tight">
                GenZpt AI
              </span>
            )}
          </div>

          {/* Workspace label */}
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2">
              Workspace
            </p>
          )}

          {/* Nav */}
          <nav className="flex flex-col gap-0.5">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom status card */}
        <div className="p-3 flex flex-col gap-2">
          {!collapsed && (
            <div className="card p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center">
                  <Clock size={13} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Tasks Status
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 pl-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  0 Blocked
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                  0 Overdue
                </div>
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item justify-center w-full"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              size={15}
              className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
