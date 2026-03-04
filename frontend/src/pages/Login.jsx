import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder: redirect based on hardcoded demo credentials
    // In production this would call a /auth/login endpoint
    if (form.email.includes('admin')) {
      navigate('/admin')
    } else if (form.email.includes('comercial')) {
      navigate('/comercial')
    } else {
      setError('Credenciales incorrectas. Usa admin@... o comercial@...')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 text-sky-400 font-bold text-2xl mb-8">
          <Building2 size={32} />
          <span>InmoAlicante</span>
        </Link>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-6 text-center">Iniciar sesión</h1>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                placeholder="admin@inmobiliaria.es"
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
              />
            </label>

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <LogIn size={18} /> Entrar
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link to="/" className="text-sky-400 hover:underline">← Volver al catálogo</Link>
        </p>
      </div>
    </div>
  )
}
