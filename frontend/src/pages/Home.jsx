import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import { getProperties } from '../api'

const STATUSES = [
  { value: '', label: 'Todos' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'arrendado', label: 'Arrendado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'cita_programada', label: 'Cita programada' },
]

export default function Home() {
  const [properties, setProperties] = useState([])
  const [search, setSearch] = useState('')
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
      (p.descripcion ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter ? p.estado === statusFilter : true
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero */}
      <header className="relative bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600')] bg-cover bg-center" />
        <div className="relative max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Tu hogar en <span className="text-sky-400">Alicante</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Descubre casas, apartamentos y locales disponibles para compra,
            arriendo o alquiler en la Costa Blanca.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
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

      <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} InmoAlicante · Alicante, España
      </footer>
    </div>
  )
}
