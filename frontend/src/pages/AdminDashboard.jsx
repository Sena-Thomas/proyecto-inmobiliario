import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Plus, Pencil, Trash2, CheckCircle, X, Euro,
  Building2, CalendarDays, Home as HomeIcon, Tag,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { getProperties, createProperty, updateProperty, deleteProperty, getUsers } from '../api'

const EMPTY_FORM = {
  titulo: '',
  descripcion: '',
  precio: '',
  latitud: '',
  longitud: '',
  url_imagen: '',
  estado: 'disponible',
  owner_id: '',
}

const STATUS_OPTS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'arrendado', label: 'Arrendado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'cita_programada', label: 'Cita programada' },
]

const STATUS_COLORS = {
  disponible: 'bg-emerald-500/20 text-emerald-400',
  arrendado: 'bg-amber-500/20 text-amber-400',
  vendido: 'bg-red-500/20 text-red-400',
  cita_programada: 'bg-sky-500/20 text-sky-400',
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    Promise.all([getProperties(), getUsers()])
      .then(([pRes, uRes]) => {
        setProperties(pRes.data)
        setUsers(uRes.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error cargando datos.')
        setLoading(false)
      })
  }, [refreshKey])

  const notify = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      precio: parseFloat(form.precio),
      latitud: form.latitud ? parseFloat(form.latitud) : null,
      longitud: form.longitud ? parseFloat(form.longitud) : null,
      owner_id: parseInt(form.owner_id),
    }
    try {
      if (editId) {
        await updateProperty(editId, payload)
        notify('Propiedad actualizada.')
      } else {
        await createProperty(payload)
        notify('Propiedad creada.')
      }
      setShowForm(false)
      setEditId(null)
      setForm(EMPTY_FORM)
      refresh()
    } catch {
      setError('Error guardando la propiedad.')
    }
  }

  const handleEdit = (p) => {
    setForm({
      titulo: p.titulo,
      descripcion: p.descripcion ?? '',
      precio: p.precio,
      latitud: p.latitud ?? '',
      longitud: p.longitud ?? '',
      url_imagen: p.url_imagen ?? '',
      estado: p.estado,
      owner_id: p.owner_id,
    })
    setEditId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    try {
      await deleteProperty(id)
      notify('Propiedad eliminada.')
      refresh()
    } catch {
      setError('Error eliminando la propiedad.')
    }
  }

  const statusCounts = STATUS_OPTS.reduce((acc, s) => {
    acc[s.value] = properties.filter((p) => p.estado === s.value).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-sky-400" size={28} />
            <h1 className="text-2xl font-bold text-white">Panel de Administrador</h1>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM) }}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={18} /> Nueva propiedad
          </button>
        </div>

        {/* Notification banners */}
        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-3 rounded-xl">
            <CheckCircle size={18} /> {success}
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl">
            <X size={18} /> {error}
            <button className="ml-auto" onClick={() => setError(null)}><X size={14} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATUS_OPTS.map((s) => (
            <div key={s.value} className="bg-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm mb-1">{s.label}</p>
              <p className="text-3xl font-bold text-white">{statusCounts[s.value] ?? 0}</p>
            </div>
          ))}
        </div>

        {/* Property form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                onClick={() => setShowForm(false)}
              >
                <X size={22} />
              </button>
              <h2 className="text-xl font-bold text-white mb-5">
                {editId ? 'Editar propiedad' : 'Nueva propiedad'}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="Título *" icon={<HomeIcon size={14} />}>
                  <input
                    required
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="input-dark"
                  />
                </Field>

                <Field label="Descripción" icon={<Pencil size={14} />}>
                  <textarea
                    rows={3}
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="input-dark resize-none"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Precio (€) *" icon={<Euro size={14} />}>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.precio}
                      onChange={(e) => setForm({ ...form, precio: e.target.value })}
                      className="input-dark"
                    />
                  </Field>
                  <Field label="Estado *" icon={<Tag size={14} />}>
                    <select
                      value={form.estado}
                      onChange={(e) => setForm({ ...form, estado: e.target.value })}
                      className="input-dark"
                    >
                      {STATUS_OPTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Latitud">
                    <input
                      type="number"
                      step="any"
                      value={form.latitud}
                      onChange={(e) => setForm({ ...form, latitud: e.target.value })}
                      className="input-dark"
                      placeholder="38.3452"
                    />
                  </Field>
                  <Field label="Longitud">
                    <input
                      type="number"
                      step="any"
                      value={form.longitud}
                      onChange={(e) => setForm({ ...form, longitud: e.target.value })}
                      className="input-dark"
                      placeholder="-0.4810"
                    />
                  </Field>
                </div>

                <Field label="URL de imagen">
                  <input
                    type="url"
                    value={form.url_imagen}
                    onChange={(e) => setForm({ ...form, url_imagen: e.target.value })}
                    className="input-dark"
                    placeholder="https://..."
                  />
                </Field>

                <Field label="Propietario (usuario) *" icon={<Building2 size={14} />}>
                  <select
                    required
                    value={form.owner_id}
                    onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
                    className="input-dark"
                  >
                    <option value="">Seleccionar usuario…</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.email})
                      </option>
                    ))}
                  </select>
                </Field>

                <button
                  type="submit"
                  className="mt-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {editId ? 'Guardar cambios' : 'Crear propiedad'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p className="text-center text-slate-400 py-20 animate-pulse">Cargando…</p>
        ) : (
          <div className="bg-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-slate-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4 text-left">Título</th>
                  <th className="px-5 py-4 text-left hidden md:table-cell">Precio</th>
                  <th className="px-5 py-4 text-left hidden lg:table-cell">Propietario</th>
                  <th className="px-5 py-4 text-left">Estado</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500">
                      Sin propiedades aún. ¡Crea la primera!
                    </td>
                  </tr>
                )}
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-750 transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{p.titulo}</td>
                    <td className="px-5 py-4 text-slate-300 hidden md:table-cell">
                      €{Number(p.precio).toLocaleString('es-ES')}
                    </td>
                    <td className="px-5 py-4 text-slate-400 hidden lg:table-cell">
                      {p.owner?.nombre ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.estado]}`}>
                        {STATUS_OPTS.find((s) => s.value === p.estado)?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, icon, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-slate-300 text-xs font-medium uppercase tracking-wide">
        {icon}
        {label}
      </span>
      {children}
    </label>
  )
}
