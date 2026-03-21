import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Building2, LayoutDashboard, Menu, X, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

// Named motion components (makes ESLint happy with member-expression usage)
const MotionNav = motion.nav
const MotionUl = motion.ul

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <MotionNav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#020c1b]/95 backdrop-blur-md shadow-lg shadow-[#0078d4]/10 border-b border-[#0078d4]/20'
          : 'bg-[#020c1b]/80 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0078d4] to-[#004880] flex items-center justify-center shadow-lg shadow-[#0078d4]/30 group-hover:shadow-[#0078d4]/50 transition-shadow">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white group-hover:text-[#56a4ea] transition-colors">
            Inmobiliaria <span className="text-[#0078d4]">Mónica</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
              location.pathname === '/'
                ? 'bg-[#0078d4]/20 text-[#56a4ea] border border-[#0078d4]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 size={15} /> Catálogo
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                location.pathname === '/admin'
                  ? 'bg-[#0078d4]/20 text-[#56a4ea] border border-[#0078d4]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={15} /> Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              {isAdmin && (
                <span className="flex items-center gap-1 text-xs bg-[#0078d4]/15 text-[#56a4ea] px-2.5 py-1 rounded-full border border-[#0078d4]/30">
                  <ShieldCheck size={11} /> Admin
                </span>
              )}
              <span className="text-slate-400 text-sm hidden lg:block">{user.nombre}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut size={15} /> Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-[#0078d4] hover:bg-[#005fa3] text-white transition-all duration-200 shadow-lg shadow-[#0078d4]/30 hover:shadow-[#0078d4]/50"
            >
              <LogIn size={15} /> Iniciar sesión
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <MotionUl
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[#0078d4]/20 px-4 py-3 flex flex-col gap-1 bg-[#020c1b]/95"
          >
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-300 hover:text-[#56a4ea] py-2.5 px-2 rounded-lg hover:bg-[#0078d4]/10 transition-colors"
                onClick={() => setOpen(false)}
              >
                <Building2 size={16} /> Catálogo
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-slate-300 hover:text-[#56a4ea] py-2.5 px-2 rounded-lg hover:bg-[#0078d4]/10 transition-colors"
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
                  className="flex items-center gap-2 text-slate-300 hover:text-white py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors w-full"
                >
                  <LogOut size={16} /> Cerrar sesión ({user.nombre})
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-[#56a4ea] hover:text-white py-2.5 px-2 rounded-lg hover:bg-[#0078d4]/10 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LogIn size={16} /> Iniciar sesión
                </Link>
              )}
            </li>
          </MotionUl>
        )}
      </AnimatePresence>
    </MotionNav>
  )
}

