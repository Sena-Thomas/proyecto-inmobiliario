import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Building2, LayoutDashboard, Menu, X, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
          <Building2 size={28} />
          <span>Inmobiliaria Mónica</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Building2 size={16} /> Catálogo
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <span className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                  <ShieldCheck size={12} /> Admin
                </span>
              )}
              <span className="text-slate-400 text-sm hidden lg:block">{user.nombre}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <LogOut size={16} /> Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <LogIn size={16} /> Iniciar sesión
            </Link>
          )}
        </div>

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
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-300 hover:text-white py-2"
              onClick={() => setOpen(false)}
            >
              <Building2 size={16} /> Catálogo
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-2 text-slate-300 hover:text-white py-2"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard size={16} /> Admin
              </Link>
            </li>
          )}
          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-300 hover:text-white py-2 w-full"
              >
                <LogOut size={16} /> Cerrar sesión ({user.nombre})
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 py-2"
                onClick={() => setOpen(false)}
              >
                <LogIn size={16} /> Iniciar sesión
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  )
}
