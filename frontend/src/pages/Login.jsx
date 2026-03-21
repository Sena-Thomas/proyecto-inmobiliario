import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Mail, Lock, LogIn, Chrome } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { createUser } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const { login, loginGoogle } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'register') {
        await createUser({ nombre: form.nombre, email: form.email, password: form.password })
        await login(form.email, form.password)
      } else {
        await login(form.email, form.password)
      }
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.detail
      setError(msg || 'Credenciales incorrectas. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    // Google One Tap / OAuth requires a real GOOGLE_CLIENT_ID env variable.
    // This button will be functional once VITE_GOOGLE_CLIENT_ID is set.
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError('El inicio de sesión con Google no está configurado aún.')
      return
    }
    // Load the Google Identity Services library dynamically
    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        try {
          setLoading(true)
          await loginGoogle(credential)
          navigate('/')
        } catch {
          setError('No se pudo iniciar sesión con Google.')
        } finally {
          setLoading(false)
        }
      },
    })
    window.google?.accounts.id.prompt()
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-2xl mb-8">
          <Building2 size={32} />
          <span>Inmobiliaria Mónica</span>
        </Link>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Mode tabs */}
          <div className="flex rounded-xl bg-slate-900 p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null) }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  mode === m
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <label className="flex flex-col gap-1.5">
                <span className="text-slate-400 text-xs uppercase tracking-wide">Nombre completo</span>
                <input
                  required
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="input-dark"
                  placeholder="Tu nombre"
                />
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-slate-400 text-xs uppercase tracking-wide flex items-center gap-1">
                <Mail size={12} /> Email
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-dark"
                placeholder="tucorreo@ejemplo.com"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-slate-400 text-xs uppercase tracking-wide flex items-center gap-1">
                <Lock size={12} /> Contraseña
              </span>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-dark"
                placeholder="••••••••"
                minLength={6}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <LogIn size={18} />
              {loading ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-xs">o</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            <Chrome size={18} />
            Continuar con Google
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link to="/" className="text-emerald-400 hover:underline">← Volver al catálogo</Link>
        </p>
      </div>
    </div>
  )
}
