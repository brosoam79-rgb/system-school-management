import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine, RiUserLine, RiBookOpenLine,
  RiCalendarCheckLine, RiBarChartLine, RiSettings3Line,
  RiGraduationCapLine, RiLogoutBoxLine, RiMenuLine
} from 'react-icons/ri'
import { getSessionUser, isAdminUser } from '../../utils/session'

const links = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/students', icon: RiUserLine, label: 'Students' },
  { to: '/classes', icon: RiBookOpenLine, label: 'Classes' },
  { to: '/attendance', icon: RiCalendarCheckLine, label: 'Attendance' },
  { to: '/reports', icon: RiBarChartLine, label: 'Reports' },
  { to: '/settings', icon: RiSettings3Line, label: 'Settings' },
]

export default function Sidebar({ collapsed, onToggle, sidebarOpen, onClose }) {
  const navigate = useNavigate()
  const isAdmin = isAdminUser(getSessionUser())
  const visibleLinks = links.filter(link => link.to !== '/settings' || isAdmin)

  const handleLogout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
    {sidebarOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 bg-slate-950/40 z-40 md:hidden" />}
    <aside className={`fixed left-0 top-0 h-full bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-60'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <RiGraduationCapLine size={18} />
        </div>
        {!collapsed && <span className="font-semibold text-base tracking-tight">EduManage</span>}
        <button onClick={onToggle} className="ml-auto hidden md:block p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          <RiMenuLine size={18} />
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Main Menu</p>
        </div>
      )}

      <nav className="flex-1 py-2 overflow-y-auto">
        {visibleLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-150 ${isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
          title={collapsed ? 'Logout' : undefined}
        >
          <RiLogoutBoxLine size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
    </>
  )
}
