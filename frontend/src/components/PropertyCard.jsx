import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MessageCircle, Facebook, CalendarDays, MapPin, Euro } from 'lucide-react'
import L from 'leaflet'

// Fix default Leaflet marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_LABELS = {
  disponible: { label: 'Disponible', color: 'bg-emerald-500' },
  arrendado: { label: 'Arrendado', color: 'bg-amber-500' },
  vendido: { label: 'Vendido', color: 'bg-red-500' },
  cita_programada: { label: 'Cita programada', color: 'bg-sky-500' },
}

export default function PropertyCard({ property }) {
  const {
    titulo,
    descripcion,
    precio,
    url_imagen,
    latitud,
    longitud,
    estado,
    owner,
  } = property

  const status = STATUS_LABELS[estado] ?? STATUS_LABELS.disponible
  const whatsappUrl = owner?.telefono
    ? `https://wa.me/${owner.telefono.replace(/\D/g, '')}`
    : '#'
  const facebookUrl = owner?.facebook_link ?? '#'

  return (
    <article className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col hover:shadow-sky-500/20 hover:shadow-2xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={url_imagen || 'https://placehold.co/600x400/1e293b/94a3b8?text=Sin+imagen'}
          alt={titulo}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full text-white ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{titulo}</h3>

        <div className="flex items-center gap-1 text-sky-400 font-semibold text-xl">
          <Euro size={18} />
          {Number(precio).toLocaleString('es-ES')}
        </div>

        {descripcion && (
          <p className="text-slate-400 text-sm line-clamp-3">{descripcion}</p>
        )}

        {/* Map */}
        {latitud && longitud && (
          <div className="rounded-xl overflow-hidden h-40 mt-1">
            <MapContainer
              center={[latitud, longitud]}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full"
              attributionControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[latitud, longitud]}>
                <Popup>{titulo}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {!latitud && !longitud && (
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <MapPin size={12} />
            <span>Ubicación no disponible</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            <MessageCircle size={16} />
            Contactar por WhatsApp
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            <Facebook size={16} />
            Ver en Facebook
          </a>

          <button
            className="flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium py-2 rounded-xl transition-colors"
            onClick={() => alert(`Cita para: ${titulo}\nContacta al vendedor por WhatsApp o Facebook.`)}
          >
            <CalendarDays size={16} />
            Agendar Cita
          </button>
        </div>
      </div>
    </article>
  )
}
