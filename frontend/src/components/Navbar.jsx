import { Link, useLocation } from 'react-router-dom'
import { Building2, LayoutDashboard, Users, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV_LINKS = [
  { to: '/', label: 'Catálogo', icon: <Building2 size={16} /> },
  { to: '/comercial', label: 'Comerciales', icon: <Users size={16} /> },
  { to: '/admin', label: 'Admin', icon: <LayoutDashboard size={16} /> },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-sky-400 font-bold text-xl">
          <Building2 size={28} />
          <span>InmoAlicante</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === l.to
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {l.icon}
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <ul className="md:hidden border-t border-slate-700 px-4 py-3 flex flex-col gap-2 bg-slate-900">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="flex items-center gap-2 text-slate-300 hover:text-white py-2"
                onClick={() => setOpen(false)}
              >
                {l.icon}
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
