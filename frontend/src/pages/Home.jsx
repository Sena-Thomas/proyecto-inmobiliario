import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, MessageCircle, Instagram, Facebook } from 'lucide-react'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import { getProperties } from '../api'

const MONICA_PHONE = import.meta.env.VITE_MONICA_PHONE || '573001234567'
const MONICA_WHATSAPP = `https://wa.me/${MONICA_PHONE}?text=${encodeURIComponent('Hola Mónica, estoy interesado/a en tus propiedades. ¿Me puedes dar más información?')}`
const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/'
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/'

const TRANSACTION_TYPES = [
  { value: '', label: 'Todo' },
  { value: 'venta', label: 'Venta' },
  { value: 'arriendo', label: 'Arriendo' },
]

const STATUSES = [
  { value: '', label: 'Todos los estados' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'arrendado', label: 'Arrendado' },
]

export default function Home() {
  const [properties, setProperties] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProperties()
      .then((res) => setProperties(res.data))
      .catch(() => setError('No se pudieron cargar las propiedades.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (p.descripcion ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.direccion ?? '').toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter ? p.tipo_transaccion === typeFilter : true
    const matchStatus = statusFilter ? p.estado === statusFilter : true
    return matchSearch && matchType && matchStatus
  })

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero */}
      <header className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600')] bg-cover bg-center" />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Asesora Inmobiliaria · Mónica Anzola
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Encuentra tu hogar <span className="text-emerald-400">ideal</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Casas, apartamentos y locales para venta y arriendo.
            Te acompañamos en cada paso de tu proceso inmobiliario.
          </p>

          {/* Search & filters */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por título, dirección o descripción…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
              >
                {TRANSACTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-3 px-4 rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href={MONICA_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Facebook size={16} /> Facebook
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading && (
          <p className="text-center text-slate-400 py-20 text-lg animate-pulse">
            Cargando propiedades…
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 py-20 text-lg">{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-slate-500 py-20 text-lg">
            No se encontraron propiedades con esos filtros.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-slate-400 text-sm mb-6">
              {filtered.length} propiedad{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Floating WhatsApp button */}
      <a
        href={MONICA_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-3 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105"
        title="Contactar a Mónica por WhatsApp"
      >
        <MessageCircle size={22} />
        <span className="hidden sm:block">Contactar</span>
      </a>

      <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} Inmobiliaria Mónica Anzola · Asesora Inmobiliaria
      </footer>
    </div>
  )
}
