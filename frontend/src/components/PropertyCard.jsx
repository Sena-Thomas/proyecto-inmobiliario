import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MessageCircle, MapPin, Tag, Maximize2 } from 'lucide-react'
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
  reservado: { label: 'Reservado', color: 'bg-sky-500' },
}

const TIPO_LABELS = {
  venta: { label: 'Venta', color: 'bg-violet-600' },
  arriendo: { label: 'Arriendo', color: 'bg-orange-500' },
}

const MONICA_PHONE = import.meta.env.VITE_MONICA_PHONE || '573001234567'

export default function PropertyCard({ property }) {
  const {
    titulo,
    descripcion,
    precio,
    tamaño_m2,
    direccion,
    url_imagen,
    latitud,
    longitud,
    estado,
    tipo_transaccion,
    owner,
  } = property

  const status = STATUS_LABELS[estado] ?? STATUS_LABELS.disponible
  const tipo = TIPO_LABELS[tipo_transaccion] ?? TIPO_LABELS.venta

  const whatsappMsg = encodeURIComponent(
    `Hola Mónica, estoy interesado/a en la propiedad "${titulo}"${direccion ? ` ubicada en ${direccion}` : ''}. ¿Podría darme más información?`
  )
  const phone = owner?.telefono?.replace(/\D/g, '') || MONICA_PHONE
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMsg}`

  return (
    <article className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col hover:shadow-emerald-500/20 hover:shadow-2xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={url_imagen || 'https://placehold.co/600x400/1e293b/94a3b8?text=Sin+imagen'}
          alt={titulo}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${tipo.color}`}>
            {tipo.label}
          </span>
        </div>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full text-white ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{titulo}</h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-xl">
            <Tag size={18} />
            ${Number(precio).toLocaleString('es-CO')}
          </div>
          {tamaño_m2 && (
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Maximize2 size={14} />
              {tamaño_m2} m²
            </div>
          )}
        </div>

        {/* Address */}
        {direccion && (
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="line-clamp-1">{direccion}</span>
          </div>
        )}

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

        {!latitud && !longitud && !direccion && (
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <MapPin size={12} />
            <span>Ubicación no disponible</span>
          </div>
        )}

        {/* WhatsApp contact */}
        <div className="mt-auto pt-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-3 rounded-xl transition-colors w-full"
          >
            <MessageCircle size={16} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
